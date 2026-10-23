# 🌐 Hướng dẫn Toàn diện Ciena 3932 (CSG): Cấu hình VLAN, Bản chất Access - Trunk & Phân tích Luồng Gói Tin (Packet Call Flow)

> [!NOTE]
> Tài liệu kỹ thuật chuyên sâu về thiết bị chuyển mạch viễn thông **Ciena 3932 (Carrier Ethernet Switch / Cell Site Gateway - CSG)** chạy hệ điều hành **SAOS (Service-Aware Operating System)**.
> Giải thích chi tiết từ thao tác dòng lệnh (CLI), bản chất phân định **Access vs. Trunk**, phân tích luồng di chuyển của gói tin (**Packet Call Flow**), đến thiết kế topology mạng viễn thông thực tế (3G / 4G / VNPT Transmission).

---

## 🗺️ PHẦN 1: TỔNG QUAN PHẦN CỨNG & KẾT NỐI BAN ĐẦU

### 1.1. Cấu trúc phần cứng Ciena 3932
Thiết bị **Ciena 3932** thường được lắp đặt tại các nhà trạm viễn thông (BTS/NodeB/eNodeB) đóng vai trò là **CSG (Cell Site Gateway)** để gom lưu lượng vô tuyến đẩy lên mạng truyền dẫn quang (Metro-E / IPBB).

* **Cổng quản trị (Mgmt):** Cổng cáp đồng RJ45 độc lập phục vụ quản trị Out-of-band (OOB), tách biệt hoàn toàn với luồng dữ liệu khách hàng.
* **Cổng 1 đến 4 (Combo Ports):** Hỗ trợ linh hoạt cả cổng cáp đồng (RJ-45) hoặc cắm module quang (SFP). Tại một thời điểm chỉ sử dụng được 1 trong 2 chế độ.
* **Cổng 5 đến 8 (SFP Ports):** Cổng thuần quang, bắt buộc cắm module SFP quang (100M FE hoặc 1GE).

```
   ┌────────────────────────────────────────────────────────┐
   │ [Mgmt]   [Port 1-4: Combo RJ45/SFP]   [Port 5-8: SFP]  │
   │   OOB       Cáp đồng hoặc Quang        Thuần quang     │
   └────────────────────────────────────────────────────────┘
```

---

### 1.2. Quy trình Kết nối & Đăng nhập thiết bị

```
[Laptop Kỹ thuật] ──── (Cáp mạng RJ45) ────► [Cổng Mgmt trên Ciena 3932]
 IP: 172.16.233.213/24                          IP mặc định: 172.16.233.214
```

1. **Cắm dây mạng:** Cắm cáp mạng RJ45 từ cổng mạng laptop vào cổng **Mgmt** trên mặt trước thiết bị Ciena.
2. **Đặt IP tĩnh trên Laptop:**
   * Địa chỉ IP: `172.16.233.213`
   * Subnet Mask: `255.255.255.0` (tương đương `/24`)
   * *Giải thích:* Phải đặt IP cùng dải mạng với IP mặc định của Ciena để lớp mạng IP có thể định tuyến được với nhau.
3. **Mở phần mềm Telnet:** Sử dụng **PuTTY** hoặc **SecureCRT**, chọn kết nối **Telnet** (Port 23) tới địa chỉ `172.16.233.214`.
4. **Thông tin đăng nhập mặc định:**
   * **Username:** `su` *(Superuser - quyền quản trị cao nhất)*
   * **Password:** `wwp` *(World Wide Packets - hãng công nghệ nền tảng của SAOS được Ciena mua lại)*

---

## ⚙️ PHẦN 2: CẤU HÌNH THỰC TẾ TRẠM BTS (3G, 4G, TRUYỀN DẪN VNPT)

### 2.1. Bảng quy hoạch cổng và phân bổ VLAN

