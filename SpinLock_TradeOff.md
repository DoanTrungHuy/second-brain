# Tổng hợp Kiến thức - Dự án TurboKV (Low-level C++ & System Design)

Tài liệu này tổng hợp các kiến thức cốt lõi về tối ưu hóa hiệu năng (Performance Optimization) và lập trình đồng thời (Concurrency) mức độ Micro-giây, dựa trên mã nguồn thực tế của dự án.

---

## 1. Trade-off: OS Mutex vs User-Space SpinLock
Sự đánh đổi cốt lõi giữa Mutex và SpinLock là: **"Đốt CPU để lấy độ trễ siêu thấp"** so với **"Tiết kiệm CPU nhưng chịu độ trễ cao"**.

*   **OS Mutex (`std::mutex`):** Khi luồng A giữ khóa, các luồng B, C, D lao tới sẽ bị hệ điều hành (OS) ép thực hiện **Syscall** (như `futex` trên Linux) để chuyển trạng thái sang Sleep. Khi A nhả khóa, OS tốn thời gian Wakeup các luồng khác. Sự ra vào Kernel (Context Switch) này làm tăng Latency (độ trễ).
*   **SpinLock:** Hoạt động 100% ở User-Space. Luồng bị chặn sẽ chạy một vòng lặp (Spin) liên tục để hỏi xem khóa mở chưa. Đổi lại việc tốn vài chu kỳ CPU để xoay vòng, SpinLock triệt tiêu được rào cản Syscall. Ngay khi A nhả khóa, B lấy được khóa ngay lập tức trong cùng 1 chu kỳ phần cứng. Rất phù hợp cho các Critical Section cực kỳ ngắn (vài micro-giây).

---

## 2. Kiến trúc 256-way Sharded Hash Map
*   **Decentralize Bottleneck:** Thay vì dùng 1 Mutex duy nhất bảo vệ toàn bộ Hash Map (khiến các luồng truy cập Key khác nhau cũng phải đợi nhau), dữ liệu được chia làm 256 phân vùng (Shards). Các luồng ghi vào các Shard khác nhau chạy hoàn toàn song song.
*   **Chống False Sharing (`alignas(64)`):** Bằng cách buộc cấu trúc của mỗi Shard phải căn lề bộ nhớ 64 bytes (kích thước một CPU Cache Line), ta đảm bảo các ổ khóa `SpinLock` của 2 Shard liền kề KHÔNG BAO GIỜ nằm chung trên một Cache Line. Điều này ngăn chặn việc các lõi CPU liên tục vô hiệu hóa Cache của nhau, giữ hiệu năng phần cứng ở mức tối đa.

---

## 3. "Giải phẫu" SpinLock
```cpp
class SpinLock {
    std::atomic_flag flag = ATOMIC_FLAG_INIT;
public:
    void lock() {
        while (flag.test_and_set(std::memory_order_acquire)) {
            __builtin_ia32_pause();
        }
    }
    void unlock() {
        flag.clear(std::memory_order_release);
    }
};
```
*   `std::atomic_flag`: Kiểu dữ liệu duy nhất trong C++ được chuẩn hóa đảm bảo 100% Lock-Free trên mọi phần cứng.
*   `test_and_set()`: Hàm thực hiện nguyên tử (Atomic) 2 việc cùng lúc: Đóng cờ (Set = `true`) và trả về trạng thái cũ. Nếu trả về `false` (chưa ai khóa) $\rightarrow$ lấy được khóa. Nếu trả về `true` (đã khóa) $\rightarrow$ tiếp tục Spin trong vòng lặp `while`.

---

## 4. Memory Order & Instruction Reordering (Đảo lộn lệnh)
Trình biên dịch và CPU luôn có xu hướng đảo lộn thứ tự các lệnh để chạy cho nhanh. Nếu không có rào cản (Memory Barriers), CPU có thể mang đoạn code xử lý dữ liệu ra khỏi phạm vi khóa, gây nát dữ liệu.
*   **`memory_order_acquire` (Rào cản đi XUỐNG):** Đặt ở hàm `lock()`. Cấm tuyệt đối CPU không được kéo bất kỳ dòng code nào ở BÊN DƯỚI khóa vượt lên chạy trước khi thực sự lấy được khóa.
*   **`memory_order_release` (Rào cản đi LÊN):** Đặt ở hàm `unlock()`. Cấm CPU không được trượt bất kỳ lệnh nào từ BÊN TRÊN xuống chạy sau khi đã mở khóa. Đồng thời bắt CPU đồng bộ hóa toàn bộ dữ liệu vừa sửa xuống RAM.
$\rightarrow$ Hai rào cản này nhốt chặt đoạn dữ liệu quan trọng ở giữa, tạo thành vùng an toàn (Critical Section) tuyệt đối.

---

## 5. Chu kỳ CPU (CPU Cycle)
*   Chu kỳ là "nhịp đập" của CPU. 1 CPU 3GHz đập 3 tỷ nhịp mỗi giây (1 cycle $\approx$ 0.3 ns).
*   Đọc dữ liệu từ L1 Cache tốn 1-3 chu kỳ. Đọc từ RAM tốn 200-300 chu kỳ. 
*   Đó là lý do dự án sử dụng `Zero-Allocation` (không dùng `new/malloc`) và `Slab Allocator` để ép dữ liệu nằm vừa vặn trong Cache, tránh tốn chu kỳ lãng phí vào việc chờ RAM.

---

## 6. CPU Pipelining, Branch Prediction & Pipeline Flush
*   **Pipeline (Đường ống):** CPU chia nhỏ lệnh thành các bước (Fetch, Decode, Execute...) và đưa liên tục vào đường ống để thực thi gối đầu lên nhau.
*   **Branch Prediction (Đoán rẽ nhánh):** Khi gặp vòng lặp `while` (chờ khóa), CPU sẽ "đoán mò" là khóa còn lâu mới mở, và nhồi trước hàng trăm lệnh chờ đợi vào Pipeline.
*   **Pipeline Flush (Gãy đường ống):** Khi khóa đột ngột mở (`flag = false`), kết quả tiên đoán của CPU bị sai. CPU bắt buộc phải vứt bỏ toàn bộ lệnh chờ đợi làm dở dang trong Pipeline vào sọt rác, và nạp lại lệnh đúng từ đầu. Sự dọn dẹp này tốn hàng chục chu kỳ CPU, gây đứng hình (Stall).

## 7. Giải pháp từ lệnh `__builtin_ia32_pause()`
Lệnh `pause` (dịch ra hợp ngữ là `PAUSE` trên x86) chính là tín hiệu báo cho CPU biết: *"Đây là vòng lặp chờ, đừng đoán mò"*.
1.  **Chống gãy đường ống:** CPU ngừng nhồi nhét lệnh vào Pipeline, khi khóa mở, luồng bay thẳng vào Critical Section mà không có rác cần dọn.
2.  **Hạ nhiệt & Tiết kiệm điện:** Ép luồng "nghỉ ngơi" một chút xíu, giảm tần suất chọc vào RAM.
3.  **Nhường tài nguyên:** Trong môi trường Hyper-Threading, luồng đang Spin sẽ nhường Execution Units lại cho luồng khác xài chung nhân vật lý, giúp toàn bộ hệ thống tăng tốc.
