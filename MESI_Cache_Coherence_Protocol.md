# Tổng quan về Cache Coherence Protocol (MESI) & Kiến trúc Bus trong CPU

---

## 1. Vấn đề Đồng bộ Bộ nhớ đệm (Cache Coherence)

Trong kiến trúc CPU đa nhân (Multi-core) hiện đại:
* **L1 và L2 Cache:** Nằm riêng bên trong từng Core để đảm bảo tốc độ truy xuất siêu nhanh.
* **L3 Cache và Main Memory (RAM vật lý):** Là bộ nhớ dùng chung (Shared Memory) cho toàn bộ hệ thống.

### Bài toán đặt ra:
1. Core 1 và Core 2 cùng copy biến `X = 5` từ ô nhớ **RAM vật lý** `0x00A1F000` về L1 Cache của mình.
2. Core 1 sửa `X = 10` (chỉ mới cập nhật ở L1 Cache của Core 1).
3. Nếu Core 2 tiếp tục đọc `X` từ L1 Cache của nó, Core 2 vẫn thấy `X = 5` (**Dữ liệu bị bất đồng bộ / Stale Data**).

Để giải quyết vấn đề này, phần cứng CPU sử dụng giao thức **MESI** kết hợp với **Hệ thống Bus** để đồng bộ giữa các L1/L2 Cache.

---

## 2. Giao thức MESI (MESI Protocol)

Giao thức **MESI** gắn cho mỗi **Cache Line** (khối đệm chuẩn rộng 64 bytes) một trạng thái đại diện bởi 2 bit vật lý được đúc sẵn trên chip silicon.

| Trạng thái | Tên đầy đủ | Dữ liệu đúng so với RAM? | Có nằm ở Cache nhân khác? | Quyền Ghi (Write) |
| :--- | :--- | :--- | :--- | :--- |
| **M** | **Modified** *(Đã sửa)* | **Không** (Cache mới hơn RAM) | **Không** (Chỉ duy nhất 1 nhân giữ) | Ghi trực tiếp ngay lập tức |
| **E** | **Exclusive** *(Độc quyền)* | **Có** (Giống hệt RAM) | **Không** (Chỉ duy nhất 1 nhân giữ) | Đổi sang **M** rồi ghi trực tiếp |
| **S** | **Shared** *(Chia sẻ)* | **Có** (Giống hệt RAM) | **Có** (Đang nằm ở 1 hoặc nhiều nhân khác) | Phải hủy bản sao nhân khác trước |
| **I** | **Invalid** *(Không hợp lệ)* | Không xác định | Không quan tâm | Xem như Cache Miss, phải nạp lại |

### Bản chất 2-bit MESI trên phần cứng:
* 2 bit này là các mạch lưu trữ điện thế (Flip-Flops) nằm cố định bên cạnh mỗi khối Cache Line.
* Khi vừa bật máy, phần cứng mặc định gán 2 bit này của **tất cả Cache Line** thành trạng thái **`00` (Invalid)**.
* Kích thước Cache Line không đổi, 2 bit này chỉ liên tục chuyển đổi giá trị điện áp (`00`, `01`, `10`, `11`) trong quá trình vận hành.

---

## 3. Bản chất của Bus & Mạch Snooping

### 3.1. Bus là gì?
**Bus** là tập hợp các đường dây dẫn tín hiệu điện (in trên vi mạch) nối tất cả các Core, L3 Cache và RAM lại với nhau. Bus gồm 3 tuyến dây chính:
1. **Bus Địa chỉ (Address Bus):** Chứa địa chỉ ô nhớ RAM vật lý (ví dụ: `0x00A1F000`).
2. **Bus Dữ liệu (Data Bus):** Chứa giá trị thực sự (ví dụ: `10`).
3. **Bus Điều khiển (Control Bus):** Chứa loại lệnh (`READ`, `WRITE`, `INVALIDATE`).

### 3.2. Cấu trúc 1 Cache Line trên phần cứng
Mỗi khối Cache Line trong L1/L2 Cache bao gồm 3 phần:

$$\text{Cache Line} = \text{Data (64 bytes)} + \text{Trạng thái MESI (2 bits)} + \text{Address Tag (Nhãn địa chỉ RAM)}$$

* **Address Tag:** Lưu chính xác **Địa chỉ RAM vật lý** (Physical Address) mà khối 64 bytes đó được copy về.

### 3.3. Cơ chế so sánh địa chỉ (Bus Snooping)
Khi Core 1 sửa `X = 10`, nó phát tín hiệu lệnh `INVALIDATE` kèm địa chỉ RAM vật lý `0x00A1F000` lên Bus:

1. **Phát tín hiệu quảng bá (Broadcast):** Tín hiệu điện chạy trên dây Bus đến lối vào của **tất cả các Core còn lại cùng lúc**.
2. **Kiểm tra ở Mạch Snooping (Snoop Controller):** Tại lối vào L1 Cache của Core 2, một mạch logic phần cứng chứa hàng trăm **mạch so sánh (Comparators)** sẽ lấy địa chỉ `0x00A1F000` từ Bus đem so sánh song song với **Address Tags** trong Cache của Core 2.
3. **Xử lý kết quả:**
   * **Nếu trùng (Hit):** Mạch Snooping xác định Core 2 cũng đang giữ bản sao của ô RAM `0x00A1F000`. Lập tức bật 2 bit MESI của ô nhớ đó ở Core 2 về **Invalid (I)** chỉ trong 1 chu kỳ xung nhịp (clock cycle).
   * **Nếu không trùng (Miss):** Core 2 bỏ qua tín hiệu.

---

## 4. Kịch bản vận hành thực tế (Step-by-Step)

Giả sử ban đầu ô nhớ `X` tại địa chỉ RAM vật lý `0x00A1F000` có giá trị bằng `5`.