| Cổng vật lý | Thiết bị đấu nối | Chức năng mạng | VLAN ID tham gia | Chế độ cổng |
| :--- | :--- | :--- | :---: | :---: |
| **Port 5** | Truyền dẫn VNPT (MAN-E) | Uplink đường trục | `338`, `738`, `2764` | **TRUNK** |
| **Port 6** | Trạm 4G LTE (eNodeB) | Vô tuyến 4G | `338` (Data), `738` (O&M) | **TRUNK** |
| **Port 7** | Trạm 3G (NodeB) | Vô tuyến 3G | `2764` (Iub traffic) | **ACCESS** |

---

### 2.2. Chi tiết từng câu lệnh cấu hình (Line-by-Line)

```bash
# 1. Khởi tạo các VLAN dịch vụ trên switch
vlan create vlan 338,738,2764
```
* **Giải thích:** Tạo danh sách 3 VLAN trên switch Ciena: 338 & 738 (cho 4G LTE), 2764 (cho 3G). Trên hệ điều hành SAOS, VLAN phải được khởi tạo trước thì mới gán cổng vào được.

```bash
# 2. Gán các VLAN vào Port 5 (Cổng truyền dẫn VNPT Uplink)
vlan add vlan 338,738,2764 port 5
```
* **Giải thích:** Port 5 là cổng "thoát tổng" đưa dữ liệu về mạng lõi. Lệnh này cấu hình Port 5 ở chế độ **TRUNK**, cho phép cả 3 VLAN đi qua đồng thời và **giữ nguyên thẻ nhãn (VLAN Tag 802.1Q)**.

```bash
# 3. Gán VLAN 4G vào Port 6
vlan add vlan 338,738 port 6
```
* **Giải thích:** Thiết bị 4G eNodeB hiện đại tự nó phát sinh 2 luồng dịch vụ có gắn sẵn tag (VLAN 338 cho dữ liệu thuê bao và VLAN 738 cho quản trị trạm). Do đó Port 6 cũng đóng vai trò là **TRUNK** để cho phép cả 2 tem nhãn này đi qua.

```bash
# 4. Gán VLAN 3G vào Port 7 và cấu hình chế độ ACCESS
vlan add vlan 2764 port 7
port set port 7 pvid 2764
```
* **Giải thích:** 
  * `vlan add vlan 2764 port 7`: Cho phép lưu lượng thuộc VLAN 2764 đi qua Port 7.
  * `port set port 7 pvid 2764`: **Cực kỳ quan trọng!** Thiết lập **PVID (Port VLAN ID)** = 2764. Lệnh này biến Port 7 thành cổng **ACCESS**. Thiết bị trạm 3G cũ chỉ phát gói tin không nhãn (Untagged), lệnh này giúp switch tự động **dán tem 2764** khi gói tin từ 3G đi vào switch, và **bóc bỏ tem 2764** trước khi trả gói tin về cho trạm 3G.

```bash
# 5. Tắt tính năng tự động đàm phán trên các cổng truyền tải
port set port 5 auto-neg off
port set port 6 auto-neg off
port set port 7 auto-neg off
```
* **Giải thích:** **Auto-Negotiation (auto-neg)** là cơ chế tự động thương lượng tốc độ và chế độ song công (Duplex). Trong môi trường viễn thông, khi Ciena bắt tay với các thiết bị hãng khác (Huawei, Ericsson, Nokia, ZTE, Converter quang...), tính năng tự thương lượng rất dễ gây ra hiện tượng **mismatch (không đồng bộ)**, làm cổng bị chập chờn hoặc không Link Up. Ép cứng `auto-neg off` đảm bảo liên kết vật lý luôn ổn định.

```bash
# 6. Ép tốc độ cổng theo chuẩn kênh truyền
port set port 5 speed hundred   # Nếu luồng truyền dẫn VNPT thuê là Fast Ethernet (100 Mbps)
port set port 5 speed gigabit   # Nếu trạm được nâng cấp luồng Gigabit Ethernet (1 Gbps)
port set port 7 speed hundred   # Cổng 3G luôn ép cố định 100 Mbps (FE) theo chuẩn card trạm 3G
```

