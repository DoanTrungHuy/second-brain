# Kiến trúc Bộ nhớ & Cache System: Từ Địa chỉ Ảo đến Cache Line

Tài liệu này tổng hợp toàn bộ kiến thức nâng cao về **Kiến trúc Bộ nhớ (Virtual Memory)**, **Cơ chế dịch địa chỉ (MMU / TLB / Page Table)** và **Cách hoạt động của Bộ nhớ đệm (L1/L2 Cache)** được thảo luận trong phiên học.

---

## 📋 Mục lục
1. [Phân rã địa chỉ & Tối ưu L1/L2 Cache (VIPT vs PIPT)](#1-phân-rã-địa-chỉ--tối-ưu-l1l2-cache-vipt-vs-pipt)
2. [Array vs Linked List dưới góc độ phần cứng](#2-array-vs-linked-list-dưới-góc-độ-phần-cứng)
3. [Cấu trúc & Cơ chế vận hành của TLB (Translation Lookaside Buffer)](#3-cấu-trúc--cơ-chế-vận-hành-của-tlb)
4. [Phân định phần cứng & phần mềm (MMU, TLB, Page Table)](#4-phân-định-phần-cứng--phần-mềm-mmu-tlb-page-table)
5. [Cơ chế xẻ nhỏ địa chỉ (VPN vs Tag-Index-Offset)](#5-cơ-chế-xẻ-nhỏ-địa-chỉ-vpn-vs-tag-index-offset)
6. [Ví dụ minh họa tính toán địa chỉ Hex & Hiện tượng tràn Cache Line](#6-ví-dụ-minh-họa-tính-toán-địa-chỉ-hex--hiện-tượng-tràn-cache-line)

---

## 1. Phân rã địa chỉ & Tối ưu L1/L2 Cache (VIPT vs PIPT)

Địa chỉ khi truy cập Cache được chia làm 3 phần:
* **Tag:** Nhãn định danh để so sánh khớp địa chỉ.
* **Index:** Chỉ số xác định dòng/Set trong Cache.
* **Offset:** Khoảng lệch xác định vị trí byte bên trong Cache Line (thường là 64 Bytes).

### So sánh L1 Cache và L2 Cache:

| Tiêu chí | L1 Cache (VIPT) | L2 Cache (PIPT) |
| :--- | :--- | :--- |
| **Tên đầy đủ** | Virtually Indexed, Physically Tagged | Physically Indexed, Physically Tagged |
| **Lấy Index** | Dùng **Địa chỉ ảo (VA)** | Dùng **Địa chỉ thật (PA)** |
| **So sánh Tag** | Dùng **Địa chỉ thật (PA)** | Dùng **Địa chỉ thật (PA)** |
| **Tối ưu** | **Tốc độ tối đa (4-5 cycles):** Tìm Index song song với quá trình MMU dịch địa chỉ qua TLB. | **Loại bỏ Cache Aliasing / Synonym:** Khi tới L2 địa chỉ thật đã sẵn sàng, L2 dung lượng lớn dùng hoàn toàn PA để tránh lưu trùng dữ liệu. |

---

## 2. Array vs Linked List dưới góc độ phần cứng

### Sự khác biệt kích thước cốt lõi:
* **Cache Line:** 64 Bytes (Đơn vị nạp của Cache L1/L2/L3).
* **Page Memory:** 4 KB = 4096 Bytes (Đơn vị quản lý của MMU/TLB).

### Tại sao Array vượt trội hoàn toàn về hiệu năng?
1. **Spatial Locality (Tính định vị không gian):**
   * **Array:** Các phần tử nằm liên tiếp. Khi đọc 1 phần tử (4 bytes), CPU kéo luôn **64 Bytes (16 phần tử int)** vào Cache Line. Các lần đọc sau trúng L1 Cache ngay lập tức (Cache Hit).
   * **Linked List:** Các Node nằm rải rác trên Heap. Nạp 1 Node kéo theo 64 Bytes dữ liệu rác/dữ liệu khác $ightarrow$ Truy cập con trỏ `next` gây **Cache Miss** liên tục (tốn 200–300 cycles chờ RAM).
2. **Hardware Prefetcher:** CPU tự nhận diện mẫu truy cập tuyến tính của Array để tải trước Cache Line tiếp theo. Linked List bị vướng hiện tượng **Pointer Chasing** làm CPU "mù tóm" không đoán trước được địa chỉ kế tiếp.
3. **TLB Impact:** Linked List rải rác làm nhảy qua nhiều trang 4KB khác nhau, gây ra thêm **TLB Miss**.

---

## 3. Cấu trúc & Cơ chế vận hành của TLB

TLB là bộ nhớ đệm phần cứng siêu nhanh nằm trong MMU, lưu các cặp ánh xạ **VPN $ightarrow$ PFN**.

### Cấu trúc 1 TLB Entry:
* **VPN (Virtual Page Number):** Key tra cứu (Số trang ảo).
* **PFN (Physical Frame Number):** Value trả về (Số khung trang thật).
* **Valid Bit:** Kiểm tra dòng dữ liệu hợp lệ.
* **Dirty Bit:** Đánh dấu trang đã bị thay đổi dữ liệu.
* **Access Rights:** Quyền truy cập (R/W/X, User/Kernel).
* **ASID / PCID:** Address Space ID (Process ID) phân biệt tiến trình sở hữu.
* **Global Bit:** Trang dùng chung (như Kernel).

### Đặc điểm phần cứng:
* Sử dụng bộ nhớ **CAM (Content-Addressable Memory)** - so sánh song song tất cả các entry chỉ trong **1 chu kỳ**.
* Tổ chức dạng bảng phẳng (**Flat**), không phân cấp lằng nhằng như Page Table.

---

## 4. Phân định phần cứng & phần mềm (MMU, TLB, Page Table)

| Thành phần | Loại | Số lượng phân bổ | Vị trí / Nhiệm vụ |
| :--- | :--- | :--- | :--- |
| **MMU** | Hardware | **1 per CPU Core** | Nằm trên chip CPU, thực hiện dịch địa chỉ. |
| **TLB** | Hardware | **1 per MMU** | Cache của Page Table, dùng bộ nhớ CAM phẳng. |
| **Page Table** | Software Data Structure | **1 per Process** | Lưu tại RAM chính, do OS quản lý (tra cứu cây nhiều cấp). |

### Cơ chế ASID / PCID:
* **Trước đây:** Mỗi lần Context Switch giữa các Process, CPU phải flush (xóa sạch) TLB để tránh đụng độ địa chỉ ảo giống nhau.
* **Hiện nay:** Gắn thêm **ASID** vào mỗi dòng TLB. Hai địa chỉ ảo trùng nhau của Process A và B có thể cùng nằm trong 1 TLB mà MMU vẫn phân biệt chính xác.

---

## 5. Cơ chế xẻ nhỏ địa chỉ (VPN vs Tag-Index-Offset)

Cần phân biệt rõ 2 mô hình cắt bit địa chỉ:

```text
1. Phân tách cho Virtual Memory (Dịch địa chỉ Ảo -> Thật qua Page Table/TLB):
   [ Virtual Page Number (VPN) ] [ Page Offset (12 bits cho trang 4KB) ]

2. Phân tách cho Cache System (Tìm dữ liệu trong L1/L2/L3 Cache):
   [         Tag         ] [   Index   ] [ Cache Offset (6 bits cho line 64B) ]
```

### 4 Lợi ích cốt lõi của Page Table:
1. **Isolation (Cô lập bộ nhớ):** Chống tiến trình này xâm phạm RAM tiến trình khác.
2. **Contiguous Virtual Space:** Biến các trang RAM thật phân mảnh thành không gian địa chỉ ảo liền mạch.
3. **Shared Memory:** Cho phép nhiều process dùng chung 1 thư viện (như `libc.so`) tại trang RAM thật duy nhất.
4. **Virtual Memory Expansion (Swap/Paging):** Cho phép chạy chương trình vượt quá dung lượng RAM vật lý.

---

## 6. Ví dụ minh họa tính toán địa chỉ Hex & Hiện tượng tràn Cache Line

### Cấu hình bài toán:
* Địa chỉ **32-bit**, Cache Line **64 Bytes** (6 bits Offset), Cache có **16 Sets** (4 bits Index), Tag **22 bits**.
* Chuỗi bit: `[ Tag (22 bits) ] [ Index (4 bits) ] [ Offset (6 bits) ]`

### Chuỗi truy cập bộ nhớ thực tế:

1. **`0x00401000` (Byte 0):**
   * Index: `0000` (Set 0) | Offset: `000000` (0) | Tag: `0x001004`
   * **L1 MISS** $ightarrow$ Nạp 64 Bytes (`0x00401000` – `0x0040103F`) vào **Set 0**.
2. **`0x00401014` (Byte 20):**
   * Index: `0000` (Set 0) | Offset: `010100` (20) | Tag: `0x001004`
   * **L1 HIT** (Cùng Set 0, cùng Tag `0x001004`).
3. **`0x0040103C` (Byte 60):**
   * Index: `0000` (Set 0) | Offset: `111100` (60) | Tag: `0x001004`
   * **L1 HIT** (Vẫn nằm trong 64 Bytes ở Set 0).
4. **`0x00401040` (Byte 64 - Tràn Offset):**
   * **Hiện tượng tràn:** Con số 64 vượt quá 6 bit Offset (`111111` = 63). Bit tràn đẩy sang làm **Index tăng từ 0 lên 1** (`0001`).
   * Index: `0001` (Set 1) | Offset: `000000` (0) | Tag: `0x001004`
   * **L1 MISS** $ightarrow$ Nhảy sang **Set 1**, tải 64 Bytes tiếp theo (`0x00401040` – `0x0040107F`).
5. **`0x00402000` (Địa chỉ xa):**
   * Index: `0000` (Set 0) | Offset: `000000` (0) | Tag: `0x001008` (Tag thay đổi!)
   * **L1 MISS** $ightarrow$ Do Tag khác nhau, Cache Line mới ghi đè lên Set 0.

---
*Tài liệu tổng hợp tự động từ buổi học về Architecture & Virtual Memory System.*
