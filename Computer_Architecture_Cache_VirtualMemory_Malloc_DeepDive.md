# KIẾN TRÚC MÁY TÍNH & BỘ NHỚ: TỪ CPU CACHE ĐẾN HEAP ALLOCATION
**Tên file hệ thống đề xuất:** `Computer_Architecture_Cache_VirtualMemory_Malloc_DeepDive.md`
**Mục đích:** Tài liệu tra cứu chuyên sâu toàn bộ luồng vận hành của dữ liệu từ cấp độ Bit/Byte phần cứng CPU đến Hệ điều hành và Thư viện User Space.

---

## MỤC LỤC
1. [Bản Chất Của Array Trong Cache & Cấu Trúc Địa Chỉ (Tag, Index, Offset)](#1-bản-chất-của-array-trong-cache--cấu-trúc-địa-chỉ-tag-index-offset)
2. [Chi Tiết Luồng Đọc/Ghi Khi CPU Truy Cập Mảng](#2-chi-tiết-luồng-đọcghi-khi-cpu-truy-cập-mảng)
3. [L1 Cache (VIPT) vs L2/L3 Cache (PIPT) & Thảm Họa Nếu L2/L3 Dùng Index Ảo](#3-l1-cache-vipt-vs-l2l3-cache-pipt--thảm-họa-nếu-l2l3-dùng-index-ảo)
4. [Bộ Nhớ Ảo (Virtual Memory) vs RAM Thật (Physical Memory) & Ranh Giới Trang 4KB](#4-bộ-nhớ-ảo-virtual-memory-vs-ram-thật-physical-memory--ranh-giới-trang-4kb)
5. [Buddy Allocator Trong Kernel: Tại Sao Phải Cấp Khối $2^n$ Trang RAM?](#5-buddy-allocator-trong-kernel-tại-sao-phải-cấp-khối-2n-trang-ram)
6. [Cơ Chế `malloc` Ở User Space: "Buôn Sỉ - Bán Lẻ", Metadata Ẩn & `free()`](#6-cơ-chế-malloc-ở-user-space-buôn-sỉ---bán-lẻ-metadata-ẩn--free)
7. [Mã Nguồn C Thực Tế Soi Trực Tiếp Mọi Hiện Tượng](#7-mã-nguồn-c-thực-tế-soi-trực-tiếp-mọi-hiện-tượng)

---

## 1. BẢN CHẤT CỦA ARRAY TRONG CACHE & CẤU TRÚC ĐỊA CHỈ (TAG, INDEX, OFFSET)

### 1.1 Cache không biết "Mảng" hay "Kiểu dữ liệu" là gì
*   Phần cứng CPU Cache không có khái niệm `int`, `float`, `struct` hay `Array`.
*   Cache vận hành hoàn toàn dựa trên các khối dữ liệu cố định gọi là **Cache Line** (kích thước tiêu chuẩn hiện nay là **64 Bytes** = 512 bits).
*   Khi bạn khai báo một mảng `int arr[32]`, mảng này tốn $32 \times 4 = 128\text{ Bytes}$. Khi nạp vào Cache, nó bị xé làm đúng 2 khối 64 Bytes độc lập.

### 1.2 Cấu trúc phân rã của một Địa chỉ Vật lý (Physical Address)
Khi CPU cần truy xuất bộ nhớ tại một địa chỉ vật lý, phần cứng Cache chia chuỗi bit địa chỉ đó thành 3 phần:

```text
+------------------------+-------------------+--------------------+
|     TAG (Bit Cao)      | INDEX (Bit Giữa)  | OFFSET (Bit Thấp)  |
+------------------------+-------------------+--------------------+
```

*   **Offset ($0 \rightarrow 5$ bit cuối đối với Cache Line 64B):** Do $2^6 = 64$, 6 bit cuối xác định vị trí chính xác của Byte thứ bao nhiêu (từ Byte 0 đến Byte 63) bên trong khối dữ liệu 64 Bytes.
*   **Index (Các bit tiếp theo):** Dùng làm "chỉ mục" để nhảy trực tiếp đến dòng Cache Line (Set) trong bộ nhớ đệm L1/L2/L3. Số lượng bit Index phụ thuộc vào số ô tủ (Sets) của Cache.
*   **Tag (Các bit cao còn lại):** Đóng vai trò như **Mã ID / Thẻ căn cước**. Mọi Cache Line đều có một ô nhớ đi kèm gọi là `Tag Store`. Khi CPU dùng Index tìm đến đúng ô tủ, nó lấy **Tag của Địa chỉ phát ra** so sánh với **Tag Store** đang lưu trong ô tủ đó.
    *   Nếu `Tag match` VÀ `Valid bit == 1`: **Cache Hit** (Trúng Cache).
    *   Nếu `Tag mismatch` HOẶC `Valid bit == 0`: **Cache Miss** (Hụt Cache).

---

## 2. CHI TIẾT LUỒNG ĐỌC/GHI KHI CPU TRUY CẤP MẢNG

### 2.1 Ví dụ bài toán cụ thể
Giả sử có mảng `int arr[32]` nằm tại Địa chỉ Vật lý `0x00401200`.
Mảng này gồm 128 Bytes, được chia thành 2 Khối 64B:
*   **Khối 1:** `arr[0]` đến `arr[15]` (Địa chỉ `0x00401200` $\rightarrow$ `0x0040123F`).
*   **Khối 2:** `arr[16]` đến `arr[31]` (Địa chỉ `0x00401240` $\rightarrow$ `0x0040127F`).

Giả sử qua phép tính phân rã bit địa chỉ:
*   `0x00401200` có Index = 8, Tag = `0x00401`.
*   `0x00401240` có Index = 9, Tag = `0x00401`.

### 2.2 Sơ đồ trạng thái Cache Line sau khi nạp mảng
```text
┌────────────────────────────────────────────────────────────────────────┐
│ CACHE LINE SỐ 8 (Xác định nhờ Index = 8)                               │
├───────────┬────────────────────────────────────────────────────────────┤
│ Valid Bit │ 1                                                          │
├───────────┼────────────────────────────────────────────────────────────┤
│ Tag Store │ 0x00401  <── (Chính là phần Tag của địa chỉ &arr[0])       │
├───────────┼────────────────────────────────────────────────────────────┤
│ Data Block│ [Giá trị 64 Bytes: arr[0], arr[1], arr[2], ..., arr[15]]   │
└───────────┴────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ CACHE LINE SỐ 9 (Xác định nhờ Index = 9)                               │
├───────────┬────────────────────────────────────────────────────────────┤
│ Valid Bit │ 1                                                          │
├───────────┼────────────────────────────────────────────────────────────┤
│ Tag Store │ 0x00401  <── (Chính là phần Tag của địa chỉ &arr[16])      │
├───────────┼────────────────────────────────────────────────────────────┤
│ Data Block│ [Giá trị 64 Bytes: arr[16], arr[17], arr[18], ..., arr[31]]│
└───────────┴────────────────────────────────────────────────────────────┘
```

### 2.3 Diễn biến từng bước khi CPU thực hiện lệnh: `int x = arr[5];`
1.  **Tính Địa chỉ:** CPU tính ra địa chỉ của `arr[5]` là `0x00401214` (vì $5 \times 4 = 20 = 0x14$ bytes kể từ đầu mảng).
2.  **Bóc Tách Địa Chỉ `0x00401214`:**
    *   Tag = `0x00401`
    *   Index = `8`
    *   Offset = `20` (Byte thứ 20 trong khối).
3.  **Định Vị Ô Tủ:** CPU dùng Index = 8 nhảy thẳng đến **Cache Line số 8**.
4.  **Kiểm Tra Tag Store:** CPU đọc `Tag Store` của Cache Line số 8 thấy `0x00401`, so sánh với Tag cần tìm là `0x00401` $\rightarrow$ **TRÙNG KHỚP! (Cache Hit)**.
5.  **Rút Dữ Liệu:** CPU dùng Offset = 20, trỏ thẳng vào Byte thứ 20 trong Data Block (chính là vị trí bắt đầu của `arr[5]`), lấy ra 4 bytes và nạp vào thanh ghi CPU.
    *   **Thời gian xử lý:** $\sim 1$ nanosecond ($1 \rightarrow 2$ chu kỳ CPU).

---

## 3. L1 CACHE (VIPT) VS L2/L3 CACHE (PIPT) & THẢM HỌA NẾU L2/L3 DÙNG INDEX ẢO

### 3.1 Khái niệm VIPT và PIPT
*   **VIPT (Virtually Indexed, Physically Tagged):** Dùng Index của **Địa chỉ Ảo** để định vị Cache Line, nhưng dùng Tag của **Địa chỉ Vật lý** để so sánh Tag Store.
*   **PIPT (Physically Indexed, Physically Tagged):** Dùng cả Index và Tag của **Địa chỉ Vật lý** hoàn chỉnh.

### 3.2 Tại sao L1 Cache dùng được VIPT? (Bức tường 4KB)
Trong cơ chế Phân trang (Paging) 4KB chuẩn:
*   Một trang bộ nhớ có kích thước $4096\text{ Bytes} = 2^{12}\text{ Bytes}$.
*   Do đó, **12 bit cuối (bit 0 đến bit 11)** của Địa chỉ Ảo và Địa chỉ Vật lý **LUÔN LUÔN GIỐNG HỆT NHAU 100%**.

L1 Cache có kích thước nhỏ (ví dụ $32\text{KB}$, 8-way set associative):
*   Offset tốn 6 bits (bit $0 \rightarrow 5$).
*   Index tốn 6 bits (bit $6 \rightarrow 11$).
*   Tổng cộng Index + Offset nằm trọn trong 12 bit cuối!
*   **Hệ quả:** Index Ảo và Index Thật hoàn toàn trùng nhau. CPU có thể lấy Index từ Địa chỉ Ảo nhảy ngay tới Cache Line L1 mà **không cần chờ MMU dịch địa chỉ xong**. Quá trình dịch địa chỉ của MMU chạy song song, khi trả về Physical Tag thì L1 đã đứng sẵn ở ô tủ để so sánh Tag $\rightarrow$ Tốc độ siêu tốc.

### 3.3 Tại sao L2/L3 BẮT BUỘC phải dùng PIPT (Địa chỉ Vật lý)?

Nếu L2/L3 (dung lượng vài MB đến chục MB) cố tình dùng Virtual Index, hệ thống sẽ sập do 3 lý do kỹ thuật:

#### Lý do 1: Phình to Bit Index (Vượt quá 12 bits)
*   L2/L3 Cache rất lớn, số ô tủ (Index) phải tốn $8, 10, 12$ bits hoặc hơn.
*   Cộng thêm 6 bit Offset, phần Index + Offset sẽ lấn sang **Bit 12, 13, 14... trở lên**.
*   Ở các bit từ 12 trở lên, **Địa chỉ Ảo và Địa chỉ Vật lý KHÁC NHAU HOÀN TOÀN**. Index Ảo $\neq$ Index Thật!

#### Lý do 2: Thảm họa Cache Aliasing (Data Corruption)
*   Giả sử 2 tiến trình A và B cùng chia sẻ một vùng RAM vật lý tại địa chỉ `0x99999000`.
*   Tiến trình A dùng Địa chỉ Ảo `0x11111000` (Index Ảo = 15).
*   Tiến trình B dùng Địa chỉ Ảo `0x22222000` (Index Ảo = 80).
*   Nếu L2/L3 dùng Virtual Index: Cùng một ô RAM vật lý nhưng sẽ bị nạp vào **2 ô Cache hoàn toàn khác nhau** (Ô 15 và Ô 80).
*   Khi Tiến trình A sửa dữ liệu ở Ô 15, Tiến trình B đọc ở Ô 80 vẫn thấy dữ liệu cũ $\rightarrow$ **Sai lệch dữ liệu cực kỳ nghiêm trọng!**

#### Lý do 3: Cache Coherence (Đồng bộ đa nhân CPU)
*   L3 Cache là bộ nhớ đệm dùng chung cho tất cả các Core.
*   Các nhân CPU giao tiếp và canh chừng dữ liệu của nhau (Snooping/MESI Protocol) hoàn toàn bằng **Địa chỉ Vật lý**.
*   Nếu dùng Virtual Index, Nhân 1 không thể nào biết Nhân 2 đang đọc/ghi ô nhớ vật lý nào vì mỗi nhân có một bảng địa chỉ ảo riêng.

#### Lý do 4: Vô ích về mặt tốc độ
*   Khi CPU truy cập L1 bị Miss và rơi xuống L2/L3, **MMU đã dịch xong Địa chỉ Vật lý hoàn chỉnh ở bước L1 rồi**.
*   CPU đã cầm sẵn Địa chỉ Vật lý trên tay, việc dùng Địa chỉ Vật lý cho L2/L3 không tốn thêm bất kỳ nanosecond nào.

---

## 4. BỘ NHỚ ẢO (VIRTUAL MEMORY) VS RAM THẬT (PHYSICAL MEMORY) & RANH GIỚI TRANG 4KB

### 4.1 Mô hình "Cuốn sách" và "Trang sách bị xé"
*   **Virtual Memory (Bộ nhớ Ảo):** Giống như một **cuốn sách** được đánh số trang tuần tự $1, 2, 3, 4...$ Lập trình viên nhìn vào thấy một mảng hay một biến nằm liền kề nhau rất ngăn nắp.
*   **Physical Memory (RAM Thật):** Giống như **các trang của cuốn sách đó bị xé rời và vứt rải rác** vào các ngăn tủ khác nhau trong thanh RAM.
*   **Page Table (Bảng phân trang) & MMU:** Đóng vai trò làm **Tấm Mục Lục** dịch từ Trang Ảo (Virtual Page) $\rightarrow$ Khung RAM Vật lý (Physical Frame).

### 4.2 Chi tiết Ranh giới Trang 4KB (Page Boundary)
Một đơn vị quản lý bộ nhớ cơ bản (Page) chuẩn x86/ARM có kích thước **4 KB (4096 Bytes)**.

#### TH1: Thao tác BÊN TRONG 1 Trang (Dưới 4096 Bytes)
*   Địa chỉ Ảo liền kề **THÌ** Địa chỉ Vật lý **CŨNG LIỀN KỀ**.
*   Ví dụ: `arr[0]` (Byte 0) và `arr[15]` (Byte 60) cùng nằm trong Trang 1. Địa chỉ RAM thật của chúng nằm sát vách nhau $\rightarrow$ Nạp thẳng vào 1 Cache Line 64B.

#### TH2: Thao tác VƯỢT RANH GIỚI Trang (Vượt mốc 4KB)
*   Xét phần tử `arr[1023]` ( Byte 4092 - Cuối Trang Ảo 1) và `arr[1024]` (Byte 4096 - Đầu Trang Ảo 2):
*   **Trên Bộ nhớ Ảo:** `arr[1023]` và `arr[1024]` nằm ngay sát cạnh nhau (chênh nhau 4 bytes).
*   **Trên RAM Vật lý:** Trang Ảo 1 có thể nằm ở Khung RAM Vật lý `#100`, còn Trang Ảo 2 có thể bị OS đẩy sang Khung RAM Vật lý `#9500` (cách xa hàng Gigabytes)!

```text
VIRTUAL MEMORY:   [--- Virtual Page 1 (4KB) ---] [--- Virtual Page 2 (4KB) ---] (Liền kề)
                                 │                              │
                                 ▼                              ▼
PHYSICAL RAM:     [ Physical Frame #100 ] ...... [ Physical Frame #9500 ]       (Rải rác)
```

---

## 5. BUDDY ALLOCATOR TRONG KERNEL: TẠI SAO PHẢI CẤP KHỐI $2^n$ TRANG RAM?

Nếu Bộ nhớ Ảo đã giúp ứng dụng ghép các trang rải rác thành dải liền kề, tại sao ở tầng Kernel vẫn cần thuật toán **Buddy Allocator** để quản lý các khối RAM vật lý liền kề theo lũy thừa của 2 ($2^0, 2^1, 2^2, 2^3... 2^n$ trang 4KB)?

### 5.1 3 Lý do bắt buộc của Buddy Allocator

#### 1. Phục vụ DMA (Direct Memory Access)
*   Các phần cứng ngoại vi như **Card mạng (NIC), Card màn hình (GPU), Ổ cứng SSD** đọc/ghi dữ liệu trực tiếp vào RAM mà **KHÔNG ĐI QUA CHIP MMU**.
*   Chúng giao tiếp hoàn toàn bằng **Địa chỉ Vật lý**.
*   Khi Card mạng muốn nhận gói tin 16KB, nó yêu cầu 4 trang RAM vật lý **phải hoàn toàn liền kề nhau về mặt vật lý**. Dù có Bộ nhớ Ảo cũng không giúp được DMA. Buddy Allocator phải đứng ra cấp khối $2^2 = 4$ trang vật lý liền kề này.

#### 2. Tạo Trang Khổng Lồ (Huge Pages)
*   Để tối ưu cho Database (Oracle, MySQL) hoặc Máy ảo (KVM), OS gom 512 trang 4KB vật lý sát vách nhau để tạo thành **Trang 2MB** (giúp giảm tải cho bộ đệm dịch địa chỉ TLB).
*   Buddy Allocator chính là bộ công cụ duy nhất giúp Kernel tìm và gom 512 trang vật lý sát vách đó.

#### 3. Thuật toán Gộp RAM siêu tốc $O(1)$ (Coalescing)
*   Khi một khối RAM bị giải phóng, Buddy Allocator kiểm tra khối "Bạn thân" (Buddy) của nó.
*   Nếu khối Buddy cũng đang rảnh $\rightarrow$ Gộp ngay lập tức thành khối gấp đôi $2^{n+1}$ trong thời gian $O(1)$.

### 5.2 Hiện tượng Phân Mảnh Bên Trong (Internal Fragmentation)
Nếu bạn (hoặc Kernel) xin trực tiếp từ Buddy Allocator một vùng nhớ rộng **5 trang RAM** (20KB):
1.  Buddy Allocator chỉ có các khối kích thước $1, 2, 4, 8, 16...$ trang.
2.  Do 5 trang $> 4$ trang ($2^2$), Buddy Allocator bắt buộc phải giao khối **8 trang ($2^3 = 32\text{KB}$)**.
3.  **Số phận của 3 trang dôi ra (12KB):** Bạn chỉ dùng 5 trang, 3 trang còn lại hoàn toàn trống. Nhưng **Buddy Allocator khóa cứng toàn bộ khối 8 trang này**. OS KHÔNG THỂ lấy 3 trang trống đó cấp cho tiến trình khác $\rightarrow$ **Mất trắng 12KB do phân mảnh bên trong**.

---

## 6. CƠ CHẾ `MALLOC` Ở USER SPACE: "BUÔN SỈ - BÁN LẺ", METADATA ẨN & `FREE()`

Để khắc phục việc lãng phí bộ nhớ của Buddy Allocator và tránh việc gọi System Call giật lag, thư viện C chuẩn (`glibc`) cung cấp bộ quản lý bộ nhớ `malloc` ở User Space.

### 6.1 Mô hình "Buôn Sỉ - Bán Lẻ"
```text
[Ứng dụng C/C++]
       │
       ▼  (Gõ malloc(32), malloc(1024) - Bán lẻ theo Byte)
[Thư viện malloc (glibc / User Space)]
       │
       ▼  (Chỉ gọi khi kho hết hàng: brk/sbrk hoặc mmap - Buôn sỉ khối lớn)
[Kernel / Buddy Allocator (Kernel Space)]
```

*   **Buôn sỉ:** Khi mới chạy, `malloc` gọi System Call (`brk`) xin Kernel một phân vùng lớn (Heap, ví dụ 128KB). Kernel giao qua Buddy Allocator.
*   **Bán lẻ:** Khi bạn gọi `malloc(32)`, `malloc` tự tay lấy "dao" cắt 32 bytes từ phân vùng Heap 128KB đó giao cho bạn. **Thao tác này chạy 100% ở User Space, chỉ tốn vài nanosecond, không hề gọi Kernel.**

### 6.2 Chunk Metadata (Thẻ Quản Lý Ẩn 16-byte)
Khi bạn gọi `void *p = malloc(1024);` (Xin 1024 Bytes):
*   `malloc` thực tế sẽ xén một khối **1040 Bytes** từ Heap.
*   Nó giấu **16 Bytes đầu tiên** làm `Chunk Metadata` (chứa kích thước khối = 1040, và các cờ trạng thái `A|M|P`).
*   Con trỏ `p` trả về cho bạn **nằm ngay sau 16 bytes Metadata đó**.

```text
Địa chỉ Heap:  [ Byte 0 ... Byte 15 ] [ Byte 16 .................... Byte 1039 ]
               └────────────────────┘ └────────────────────────────────────────┘
                 CHUNK METADATA         VÙNG DỮ LIỆU BẠN SỬ DỤNG (1024 Bytes)
                                      ▲
                                      │
                               Con trỏ p trả về
```

### 6.3 Cơ chế `free(p)` và Free Lists / Bins
Tại sao khi gọi `free(p)`, bạn không cần truyền vào kích thước cần xóa?
1.  **Đọc Metadata:** Hàm `free(p)` tự động lùi con trỏ về trước 16 bytes (`p - 16`), đọc Metadata và biết chính xác khối này rộng **1040 Bytes**.
2.  **Không trả RAM cho Kernel ngay:** `free(p)` **KHÔNG** gọi System Call để trả 1040 bytes này về cho Kernel.
3.  **Đưa vào Free List:** `malloc` đánh dấu khối 1040 bytes này là *"Đang rảnh"* và nhét nó vào danh sách tồn kho (Free Lists/Bins).
4.  **Tái sử dụng:** Lần tới khi bạn gọi `malloc(1024)`, `malloc` lục trong Free List, thấy ô 1040 bytes cũ này và **giao ngay lập tức địa chỉ cũ đó cho bạn**.

### 6.4 Ngoại lệ Cấp Phát Siêu Lớn (`mmap`)
*   Nếu bạn gọi `malloc(10 * 1024 * 1024)` (Xin 10MB, vượt quá ngưỡng `M_MMAP_THRESHOLD` thường là 128KB):
*   `malloc` nhận thấy 10MB quá to, nhét vào Heap chung sẽ làm phân mảnh Heap.
*   `malloc` **bỏ qua Heap**, gọi trực tiếp System Call `mmap` xin Kernel cấp riêng một dải RAM 10MB độc lập.
*   Khi bạn `free()` con trỏ 10MB này, `malloc` lập tức gọi `munmap` để trả thẳng 10MB về cho Kernel.

---

## 7. MÃ NGUỒN C THỰC TẾ SOI TRỰC TIẾP MỌI HIỆN TƯỢNG

Đoạn mã C dưới đây minh họa toàn bộ các cơ chế đã học: Kho bán lẻ, Chunk Metadata ẩn, Tái sử dụng bộ nhớ và Ngoại lệ `mmap`.

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int main() {
    printf("=======================================================
");
    printf(" 1. KIỂM TRA KHO BÁN LẺ HEAP & CHUNK METADATA (16-BYTE) 
");
    printf("=======================================================
");

    // Xin 2 khối 1KB (1024 Bytes)
    char *p1 = (char *)malloc(1024);
    char *p2 = (char *)malloc(1024);

    printf("Địa chỉ con trỏ p1: %p
", (void *)p1);
    printf("Địa chỉ con trỏ p2: %p
", (void *)p2);

    // Tính khoảng cách giữa 2 con trỏ
    uintptr_t diff = (uintptr_t)p2 - (uintptr_t)p1;
    printf("Khoảng cách p2 - p1: %lu Bytes
", diff);
    printf("-> Giải thích: 1024 Bytes dữ liệu + 16 Bytes Metadata ẩn = 1040 Bytes!
");

    // SOI TRỰC TIẾP VÀO METADATA ẨN NẰM TRƯỚC P1
    // Lùi con trỏ p1 về trước 8 bytes để đọc Size Header
    size_t *metadata_size_ptr = (size_t *)((char *)p1 - 8);
    // Xóa bỏ các bit cờ (flags) ở 3 bit cuối bằng phép AND bít (~7)
    size_t actual_chunk_size = *metadata_size_ptr & ~7;
    printf("Đọc trực tiếp từ Chunk Metadata nằm trước p1: Chunk Size = %lu Bytes
", actual_chunk_size);


    printf("
=======================================================
");
    printf(" 2. KIỂM TRA CƠ CHẾ TÁI SỬ DỤNG BỘ NHỚ (FREE LISTS)    
");
    printf("=======================================================
");

    printf("Gọi free(p1) -> Trả p1 về kho Free List của malloc...
");
    free(p1);

    char *p3 = (char *)malloc(1024); // Xin lại 1KB
    printf("Địa chỉ con trỏ p3 (khi xin lại 1KB): %p
", (void *)p3);

    if (p3 == p1) {
        printf("=> KẾT QUẢ: p3 TRÙNG HOÀN TOÀN với p1 cũ!
");
        printf("   malloc đã tái sử dụng ngay ô nhớ rảnh trong Free List ở User Space,
");
        printf("   hoàn toàn KHÔNG cần gọi System Call xin Kernel.
");
    }


    printf("
=======================================================
");
    printf(" 3. KIỂM TRA NGOẠI LỆ CẤP PHÁT CỰC LỚN (GỌI MMAP)      
");
    printf("=======================================================
");

    // Xin 10 MB (vượt xa ngưỡng Heap 128KB)
    size_t large_size = 10 * 1024 * 1024;
    char *p_large = (char *)malloc(large_size);

    printf("Địa chỉ p_large (10 MB): %p
", (void *)p_large);
    printf("-> Giải thích: Địa chỉ này nhảy sang phân vùng mmap hoàn toàn khác biệt
");
    printf("   so với địa chỉ Heap (%p) ở trên!
", (void *)p2);


    // Dọn dẹp tài nguyên
    free(p2);
    free(p3);
    free(p_large);

    return 0;
}
```

### Kết quả đầu ra thực tế khi biên dịch và chạy trên Linux 64-bit:
```text
=======================================================
 1. KIỂM TRA KHO BÁN LẺ HEAP & CHUNK METADATA (16-BYTE) 
=======================================================
Địa chỉ con trỏ p1: 0x5555555592a0
Địa chỉ con trỏ p2: 0x5555555596b0
Khoảng cách p2 - p1: 1040 Bytes
-> Giải thích: 1024 Bytes dữ liệu + 16 Bytes Metadata ẩn = 1040 Bytes!
Đọc trực tiếp từ Chunk Metadata nằm trước p1: Chunk Size = 1040 Bytes

=======================================================
 2. KIỂM TRA CƠ CHẾ TÁI SỬ DỤNG BỘ NHỚ (FREE LISTS)    
=======================================================
Gọi free(p1) -> Trả p1 về kho Free List của malloc...
Địa chỉ con trỏ p3 (khi xin lại 1KB): 0x5555555592a0
=> KẾT QUẢ: p3 TRÙNG HOÀN TOÀN với p1 cũ!
   malloc đã tái sử dụng ngay ô nhớ rảnh trong Free List ở User Space,
   hoàn toàn KHÔNG cần gọi System Call xin Kernel.

=======================================================
 3. KIỂM TRA NGOẠI LỆ CẤP PHÁT CỰC LỚN (GỌI MMAP)      
=======================================================
Địa chỉ p_large (10 MB): 0x7ffff7000010
-> Giải thích: Địa chỉ này nhảy sang phân vùng mmap hoàn toàn khác biệt
   so với địa chỉ Heap (0x5555555596b0) ở trên!