```bash
# 7. Lưu cấu hình vào bộ nhớ vĩnh viễn
config save
```
* **Giải thích:** Lưu toàn bộ cấu hình từ bộ nhớ tạm (RAM/running-config) vào bộ nhớ Flash (startup-config). Nếu không gõ lệnh này, khi trạm mất điện hoặc khởi động lại, switch sẽ trở về trạng thái trắng.

---

## 🎯 PHẦN 3: BẢN CHẤT CỐT LÕI — TẠI SAO PHẢI CÓ ACCESS VÀ TRUNK?

Để phân biệt chính xác khi nào dùng Access, khi nào dùng Trunk, chỉ cần dựa vào nguyên lý cốt lõi:

> **"Gói tin có mang nhãn thẻ (VLAN Tag 802.1Q) hay không, và thiết bị cắm ở đầu dây bên kia có biết đọc nhãn thẻ đó không?"**

```
Gói tin Ethernet chuẩn (Untagged):
┌──────────────┬──────────────┬──────────┬──────────────┬────────┐
│   MAC Đích   │  MAC Nguồn   │   Type   │   Dữ liệu    │  FCS   │
└──────────────┴──────────────┴──────────┴──────────────┴────────┘

Gói tin được dán tem VLAN (802.1Q Tagged - Thêm 4 Bytes):
┌──────────────┬──────────────┬──────────────┬──────────┬──────────────┬────────┐
│   MAC Đích   │  MAC Nguồn   │ VLAN Tag(4B) │   Type   │   Dữ liệu    │  FCS   │
└──────────────┴──────────────┴──────────────┴──────────┴──────────────┴────────┘
                                     ▲
                                [VLAN ID: 12-bit]
```

---

### 3.1. Cổng ACCESS (Dành cho Thiết bị Đầu cuối)

* **Đối tượng kết nối:** Máy tính laptop, Camera an ninh, Máy in, Trạm 3G NodeB (các thiết bị chỉ thuộc về 1 mạng duy nhất).
* **Đặc điểm thiết bị:** Là các thiết bị **"mù VLAN"**, không hiểu mã thẻ 802.1Q. Nếu đưa gói tin có gắn mã VLAN cho chúng, chúng sẽ coi là gói tin lỗi và **vứt bỏ (Drop packet)**.
* **Cơ chế hoạt động:**
  * **Chiều vào (Ingress):** Nhận gói tin trần (Untagged) từ thiết bị ➜ Switch tự động **dán nhãn PVID** tương ứng vào gói tin.
  * **Chiều ra (Egress):** Trước khi đẩy gói tin ra dây mạng cho thiết bị ➜ Switch tự động **bóc bỏ nhãn VLAN** để trả lại gói tin trần sạch sẽ.

---

### 3.2. Cổng TRUNK (Đường ống Gom cho nhiều VLAN)

* **Đối tượng kết nối:** Giữa Switch sang Switch, Switch sang Router truyền dẫn (VNPT), Switch cắm vào máy chủ ảo hóa (ESXi), hoặc cắm vào BBU 4G/5G.
* **Tại sao bắt buộc phải dùng Trunk?**
  1. **Tiết kiệm cổng và dây cáp:** Nếu có 10 VLAN khác nhau, thay vì phải cắm 10 sợi dây cáp riêng biệt, ta chỉ cần **1 sợi cáp duy nhất** nối giữa 2 thiết bị mạng.
  2. **Giữ nguyên con tem phân loại:** Trên sợi dây cáp chung đó, mọi gói tin bắt buộc phải được **giữ nguyên mã nhãn VLAN Tag** để sang đến thiết bị đối diện, thiết bị đó nhìn nhãn là phân loại được gói tin thuộc về dịch vụ nào.

---

### 3.3. So sánh tổng kết

