# 🧠 Second Brain — Low-Level Computer Systems & C++ Knowledge Base

> Kho tài liệu và ghi chú chuyên sâu về Kiến trúc máy tính (Computer Architecture), Hệ điều hành (OS), Quản lý bộ nhớ (Memory Systems, Cache, Virtual Memory) và Lập trình hiệu năng cao với C++.

[![Live Demo](https://img.shields.io/badge/Live%20Web-doantrunghuy.github.io%2Fsecond--brain-2563eb?style=for-the-badge&logo=githubpages&logoColor=white)](https://doantrunghuy.github.io/second-brain/)
[![GitHub Repo](https://img.shields.io/badge/Repository-DoanTrungHuy%2Fsecond--brain-0f172a?style=for-the-badge&logo=github)](https://github.com/DoanTrungHuy/second-brain)

---

## 🌐 Trải nghiệm Trực tiếp (Live Website)

Toàn bộ tài liệu được đóng gói thành một trang web tài liệu tĩnh hiện đại, tối ưu trải nghiệm đọc với giao diện cao cấp:

👉 **[https://doantrunghuy.github.io/second-brain/](https://doantrunghuy.github.io/second-brain/)**

---

## ✨ Điểm nổi bật về Giao diện & Hiệu ứng (UI/UX)

- 🌓 **Chuyển đổi giao diện Sáng / Tối (Circular View Transition)**: Hiệu ứng vòng tròn nở bung từ nút bấm hoặc phím tắt **`T`**.
- 🔍 **Spotlight Search toàn trang (Ctrl + K)**: Tìm kiếm tức thì theo từ khóa, thuật ngữ với các tag gợi ý nhanh (*Cache Line, TLB, SpinLock, MESI...*).
- 📜 **Thanh Mục Lục động (TOC Dynamic Glider)**: Chỉ báo trượt bám sát vị trí đang đọc kèm hiển thị % tiến độ đọc bài viết.
- 🎯 **Định vị Mục tiêu (Target Heading Pulse)**: Nhấp nháy vệt sáng nhẹ khi click nhảy tới đề mục để người đọc không bao giờ mất dấu.
- 🌟 **Quầng sáng theo chuột (Mouse-Tracking Spotlight)**: Phản chiếu ánh sáng tinh tế trên các khối code và thẻ bài viết phong cách Linear / Vercel.
- 💻 **Siêu Khối Mã Nguồn (Supercharged Code Blocks)**:
  - Tự động đánh số dòng (Line Numbers Gutter, không dính số dòng khi bôi đen copy).
  - Tự động nhận diện cú pháp (C++, C, ASM, Shell, Python).
  - **Nhấp để sao chép mã nội dòng (Click-to-Copy Inline Code)**: Bấm trực tiếp vào các biến/địa chỉ nhớ như `arr[32]`, `0x00401200`, `mmap()` để copy ngay.
- 👓 **Thanh Header Thủy tinh Nổi (Sticky Glass Topbar)**: Xuất hiện khi cuộn trang, hiển thị breadcrumb mục đang đọc cùng bộ điều chỉnh cỡ chữ (**A- / A / A+** lưu vào `localStorage`) và nút **Zen Mode**.

---

## 📚 Danh mục Chủ đề & Tài liệu (Documentation)

| # | Chủ đề tài liệu | Bản Web (HTML) | Bản Markdown (.md) |
|---|----------------|----------------|--------------------|
| 1 | **Kiến trúc Cache, Virtual Memory & Malloc Deep-Dive**<br>*(Tag, Index, Offset, VIPT, PIPT, 4-Level Paging, sbrk/mmap)* | [Xem bản Web](https://doantrunghuy.github.io/second-brain/index.html) | [`Computer_Architecture_Cache_VirtualMemory_Malloc_DeepDive.md`](Computer_Architecture_Cache_VirtualMemory_Malloc_DeepDive.md) |
| 2 | **Cơ chế phần cứng MMU, TLB & Page Table**<br>*(TLB Hit/Miss, Multi-level Paging, Two-step translation)* | [Xem bản Web](https://doantrunghuy.github.io/second-brain/mmu-tlb-page-table.html) | [`MMU_TLB_PageTable_Cache_Summary.md`](MMU_TLB_PageTable_Cache_Summary.md) |
| 3 | **Giao thức Đồng bộ Cache Đa nhân MESI**<br>*(Modified, Exclusive, Shared, Invalid, Bus Snooping)* | [Xem bản Web](https://doantrunghuy.github.io/second-brain/mesi-protocol.html) | [`MESI_Cache_Coherence_Protocol.md`](MESI_Cache_Coherence_Protocol.md) |
| 4 | **Tối ưu Đồng bộ: Phân tích SpinLock vs OS Mutex**<br>*(Futex, Context Switch overhead, Atomic CAS, Trade-offs)* | [Xem bản Web](https://doantrunghuy.github.io/second-brain/spinlock-vs-mutex.html) | [`SpinLock_TradeOff.md`](SpinLock_TradeOff.md) |
| 5 | **Quản lý Bộ nhớ Hiện đại: std::string vs std::string_view**<br>*(Zero-copy, SSO, Pointer + Length, Dangling reference)* | [Xem bản Web](https://doantrunghuy.github.io/second-brain/string-vs-string-view.html) | [`string_vs_string_view.md`](string_vs_string_view.md) |

---

## ⌨️ Phím tắt Hỗ trợ (Keyboard Shortcuts)

| Phím tắt | Thao tác |
|----------|----------|
| <kbd>Ctrl</kbd> + <kbd>K</kbd> | Mở hộp tìm kiếm Spotlight toàn trang |
| <kbd>T</kbd> | Chuyển đổi giao diện Sáng / Tối (Theme Toggle) |
| <kbd>Z</kbd> | Bật / Tắt chế độ đọc tập trung (Zen Mode) |
| <kbd>?</kbd> | Xem bảng hướng dẫn toàn bộ phím tắt |
| <kbd>Alt</kbd> + <kbd>↑</kbd> | Cuộn mượt lên đầu trang tức thì |
| <kbd>Esc</kbd> | Đóng nhanh mọi cửa sổ pop-up / modal |

---

## 🚀 Chạy thử nghiệm trên máy cục bộ (Local Run)

Bạn có thể khởi chạy server cục bộ nhanh chóng bằng Python:

```bash
# Clone repository về máy
git clone https://github.com/DoanTrungHuy/second-brain.git
cd second-brain

# Chạy HTTP Server với Python
python -m http.server 8080
```

Sau đó mở trình duyệt và truy cập: **[http://localhost:8080](http://localhost:8080)**.
