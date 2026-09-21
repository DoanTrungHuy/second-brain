const windowSearchIndex = [
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "KIẾN TRÚC MÁY TÍNH & BỘ NHỚ: TỪ CPU CACHE ĐẾN HEAP ALLOCATION",
    "text": "Tên file hệ thống đề xuất: Computer_Architecture_Cache_VirtualMemory_Malloc_DeepDive.md Mục đích: Tài liệu tra cứu chuyên sâu toàn bộ luồng vận hành của dữ liệu từ cấp độ Bit/Byte phần cứng CPU đến Hệ điều hành và Thư viện User Space. ---"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "1.1 Cache không biết \"Mảng\" hay \"Kiểu dữ liệu\" là gì",
    "text": "   Phần cứng CPU Cache không có khái niệm int, float, struct hay Array.    Cache vận hành hoàn toàn dựa trên các khối dữ liệu cố định gọi là Cache Line kích thước tiêu chuẩn hiện nay là 64 Bytes = 512 bits.    Khi bạn khai báo một mảng int arr32, mảng này tốn $32 \\times 4 = 128\\text{ Bytes}$. Khi nạ"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "1.2 Cấu trúc phân rã của một Địa chỉ Vật lý (Physical Address)",
    "text": "Khi CPU cần truy xuất bộ nhớ tại một địa chỉ vật lý, phần cứng Cache chia chuỗi bit địa chỉ đó thành 3 phần: text | TAG Bit Cao | INDEX Bit Giữa | OFFSET Bit Thấp | | :--- | :--- | :--- |     Offset $0 \\rightarrow 5$ bit cuối đối với Cache Line 64B: Do $2^6 = 64$, 6 bit cuối xác định vị trí chính xá"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "2.1 Ví dụ bài toán cụ thể",
    "text": "Giả sử có mảng int arr32 nằm tại Địa chỉ Vật lý 0x00401200. Mảng này gồm 128 Bytes, được chia thành 2 Khối 64B:    Khối 1: arr0 đến arr15 Địa chỉ 0x00401200 $\\rightarrow$ 0x0040123F.    Khối 2: arr16 đến arr31 Địa chỉ 0x00401240 $\\rightarrow$ 0x0040127F. Giả sử qua phép tính phân rã bit địa chỉ:    "
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "2.2 Sơ đồ trạng thái Cache Line sau khi nạp mảng",
    "text": "text CACHE LINE SỐ 8 Xác định nhờ Index = 8 | Thành phần | Giá trị | | :--- | :--- | | Valid Bit | 1 | | Tag Store | 0x00401 Chính là phần Tag của địa chỉ &arr0 | | Data Block | Giá trị 64 Bytes: arr0, arr1, ..., arr15 | CACHE LINE SỐ 9 Xác định nhờ Index = 9 | Thành phần | Giá trị | | :--- | :--- |"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "2.3 Diễn biến từng bước khi CPU thực hiện lệnh: `int x = arr[5];`",
    "text": "1.  Tính Địa chỉ: CPU tính ra địa chỉ của arr5 là 0x00401214 vì $5 \\times 4 = 20 = 0x14$ bytes kể từ đầu mảng. 2.  Bóc Tách Địa Chỉ 0x00401214:    Tag = 0x00401    Index = 8    Offset = 20 Byte thứ 20 trong khối. 3.  Định Vị Ô Tủ: CPU dùng Index = 8 nhảy thẳng đến Cache Line số 8. 4.  Kiểm Tra Tag S"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "3.1 Khái niệm VIPT và PIPT",
    "text": "   VIPT Virtually Indexed, Physically Tagged: Dùng Index của Địa chỉ Ảo để định vị Cache Line, nhưng dùng Tag của Địa chỉ Vật lý để so sánh Tag Store.    PIPT Physically Indexed, Physically Tagged: Dùng cả Index và Tag của Địa chỉ Vật lý hoàn chỉnh."
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "3.2 Tại sao L1 Cache dùng được VIPT? (Bức tường 4KB)",
    "text": "Trong cơ chế Phân trang Paging 4KB chuẩn:    Một trang bộ nhớ có kích thước $4096\\text{ Bytes} = 2^{12}\\text{ Bytes}$.    Do đó, 12 bit cuối bit 0 đến bit 11 của Địa chỉ Ảo và Địa chỉ Vật lý LUÔN LUÔN GIỐNG HỆT NHAU 100%. L1 Cache có kích thước nhỏ ví dụ $32\\text{KB}$, 8-way set associative:    Offs"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "3.3 Tại sao L2/L3 BẮT BUỘC phải dùng PIPT (Địa chỉ Vật lý)?",
    "text": "Nếu L2/L3 dung lượng vài MB đến chục MB cố tình dùng Virtual Index, hệ thống sẽ sập do 3 lý do kỹ thuật:"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "Lý do 1: Phình to Bit Index (Vượt quá 12 bits)",
    "text": "   L2/L3 Cache rất lớn, số ô tủ Index phải tốn $8, 10, 12$ bits hoặc hơn.    Cộng thêm 6 bit Offset, phần Index + Offset sẽ lấn sang Bit 12, 13, 14... trở lên.    Ở các bit từ 12 trở lên, Địa chỉ Ảo và Địa chỉ Vật lý KHÁC NHAU HOÀN TOÀN. Index Ảo $\\neq$ Index Thật!"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "Lý do 2: Thảm họa Cache Aliasing (Data Corruption)",
    "text": "   Giả sử 2 tiến trình A và B cùng chia sẻ một vùng RAM vật lý tại địa chỉ 0x99999000.    Tiến trình A dùng Địa chỉ Ảo 0x11111000 Index Ảo = 15.    Tiến trình B dùng Địa chỉ Ảo 0x22222000 Index Ảo = 80.    Nếu L2/L3 dùng Virtual Index: Cùng một ô RAM vật lý nhưng sẽ bị nạp vào 2 ô Cache hoàn toàn kh"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "Lý do 3: Cache Coherence (Đồng bộ đa nhân CPU)",
    "text": "   L3 Cache là bộ nhớ đệm dùng chung cho tất cả các Core.    Các nhân CPU giao tiếp và canh chừng dữ liệu của nhau Snooping/MESI Protocol hoàn toàn bằng Địa chỉ Vật lý.    Nếu dùng Virtual Index, Nhân 1 không thể nào biết Nhân 2 đang đọc/ghi ô nhớ vật lý nào vì mỗi nhân có một bảng địa chỉ ảo riêng."
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "Lý do 4: Vô ích về mặt tốc độ",
    "text": "   Khi CPU truy cập L1 bị Miss và rơi xuống L2/L3, MMU đã dịch xong Địa chỉ Vật lý hoàn chỉnh ở bước L1 rồi.    CPU đã cầm sẵn Địa chỉ Vật lý trên tay, việc dùng Địa chỉ Vật lý cho L2/L3 không tốn thêm bất kỳ nanosecond nào. ---"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "4.1 Mô hình \"Cuốn sách\" và \"Trang sách bị xé\"",
    "text": "   Virtual Memory Bộ nhớ Ảo: Giống như một cuốn sách được đánh số trang tuần tự $1, 2, 3, 4...$ Lập trình viên nhìn vào thấy một mảng hay một biến nằm liền kề nhau rất ngăn nắp.    Physical Memory RAM Thật: Giống như các trang của cuốn sách đó bị xé rời và vứt rải rác vào các ngăn tủ khác nhau trong"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "4.2 Chi tiết Ranh giới Trang 4KB (Page Boundary)",
    "text": "Một đơn vị quản lý bộ nhớ cơ bản Page chuẩn x86/ARM có kích thước 4 KB 4096 Bytes."
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "TH1: Thao tác BÊN TRONG 1 Trang (Dưới 4096 Bytes)",
    "text": "   Địa chỉ Ảo liền kề THÌ Địa chỉ Vật lý CŨNG LIỀN KỀ.    Ví dụ: arr0 Byte 0 và arr15 Byte 60 cùng nằm trong Trang 1. Địa chỉ RAM thật của chúng nằm sát vách nhau $\\rightarrow$ Nạp thẳng vào 1 Cache Line 64B."
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "TH2: Thao tác VƯỢT RANH GIỚI Trang (Vượt mốc 4KB)",
    "text": "   Xét phần tử arr1023  Byte 4092 - Cuối Trang Ảo 1 và arr1024 Byte 4096 - Đầu Trang Ảo 2:    Trên Bộ nhớ Ảo: arr1023 và arr1024 nằm ngay sát cạnh nhau chênh nhau 4 bytes.    Trên RAM Vật lý: Trang Ảo 1 có thể nằm ở Khung RAM Vật lý 100, còn Trang Ảo 2 có thể bị OS đẩy sang Khung RAM Vật lý 9500 các"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "5. BUDDY ALLOCATOR TRONG KERNEL: TẠI SAO PHẢI CẤP KHỐI $2^n$ TRANG RAM?",
    "text": "Nếu Bộ nhớ Ảo đã giúp ứng dụng ghép các trang rải rác thành dải liền kề, tại sao ở tầng Kernel vẫn cần thuật toán Buddy Allocator để quản lý các khối RAM vật lý liền kề theo lũy thừa của 2 $2^0, 2^1, 2^2, 2^3... 2^n$ trang 4KB?"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "1. Phục vụ DMA (Direct Memory Access)",
    "text": "   Các phần cứng ngoại vi như Card mạng NIC, Card màn hình GPU, Ổ cứng SSD đọc/ghi dữ liệu trực tiếp vào RAM mà KHÔNG ĐI QUA CHIP MMU.    Chúng giao tiếp hoàn toàn bằng Địa chỉ Vật lý.    Khi Card mạng muốn nhận gói tin 16KB, nó yêu cầu 4 trang RAM vật lý phải hoàn toàn liền kề nhau về mặt vật lý. D"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "2. Tạo Trang Khổng Lồ (Huge Pages)",
    "text": "   Để tối ưu cho Database Oracle, MySQL hoặc Máy ảo KVM, OS gom 512 trang 4KB vật lý sát vách nhau để tạo thành Trang 2MB giúp giảm tải cho bộ đệm dịch địa chỉ TLB.    Buddy Allocator chính là bộ công cụ duy nhất giúp Kernel tìm và gom 512 trang vật lý sát vách đó."
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "3. Thuật toán Gộp RAM siêu tốc $O(1)$ (Coalescing)",
    "text": "   Khi một khối RAM bị giải phóng, Buddy Allocator kiểm tra khối \"Bạn thân\" Buddy của nó.    Nếu khối Buddy cũng đang rảnh $\\rightarrow$ Gộp ngay lập tức thành khối gấp đôi $2^{n+1}$ trong thời gian $O1$."
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "5.2 Hiện tượng Phân Mảnh Bên Trong (Internal Fragmentation)",
    "text": "Nếu bạn hoặc Kernel xin trực tiếp từ Buddy Allocator một vùng nhớ rộng 5 trang RAM 20KB: 1.  Buddy Allocator chỉ có các khối kích thước $1, 2, 4, 8, 16...$ trang. 2.  Do 5 trang $> 4$ trang $2^2$, Buddy Allocator bắt buộc phải giao khối 8 trang $2^3 = 32\\text{KB}$. 3.  Số phận của 3 trang dôi ra 12K"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "6. CƠ CHẾ `MALLOC` Ở USER SPACE: \"BUÔN SỈ - BÁN LẺ\", METADATA ẨN & `FREE()`",
    "text": "Để khắc phục việc lãng phí bộ nhớ của Buddy Allocator và tránh việc gọi System Call giật lag, thư viện C chuẩn glibc cung cấp bộ quản lý bộ nhớ malloc ở User Space."
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "6.1 Mô hình \"Buôn Sỉ - Bán Lẻ\"",
    "text": "text Ứng dụng C/C++ │ ▼  Gõ malloc32, malloc1024 - Bán lẻ theo Byte Thư viện malloc glibc / User Space │ ▼  Chỉ gọi khi kho hết hàng: brk/sbrk hoặc mmap - Buôn sỉ khối lớn Kernel / Buddy Allocator Kernel Space     Buôn sỉ: Khi mới chạy, malloc gọi System Call brk xin Kernel một phân vùng lớn Heap, v"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "6.2 Chunk Metadata (Thẻ Quản Lý Ẩn 16-byte)",
    "text": "Khi bạn gọi void p = malloc1024; Xin 1024 Bytes:    malloc thực tế sẽ xén một khối 1040 Bytes từ Heap.    Nó giấu 16 Bytes đầu tiên làm Chunk Metadata chứa kích thước khối = 1040, và các cờ trạng thái A|M|P.    Con trỏ p trả về cho bạn nằm ngay sau 16 bytes Metadata đó. text Địa chỉ Heap:   Byte 0 ."
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "6.3 Cơ chế `free(p)` và Free Lists / Bins",
    "text": "Tại sao khi gọi freep, bạn không cần truyền vào kích thước cần xóa? 1.  Đọc Metadata: Hàm freep tự động lùi con trỏ về trước 16 bytes p - 16, đọc Metadata và biết chính xác khối này rộng 1040 Bytes. 2.  Không trả RAM cho Kernel ngay: freep KHÔNG gọi System Call để trả 1040 bytes này về cho Kernel. 3"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "6.4 Ngoại lệ Cấp Phát Siêu Lớn (`mmap`)",
    "text": "   Nếu bạn gọi malloc10  1024  1024 Xin 10MB, vượt quá ngưỡng M_MMAP_THRESHOLD thường là 128KB:    malloc nhận thấy 10MB quá to, nhét vào Heap chung sẽ làm phân mảnh Heap.    malloc bỏ qua Heap, gọi trực tiếp System Call mmap xin Kernel cấp riêng một dải RAM 10MB độc lập.    Khi bạn free con trỏ 10M"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "7. MÃ NGUỒN C THỰC TẾ SOI TRỰC TIẾP MỌI HIỆN TƯỢNG",
    "text": "Đoạn mã C dưới đây minh họa toàn bộ các cơ chế đã học: Kho bán lẻ, Chunk Metadata ẩn, Tái sử dụng bộ nhớ và Ngoại lệ mmap. c"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "include <stdint.h>",
    "text": "int main { printf\"======================================================= \"; printf\" 1. KIỂM TRA KHO BÁN LẺ HEAP & CHUNK METADATA 16-BYTE \"; printf\"======================================================= \"; // Xin 2 khối 1KB 1024 Bytes char p1 = char malloc1024; char p2 = char malloc1024; printf\"Địa"
  },
  {
    "url": "index.html",
    "article": "Kiến trúc Cache & Virtual Memory",
    "category": "Hardware & Memory Systems",
    "section": "Kết quả đầu ra thực tế khi biên dịch và chạy trên Linux 64-bit:",
    "text": "text ======================================================= 1. KIỂM TRA KHO BÁN LẺ HEAP & CHUNK METADATA 16-BYTE ======================================================= Địa chỉ con trỏ p1: 0x5555555592a0 Địa chỉ con trỏ p2: 0x5555555596b0 Khoảng cách p2 - p1: 1040 Bytes -> Giải thích: 1024 Bytes dữ"
  },
  {
    "url": "mmu-tlb-page-table.html",
    "article": "Cơ chế MMU, TLB & Page Table",
    "category": "Hardware & Memory Systems",
    "section": "Kiến trúc Bộ nhớ & Cache System: Từ Địa chỉ Ảo đến Cache Line",
    "text": "Tài liệu này tổng hợp toàn bộ kiến thức nâng cao về Kiến trúc Bộ nhớ Virtual Memory, Cơ chế dịch địa chỉ MMU / TLB / Page Table và Cách hoạt động của Bộ nhớ đệm L1/L2 Cache được thảo luận trong phiên học. ---"
  },
  {
    "url": "mmu-tlb-page-table.html",
    "article": "Cơ chế MMU, TLB & Page Table",
    "category": "Hardware & Memory Systems",
    "section": "1. Phân rã địa chỉ & Tối ưu L1/L2 Cache (VIPT vs PIPT)",
    "text": "Địa chỉ khi truy cập Cache được chia làm 3 phần:  Tag: Nhãn định danh để so sánh khớp địa chỉ.  Index: Chỉ số xác định dòng/Set trong Cache.  Offset: Khoảng lệch xác định vị trí byte bên trong Cache Line thường là 64 Bytes."
  },
  {
    "url": "mmu-tlb-page-table.html",
    "article": "Cơ chế MMU, TLB & Page Table",
    "category": "Hardware & Memory Systems",
    "section": "So sánh L1 Cache và L2 Cache:",
    "text": "| Tiêu chí | L1 Cache VIPT | L2 Cache PIPT | | :--- | :--- | :--- | | Tên đầy đủ | Virtually Indexed, Physically Tagged | Physically Indexed, Physically Tagged | | Lấy Index | Dùng Địa chỉ ảo VA | Dùng Địa chỉ thật PA | | So sánh Tag | Dùng Địa chỉ thật PA | Dùng Địa chỉ thật PA | | Tối ưu | Tốc độ "
  },
  {
    "url": "mmu-tlb-page-table.html",
    "article": "Cơ chế MMU, TLB & Page Table",
    "category": "Hardware & Memory Systems",
    "section": "Sự khác biệt kích thước cốt lõi:",
    "text": " Cache Line: 64 Bytes Đơn vị nạp của Cache L1/L2/L3.  Page Memory: 4 KB = 4096 Bytes Đơn vị quản lý của MMU/TLB."
  },
  {
    "url": "mmu-tlb-page-table.html",
    "article": "Cơ chế MMU, TLB & Page Table",
    "category": "Hardware & Memory Systems",
    "section": "Tại sao Array vượt trội hoàn toàn về hiệu năng?",
    "text": "1. Spatial Locality Tính định vị không gian:  Array: Các phần tử nằm liên tiếp. Khi đọc 1 phần tử 4 bytes, CPU kéo luôn 64 Bytes 16 phần tử int vào Cache Line. Các lần đọc sau trúng L1 Cache ngay lập tức Cache Hit.  Linked List: Các Node nằm rải rác trên Heap. Nạp 1 Node kéo theo 64 Bytes dữ liệu rá"
  },
  {
    "url": "mmu-tlb-page-table.html",
    "article": "Cơ chế MMU, TLB & Page Table",
    "category": "Hardware & Memory Systems",
    "section": "3. Cấu trúc & Cơ chế vận hành của TLB",
    "text": "TLB là bộ nhớ đệm phần cứng siêu nhanh nằm trong MMU, lưu các cặp ánh xạ VPN $\\rightarrow$ PFN."
  },
  {
    "url": "mmu-tlb-page-table.html",
    "article": "Cơ chế MMU, TLB & Page Table",
    "category": "Hardware & Memory Systems",
    "section": "Cấu trúc 1 TLB Entry:",
    "text": " VPN Virtual Page Number: Key tra cứu Số trang ảo.  PFN Physical Frame Number: Value trả về Số khung trang thật.  Valid Bit: Kiểm tra dòng dữ liệu hợp lệ.  Dirty Bit: Đánh dấu trang đã bị thay đổi dữ liệu.  Access Rights: Quyền truy cập R/W/X, User/Kernel.  ASID / PCID: Address Space ID Process ID p"
  },
  {
    "url": "mmu-tlb-page-table.html",
    "article": "Cơ chế MMU, TLB & Page Table",
    "category": "Hardware & Memory Systems",
    "section": "Đặc điểm phần cứng:",
    "text": " Sử dụng bộ nhớ CAM Content-Addressable Memory - so sánh song song tất cả các entry chỉ trong 1 chu kỳ.  Tổ chức dạng bảng phẳng Flat, không phân cấp lằng nhằng như Page Table. ---"
  },
  {
    "url": "mmu-tlb-page-table.html",
    "article": "Cơ chế MMU, TLB & Page Table",
    "category": "Hardware & Memory Systems",
    "section": "4. Phân định phần cứng & phần mềm (MMU, TLB, Page Table)",
    "text": "| Thành phần | Loại | Số lượng phân bổ | Vị trí / Nhiệm vụ | | :--- | :--- | :--- | :--- | | MMU | Hardware | 1 per CPU Core | Nằm trên chip CPU, thực hiện dịch địa chỉ. | | TLB | Hardware | 1 per MMU | Cache của Page Table, dùng bộ nhớ CAM phẳng. | | Page Table | Software Data Structure | 1 per Pro"
  },
  {
    "url": "mmu-tlb-page-table.html",
    "article": "Cơ chế MMU, TLB & Page Table",
    "category": "Hardware & Memory Systems",
    "section": "Cơ chế ASID / PCID:",
    "text": " Trước đây: Mỗi lần Context Switch giữa các Process, CPU phải flush xóa sạch TLB để tránh đụng độ địa chỉ ảo giống nhau.  Hiện nay: Gắn thêm ASID vào mỗi dòng TLB. Hai địa chỉ ảo trùng nhau của Process A và B có thể cùng nằm trong 1 TLB mà MMU vẫn phân biệt chính xác. ---"
  },
  {
    "url": "mmu-tlb-page-table.html",
    "article": "Cơ chế MMU, TLB & Page Table",
    "category": "Hardware & Memory Systems",
    "section": "5. Cơ chế xẻ nhỏ địa chỉ (VPN vs Tag-Index-Offset)",
    "text": "Cần phân biệt rõ 2 mô hình cắt bit địa chỉ: text 1. Phân tách cho Virtual Memory Dịch địa chỉ Ảo -> Thật qua Page Table/TLB:  Virtual Page Number VPN   Page Offset 12 bits cho trang 4KB  2. Phân tách cho Cache System Tìm dữ liệu trong L1/L2/L3 Cache:          Tag             Index     Cache Offset 6"
  },
  {
    "url": "mmu-tlb-page-table.html",
    "article": "Cơ chế MMU, TLB & Page Table",
    "category": "Hardware & Memory Systems",
    "section": "4 Lợi ích cốt lõi của Page Table:",
    "text": "1. Isolation Cô lập bộ nhớ: Chống tiến trình này xâm phạm RAM tiến trình khác. 2. Contiguous Virtual Space: Biến các trang RAM thật phân mảnh thành không gian địa chỉ ảo liền mạch. 3. Shared Memory: Cho phép nhiều process dùng chung 1 thư viện như libc.so tại trang RAM thật duy nhất. 4. Virtual Memo"
  },
  {
    "url": "mmu-tlb-page-table.html",
    "article": "Cơ chế MMU, TLB & Page Table",
    "category": "Hardware & Memory Systems",
    "section": "Cấu hình bài toán:",
    "text": " Địa chỉ 32-bit, Cache Line 64 Bytes 6 bits Offset, Cache có 16 Sets 4 bits Index, Tag 22 bits.  Chuỗi bit:  Tag 22 bits   Index 4 bits   Offset 6 bits "
  },
  {
    "url": "mmu-tlb-page-table.html",
    "article": "Cơ chế MMU, TLB & Page Table",
    "category": "Hardware & Memory Systems",
    "section": "Chuỗi truy cập bộ nhớ thực tế:",
    "text": "1. 0x00401000 Byte 0:  Index: 0000 Set 0 | Offset: 000000 0 | Tag: 0x001004  L1 MISS $\\rightarrow$ Nạp 64 Bytes 0x00401000 – 0x0040103F vào Set 0. 2. 0x00401014 Byte 20:  Index: 0000 Set 0 | Offset: 010100 20 | Tag: 0x001004  L1 HIT Cùng Set 0, cùng Tag 0x001004. 3. 0x0040103C Byte 60:  Index: 0000 "
  },
  {
    "url": "mesi-protocol.html",
    "article": "Giao thức Đồng bộ MESI",
    "category": "Hardware & Memory Systems",
    "section": "Giao thức MESI & Kiến trúc Bus trong Đồng bộ Cache CPU",
    "text": "---"
  },
  {
    "url": "mesi-protocol.html",
    "article": "Giao thức Đồng bộ MESI",
    "category": "Hardware & Memory Systems",
    "section": "1. Vấn đề Đồng bộ Bộ nhớ đệm (Cache Coherence)",
    "text": "Trong kiến trúc CPU đa nhân Multi-core hiện đại:  L1 và L2 Cache: Nằm riêng bên trong từng Core để đảm bảo tốc độ truy xuất siêu nhanh.  L3 Cache và Main Memory RAM vật lý: Là bộ nhớ dùng chung Shared Memory cho toàn bộ hệ thống."
  },
  {
    "url": "mesi-protocol.html",
    "article": "Giao thức Đồng bộ MESI",
    "category": "Hardware & Memory Systems",
    "section": "Bài toán đặt ra",
    "text": "1. Core 1 và Core 2 cùng copy biến X = 5 từ ô nhớ RAM vật lý 0x00A1F000 về L1 Cache của mình. 2. Core 1 sửa X = 10 chỉ mới cập nhật ở L1 Cache của Core 1. 3. Nếu Core 2 tiếp tục đọc X từ L1 Cache của nó, Core 2 vẫn thấy X = 5 Dữ liệu bị bất đồng bộ / Stale Data. Để giải quyết vấn đề này, phần cứng C"
  },
  {
    "url": "mesi-protocol.html",
    "article": "Giao thức Đồng bộ MESI",
    "category": "Hardware & Memory Systems",
    "section": "2. Giao thức MESI (MESI Protocol)",
    "text": "Giao thức MESI gắn cho mỗi Cache Line khối đệm chuẩn rộng 64 bytes một trạng thái đại diện bởi 2 bit vật lý được đúc sẵn trên chip silicon. | Trạng thái | Tên đầy đủ | Dữ liệu đúng so với RAM? | Có nằm ở Cache nhân khác? | Quyền Ghi Write | | :--- | :--- | :--- | :--- | :--- | | M | Modified Đã sửa "
  },
  {
    "url": "mesi-protocol.html",
    "article": "Giao thức Đồng bộ MESI",
    "category": "Hardware & Memory Systems",
    "section": "Bản chất 2-bit MESI trên phần cứng",
    "text": " 2 bit này là các mạch lưu trữ điện thế Flip-Flops nằm cố định bên cạnh mỗi khối Cache Line trên đĩa Silicon.  Khi vừa bật máy, phần cứng mặc định gán 2 bit này của tất cả Cache Line thành trạng thái 00 Invalid.  Kích thước Cache Line không đổi, 2 bit này chỉ liên tục chuyển đổi giá trị điện áp 00, "
  },
  {
    "url": "mesi-protocol.html",
    "article": "Giao thức Đồng bộ MESI",
    "category": "Hardware & Memory Systems",
    "section": "3.1. Bus là gì?",
    "text": "Bus là tập hợp các đường dây dẫn tín hiệu điện in trên vi mạch nối tất cả các Core, L3 Cache và RAM lại với nhau. Bus gồm 3 tuyến dây chính: 1. Bus Địa chỉ Address Bus: Chứa địa chỉ ô nhớ RAM vật lý ví dụ: 0x00A1F000. 2. Bus Dữ liệu Data Bus: Chứa giá trị thực sự ví dụ: 10. 3. Bus Điều khiển Control"
  },
  {
    "url": "mesi-protocol.html",
    "article": "Giao thức Đồng bộ MESI",
    "category": "Hardware & Memory Systems",
    "section": "3.2. Cấu trúc 1 Cache Line trên phần cứng",
    "text": "Mỗi khối Cache Line trong L1/L2 Cache bao gồm 3 phần: $$\\text{Cache Line} = \\text{Data 64 bytes} + \\text{Trạng thái MESI 2 bits} + \\text{Address Tag Nhãn địa chỉ RAM}$$  Address Tag: Lưu chính xác Địa chỉ RAM vật lý Physical Address mà khối 64 bytes đó được copy về."
  },
  {
    "url": "mesi-protocol.html",
    "article": "Giao thức Đồng bộ MESI",
    "category": "Hardware & Memory Systems",
    "section": "3.3. Cơ chế so sánh địa chỉ (Bus Snooping)",
    "text": "Khi Core 1 sửa X = 10, nó phát tín hiệu lệnh INVALIDATE kèm địa chỉ RAM vật lý 0x00A1F000 lên Bus: 1. Phát tín hiệu quảng bá Broadcast: Tín hiệu điện chạy trên dây Bus đến lối vào của tất cả các Core còn lại cùng lúc. 2. Kiểm tra ở Mạch Snooping Snoop Controller: Tại lối vào L1 Cache của Core 2, một"
  },
  {
    "url": "mesi-protocol.html",
    "article": "Giao thức Đồng bộ MESI",
    "category": "Hardware & Memory Systems",
    "section": "4. Quy trình Vận hành Chi tiết (Step-by-Step)",
    "text": "Giả sử ban đầu ô nhớ X tại địa chỉ RAM vật lý 0x00A1F000 có giá trị bằng 5. text Core 1 L1 Cache                     Bus System                     Core 2 L1 Cache |                                   |                                   | |--- 1 Read X Cache Miss ------>|                             "
  },
  {
    "url": "spinlock-vs-mutex.html",
    "article": "Tối ưu Đồng bộ: SpinLock vs Mutex",
    "category": "Concurrency & Operating System",
    "section": "Tổng hợp Kiến thức (Low-level C++ & System Design)",
    "text": "Tài liệu này tổng hợp các kiến thức cốt lõi về tối ưu hóa hiệu năng Performance Optimization và lập trình đồng thời Concurrency mức độ Micro-giây, dựa trên các hệ thống hiệu năng cao thông dụng. ---"
  },
  {
    "url": "spinlock-vs-mutex.html",
    "article": "Tối ưu Đồng bộ: SpinLock vs Mutex",
    "category": "Concurrency & Operating System",
    "section": "1. Trade-off: OS Mutex vs User-Space SpinLock",
    "text": "Sự đánh đổi cốt lõi giữa Mutex và SpinLock là: \"Đốt CPU để lấy độ trễ siêu thấp\" so với \"Tiết kiệm CPU nhưng chịu độ trễ cao\".    OS Mutex std::mutex: Khi luồng A giữ khóa, các luồng B, C, D lao tới sẽ bị hệ điều hành OS ép thực hiện Syscall như futex trên Linux để chuyển trạng thái sang Sleep. Khi "
  },
  {
    "url": "spinlock-vs-mutex.html",
    "article": "Tối ưu Đồng bộ: SpinLock vs Mutex",
    "category": "Concurrency & Operating System",
    "section": "2. Kiến trúc 256-way Sharded Hash Map",
    "text": "   Decentralize Bottleneck: Thay vì dùng 1 Mutex duy nhất bảo vệ toàn bộ Hash Map khiến các luồng truy cập Key khác nhau cũng phải đợi nhau, dữ liệu được chia làm 256 phân vùng Shards. Các luồng ghi vào các Shard khác nhau chạy hoàn toàn song song.    Chống False Sharing alignas64: Bằng cách buộc cấ"
  },
  {
    "url": "spinlock-vs-mutex.html",
    "article": "Tối ưu Đồng bộ: SpinLock vs Mutex",
    "category": "Concurrency & Operating System",
    "section": "3. \"Giải phẫu\" SpinLock",
    "text": "cpp class SpinLock { std::atomic_flag flag = ATOMIC_FLAG_INIT; public: void lock { while flag.test_and_setstd::memory_order_acquire { __builtin_ia32_pause; } } void unlock { flag.clearstd::memory_order_release; } };     std::atomic_flag: Kiểu dữ liệu duy nhất trong C++ được chuẩn hóa đảm bảo 100% Lo"
  },
  {
    "url": "spinlock-vs-mutex.html",
    "article": "Tối ưu Đồng bộ: SpinLock vs Mutex",
    "category": "Concurrency & Operating System",
    "section": "4. Memory Order & Instruction Reordering (Đảo lộn lệnh)",
    "text": "Trình biên dịch và CPU luôn có xu hướng đảo lộn thứ tự các lệnh để chạy cho nhanh. Nếu không có rào cản Memory Barriers, CPU có thể mang đoạn code xử lý dữ liệu ra khỏi phạm vi khóa, gây nát dữ liệu.    memory_order_acquire Rào cản đi XUỐNG: Đặt ở hàm lock. Cấm tuyệt đối CPU không được kéo bất kỳ dò"
  },
  {
    "url": "spinlock-vs-mutex.html",
    "article": "Tối ưu Đồng bộ: SpinLock vs Mutex",
    "category": "Concurrency & Operating System",
    "section": "5. Chu kỳ CPU (CPU Cycle)",
    "text": "   Chu kỳ là \"nhịp đập\" của CPU. 1 CPU 3GHz đập 3 tỷ nhịp mỗi giây 1 cycle $\\approx$ 0.3 ns.    Đọc dữ liệu từ L1 Cache tốn 1-3 chu kỳ. Đọc từ RAM tốn 200-300 chu kỳ.    Đó là lý do dự án sử dụng Zero-Allocation không dùng new/malloc và Slab Allocator để ép dữ liệu nằm vừa vặn trong Cache, tránh tốn"
  },
  {
    "url": "spinlock-vs-mutex.html",
    "article": "Tối ưu Đồng bộ: SpinLock vs Mutex",
    "category": "Concurrency & Operating System",
    "section": "6. CPU Pipelining, Branch Prediction & Pipeline Flush",
    "text": "   Pipeline Đường ống: CPU chia nhỏ lệnh thành các bước Fetch, Decode, Execute... và đưa liên tục vào đường ống để thực thi gối đầu lên nhau.    Branch Prediction Đoán rẽ nhánh: Khi gặp vòng lặp while chờ khóa, CPU sẽ \"đoán mò\" là khóa còn lâu mới mở, và nhồi trước hàng trăm lệnh chờ đợi vào Pipelin"
  },
  {
    "url": "spinlock-vs-mutex.html",
    "article": "Tối ưu Đồng bộ: SpinLock vs Mutex",
    "category": "Concurrency & Operating System",
    "section": "7. Giải pháp từ lệnh `__builtin_ia32_pause()`",
    "text": "Lệnh pause dịch ra hợp ngữ là PAUSE trên x86 chính là tín hiệu báo cho CPU biết: \"Đây là vòng lặp chờ, đừng đoán mò\". 1.  Chống gãy đường ống: CPU ngừng nhồi nhét lệnh vào Pipeline, khi khóa mở, luồng bay thẳng vào Critical Section mà không có rác cần dọn. 2.  Hạ nhiệt & Tiết kiệm điện: Ép luồng \"ng"
  },
  {
    "url": "string-vs-string-view.html",
    "article": "Quản lý Bộ nhớ: std::string_view",
    "category": "C++ Performance Optimization",
    "section": "Hướng dẫn C++: std::string vs std::string_view",
    "text": "Trong C++ hiện đại từ C++17 trở đi, std::string_view được ra mắt và lập tức trở thành một công cụ tối quan trọng để tối ưu hóa hiệu năng Performance Optimization. Tài liệu này so sánh chi tiết bản chất của hai kiểu dữ liệu này dưới góc độ quản lý bộ nhớ. ---"
  },
  {
    "url": "string-vs-string-view.html",
    "article": "Quản lý Bộ nhớ: std::string_view",
    "category": "C++ Performance Optimization",
    "section": "`std::string` (Người sở hữu - The Owner)",
    "text": "- Cơ chế: Khi bạn tạo một std::string, nó sẽ tự động yêu cầu Hệ điều hành cấp phát một vùng nhớ riêng trên Heap RAM thông qua hàm new / malloc. Sau đó, nó sao chép copy các ký tự vào vùng nhớ đó. - Vòng đời: Nó tự quản lý vùng nhớ của mình. Khi biến std::string bị hủy, nó sẽ tự động gọi delete / fre"
  },
  {
    "url": "string-vs-string-view.html",
    "article": "Quản lý Bộ nhớ: std::string_view",
    "category": "C++ Performance Optimization",
    "section": "`std::string_view` (Người quan sát - The Observer)",
    "text": "- Cơ chế: std::string_view KHÔNG sở hữu bất kỳ dữ liệu nào. Nó thực chất chỉ là một cái vỏ bọc mỏng nhẹ chứa đúng 2 biến: 1. Một con trỏ const char pointer trỏ tới một vùng nhớ có sẵn. 2. Một biến đếm size_t length báo hiệu chuỗi dài bao nhiêu byte. - Đặc điểm: Không cấp phát RAM no allocation, khôn"
  },
  {
    "url": "string-vs-string-view.html",
    "article": "Quản lý Bộ nhớ: std::string_view",
    "category": "C++ Performance Optimization",
    "section": "2. Minh họa Trực quan trong Bộ nhớ (Memory Layout)",
    "text": "Giả sử ta có một mảng ký tự gốc trong bộ nhớ: text Địa chỉ RAM:  0x100  0x101  0x102  0x103  0x104  0x105 Dữ liệu:      'H'  'e'  'l'  'l'  'o'  '!'  "
  },
  {
    "url": "string-vs-string-view.html",
    "article": "Quản lý Bộ nhớ: std::string_view",
    "category": "C++ Performance Optimization",
    "section": "Cách `std::string` cắt chuỗi (Substr):",
    "text": "cpp std::string original = \"Hello!\"; std::string cut = original.substr0, 4; // Lấy chữ \"Hell\"  Hành động: Trình biên dịch xin Hệ điều hành một vùng RAM mới ví dụ ở địa chỉ 0x500, rồi chạy vòng lặp để chép 4 chữ cái 'H', 'e', 'l', 'l' sang vùng nhớ mới đó. Tốn tài nguyên tính toán và RAM."
  },
  {
    "url": "string-vs-string-view.html",
    "article": "Quản lý Bộ nhớ: std::string_view",
    "category": "C++ Performance Optimization",
    "section": "Cách `std::string_view` cắt chuỗi (Substr):",
    "text": "cpp std::string_view original = \"Hello!\"; std::string_view cut = original.substr0, 4;  Hành động: Trình biên dịch tạo 2 biến nhỏ xíu trên Stack: - pointer = 0x100 - length = 4 Xong! Không có byte nào bị copy, không có RAM nào được cấp phát thêm. ---"
  },
  {
    "url": "string-vs-string-view.html",
    "article": "Quản lý Bộ nhớ: std::string_view",
    "category": "C++ Performance Optimization",
    "section": "3. So sánh Chi phí Hiệu năng (Performance Cost)",
    "text": "Bảng so sánh khi thực hiện thao tác cắt nhỏ parsing một chuỗi dài thành 100 chuỗi con ngắn: | Tiêu chí | Dùng std::string | Dùng std::string_view | | :--- | :--- | :--- | | Cấp phát bộ nhớ Allocation | 100 lần gọi malloc/new | 0 lần | | Sao chép dữ liệu Copying | Copy 100 lần | 0 lần | | Giải phóng "
  },
  {
    "url": "string-vs-string-view.html",
    "article": "Quản lý Bộ nhớ: std::string_view",
    "category": "C++ Performance Optimization",
    "section": "4. Rủi ro rình rập: Con trỏ lơ lửng (Dangling Pointer)",
    "text": "Vì std::string_view chỉ là \"Người quan sát\", nó phụ thuộc hoàn toàn sinh mạng vào \"Vật chủ\" Chuỗi gốc mà nó trỏ vào. Nếu Vật chủ bị xóa đi, string_view sẽ trỏ vào vùng nhớ rác. Ví dụ gây sập chương trình Crash / Segfault: cpp"
  },
  {
    "url": "string-vs-string-view.html",
    "article": "Quản lý Bộ nhớ: std::string_view",
    "category": "C++ Performance Optimization",
    "section": "include <string_view>",
    "text": "std::string_view get_greeting { std::string temp = \"Hello World\"; // Vật chủ được cấp phát trên Stack std::string_view viewtemp;      // Người quan sát trỏ vào Vật chủ return view; // NGUY HIỂM: Khi hàm kết thúc, biến temp bị hủy Vật chủ chết. // Tuy nhiên, view lại được trả về ra ngoài. } int main "
  },
  {
    "url": "string-vs-string-view.html",
    "article": "Quản lý Bộ nhớ: std::string_view",
    "category": "C++ Performance Optimization",
    "section": "Quy tắc vàng khi dùng `std::string_view`:",
    "text": "Luôn đảm bảo Vòng đời Lifetime của Chuỗi gốc Vật chủ phải sống lâu hơn hoặc bằng với std::string_view của nó. Chỉ nên dùng string_view làm tham số truyền vào hàm Function Arguments hoặc để xử lý biến cục bộ trong những khoảng thời gian ngắn hạn. Khi cần lưu trữ dữ liệu lâu dài vào CSDL hay biến toàn"
  }
];