| Tiêu chí | Cổng ACCESS | Cổng TRUNK |
| :--- | :--- | :--- |
| **Số lượng VLAN cho phép** | Chỉ duy nhất **1 VLAN** | **Nhiều VLAN** cùng lúc |
| **Trạng thái gói tin trên dây** | Luôn là **Untagged** (không có nhãn) | Luôn là **Tagged** (mang nhãn thẻ 802.1Q) |
| **Thiết bị cắm vào** | Laptop, PC, Camera, NodeB 3G | Switch khác, Router VNPT, BBU 4G/5G |
| **Hành vi xử lý tem** | Vào thì **dán tem**, Ra thì **bóc tem** | **Giữ nguyên tem** khi truyền qua cáp |
| **Hậu quả nếu cấu hình sai** | Cắm PC vào Trunk ➜ PC không hiểu tem ➜ **Mất mạng** | Nối 2 Switch bằng Access ➜ **Chỉ chạy được 1 VLAN**, các VLAN khác bị nghẽn |

---

## 🔄 PHẦN 4: PHÂN TÍCH LUỒNG GÓI TIN CHI TIẾT (PACKET CALL FLOW)

### 4.1. Call Flow 1: Trạm 3G ➜ Switch Ciena ➜ Truyền dẫn VNPT

```text
[Trạm 3G NodeB]
       │
       │ (1) Gói tin TRẦN (Untagged)
       ▼
[Port 7: ACCESS (PVID 2764)] ──► (2) Switch DÁN TEM VLAN 2764
       │
       ▼
 [Switch Ciena 3932]         ──► (3) Chuyển mạch trong nội bộ VLAN 2764
       │
       ▼
[Port 5: TRUNK]              ──► (4) GIỮ NGUYÊN TEM VLAN 2764
       │
       │ (5) Gói tin CÓ TEM 2764 (Tagged)
       ▼
[Mạng truyền dẫn VNPT / RNC Core]
```

* **Chiều đi (3G lên Core VNPT):**
  1. Trạm 3G gửi frame Ethernet tiêu chuẩn (không có tag).
  2. Frame đi vào **Port 7 (Access)**: Switch kiểm tra cấu hình PVID và lập tức **chèn 4 bytes mã nhãn VLAN 2764** vào header của frame.
  3. Bộ vi xử lý chuyển mạch tra bảng MAC và chuyển frame sang hàng đợi của **Port 5 (Uplink)**.
  4. Frame đi ra **Port 5 (Trunk)**: Switch kiểm tra danh sách VLAN cho phép, thấy VLAN 2764 hợp lệ ➜ **giữ nguyên tem 2764** và phát quang sang thiết bị VNPT.
  5. Phía VNPT nhận frame có tem 2764 ➜ định tuyến chuẩn xác về trung tâm điều khiển 3G (RNC).

* **Chiều về (Core VNPT trả lời trạm 3G):**
  1. VNPT gửi frame có sẵn **tem 2764** vào Port 5 của Ciena.
  2. Port 5 (Trunk) nhận frame, kiểm tra hợp lệ và đưa vào ruột switch.
  3. Switch tra bảng MAC đích, xác định cổng ra là Port 7.
  4. Trước khi bắn frame ra Port 7 (Access), Switch thực hiện thao tác **BÓC BỎ (Strip) con tem 2764**.
  5. Trạm 3G nhận frame trần sạch sẽ, xử lý thông suốt cuộc gọi.

---

### 4.2. Call Flow 2: Laptop nối Switch (Mô hình cùng VLAN vs Khác VLAN)

```text
[Laptop A: Kế toán]          [Laptop B: Kế toán]          [Laptop C: Kỹ thuật]
       │                            ▲                            ▲
       │                            │                            │
[Port 1: Access 10]          [Port 2: Access 10]          [Port 3: Access 20]
  └─────────────────────────────────┴────────────────────────────┘
                              [ SWITCH ]
```

* **Cùng VLAN 10 (Laptop A gửi Laptop B):**
  * Laptop A gửi frame trần ➜ Port 1 dán tem 10.
  * Switch thấy Laptop B ở Port 2 (cùng VLAN 10) ➜ Port 2 bóc tem 10 ➜ Laptop B nhận frame trần.
  * 👉 **Hai máy thông mạng hoàn toàn mà không hề biết có sự tồn tại của VLAN.**
* **Khác VLAN (Laptop A muốn gửi Laptop C):**
  * Laptop A gửi frame trần ➜ Port 1 dán tem 10.
  * Switch kiểm tra Port 3 của Laptop C thuộc **VLAN 20**. Vì khác biệt VLAN ở Layer 2, Switch **hủy bỏ gói tin ngay lập tức (Drop)**.
  * 👉 **Bảo mật tuyệt đối giữa các phòng ban.**

---

### 4.3. Call Flow 3: Switch nối Switch qua đường Trunk liên tầng

```text
[TẦNG 1]                                                     [TẦNG 2]
Laptop A (VLAN 10)                                           Laptop B (VLAN 10)
       │                                                             ▲
       ▼                                                             │
(Port 1: Access 10)                                          (Port 2: Access 10)
┌──────────────┐                                            ┌──────────────┐
│   SWITCH 1   │                                            │   SWITCH 2   │
│              │                                            │              │
│ (Port 8)     │                                            │     (Port 8) │
└──────┬───────┘                                            └──────▲───────┘
       │                                                           │
       └──────── [Cổng TRUNK] ──(Dây cáp nối 2 SW)──► [Cổng TRUNK] ┘
```

1. Laptop A gửi gói tin không tem vào **Port 1 (SW1)** ➜ SW1 **dán tem 10**.
2. SW1 chuyển gói tin ra **Port 8 (Trunk)** ➜ Giữ nguyên tem 10, bắn qua dây cáp liên switch.
3. Gói tin mang tem 10 chạy vào **Port 8 (Trunk)** của **SW2** ➜ SW2 chấp nhận gói tin vì Port 8 cho phép VLAN 10.
4. SW2 tra địa chỉ đích thấy Laptop B ở **Port 2 (Access)** ➜ SW2 **bóc tem 10** và trả frame nguyên bản cho Laptop B.

---

## 🔌 PHẦN 5: BẢN CHẤT ĐƯỜNG DÂY NỐI VÀ NGUYÊN TẮC THIẾT KẾ MẠNG

### 5.1. Dây cáp từ Laptop đến Switch và từ Switch sang Switch gọi là gì?

| Vị trí kết nối | Tên gọi theo Chức năng Kỹ thuật | Tên gọi theo Dây vật lý |
| :--- | :--- | :--- |
| **Laptop ➜ Switch** | **Đường Access** *(Access Link)* | Cáp thẳng *(Straight-Through)* hoặc Dây nhảy mạng *(Patch cord RJ45)* |
| **Switch 1 ➜ Switch 2** | **Đường Trunk** *(Trunk Link)* hoặc **Uplink** | Cáp chéo *(Crossover)* hoặc Cáp thẳng *(Auto-MDIX)* hoặc Dây nhảy quang *(Fiber Patch cord SFP)* |

---

### 5.2. Dây cáp nối giữa 2 Switch có phải cấu hình cả 2 đầu cổng không?
* **CÂU TRẢ LỜI: BẮT BUỘC PHẢI CẤU HÌNH CẢ 2 ĐẦU CỔNG!**
* Sợi dây mạng có 2 đầu: 1 đầu cắm vào Port trên Switch 1, 1 đầu cắm vào Port trên Switch 2. Cả 2 cổng này **đều phải được khai báo cấu hình TRUNK đồng bộ với nhau**.
* Nếu một bên là Trunk mà bên kia quên cấu hình (vẫn là Access hoặc chưa mở VLAN), gói tin sẽ bị vứt bỏ ngay tại cổng vào, dẫn tới **mất kết nối hoàn toàn**.

---

### 5.3. Trả lời bài toán: "Dùng Access nối 2 Switch thay vì Trunk thì cần bao nhiêu dây?"

> **Quy tắc vàng:** Số lượng dây nối Access giữa 2 switch **PHỤ THUỘC VÀO SỐ LƯỢNG VLAN**, hoàn toàn **KHÔNG PHỤ THUỘC VÀO SỐ LƯỢNG LAPTOP**!

1. **Nếu trên SW1 có 100 Laptop nhưng TẤT CẢ đều thuộc VLAN 10:**
   * Bạn **chỉ cần đúng 1 sợi dây cáp Access (VLAN 10)** nối giữa 2 Switch là cả 100 máy đều thông sang SW2 bình thường.
2. **Nếu trên SW1 có 3 VLAN khác nhau (VLAN 10 - Kế toán, VLAN 20 - Kỹ thuật, VLAN 30 - Giám đốc):**
   * Nếu dùng **ACCESS**: Bạn bắt buộc phải cắm **3 sợi dây cáp riêng biệt** nối giữa 2 Switch (Sợi 1 cho VLAN 10, Sợi 2 cho VLAN 20, Sợi 3 cho VLAN 30). Nếu có 10 VLAN thì tốn 10 sợi dây và mất 10 cổng mỗi bên!
   * Nếu dùng **TRUNK**: Bạn chỉ cần **ĐÚNG 1 SỢI DÂY CÁP DUY NHẤT** là đủ sức gánh toàn bộ các VLAN đi qua mà không lo bị lẫn lộn.

---

## 🛠️ PHẦN 6: BỘ LỆNH QUẢN TRỊ, ĐO KIỂM QUANG & CHẨN ĐOÁN SỰ CỐ (CIENA SAOS)

### 6.1. Đo kiểm công suất quang SFP (Rất quan trọng khi đi ứng cứu trạm)
```bash
port xcvr show port 3 diag
```
* **Giải thích:** Đọc thông số chẩn đoán số **DDM/DOM** của module quang tại Port 3:
  * **Rx Power (dBm):** Mức công suất quang thu vào. Giúp kiểm tra suy hao tuyến cáp quang (mức chuẩn viễn thông thường nằm trong khoảng `-8 dBm` đến `-18 dBm`; nếu dưới `-25 dBm` là suy hao quá cao, dưới `-30 dBm` là đứt quang/Loss of Signal).
  * **Tx Power (dBm):** Công suất quang phát ra của module (thường từ `-3 dBm` đến `-9 dBm`).
  * **Temperature (°C):** Nhiệt độ hoạt động của SFP.

### 6.2. Kiểm tra trạng thái toàn bộ cổng vật lý
```bash
port show status
```
* **Giải thích:** Hiển thị danh sách tổng thể các cổng:
  * `Link Up / Down`: Đã cắm dây và có tín hiệu hay chưa.
  * `Speed`: 100M hay 1000M (1G).
  * `Duplex`: Full Duplex hay Half Duplex.
  * `Mode`: Cổng đang chạy chế độ `rj45` hay `sfp`.

### 6.3. Cấu hình cổng Combo quang/điện
```bash
port set port 1 mode rj45   # Kích hoạt lỗ cắm cáp đồng RJ45 trên cổng combo 1
port set port 1 mode sfp    # Kích hoạt khe cắm module quang SFP trên cổng combo 1
```

### 6.4. Đặt tên chú thích cho cổng và VLAN
```bash
port set port 5 description UPLINK_TO_VNPT_MANE
port set port 6 description TO_4G_ENODEB_BBU
port set port 7 description TO_3G_NODEB
vlan rename vlan 2764 name 3G_TRAFFIC
vlan show
```

### 6.5. Mẹo xử lý sự cố thực tế khi thử nghiệm (Ping không thông)
1. **Kiểm tra địa chỉ IP:** Hai máy tính thuộc cùng 1 VLAN muốn ping thấy nhau bắt buộc phải được đặt IP cùng một lớp mạng (ví dụ `192.168.10.1/24` và `192.168.10.2/24`).
2. **Kiểm tra Windows Firewall:** Hệ điều hành Windows mặc định chặn gói tin ICMP (Ping). Cần tắt tường lửa (`Turn off Windows Defender Firewall`) trên cả 2 laptop để kiểm tra kết nối thông mạng.
