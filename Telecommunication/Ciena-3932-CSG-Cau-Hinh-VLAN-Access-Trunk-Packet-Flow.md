# 💡 Bản chất VLAN, Access và Trunk: Cẩm nang Hiểu Mạng qua Ví dụ Thực tế Hằng ngày

> [!NOTE]
> Tài liệu này không tập trung vào việc học vẹt câu lệnh, mà giúp bạn **nắm trọn bản chất cốt lõi của mạng (Networking)**:
> Tại sao phải chia ra **Access** và **Trunk**? Khi nào bắt buộc dùng loại nào? Luồng dữ liệu chạy ra sao qua những tình huống thực chiến hằng ngày (Laptop – Switch, Switch – Switch).

---

## 🏢 1. BÀI TOÁN THỰC TẾ: Tại sao ở nhà cắm mạng là chạy, mà đi làm lại phải có Access & Trunk?

### 1.1. Ở nhà vs. Môi trường Doanh nghiệp / Viễn thông
* **Mạng ở nhà:** Bạn cắm dây vào cổng nào của modem thì điện thoại, tivi, laptop đều vào được mạng. Vì tất cả thiết bị đều ở chung **1 mạng duy nhất**.
* **Mạng doanh nghiệp / Viễn thông:** Người ta phải chia ra làm **nhiều mạng riêng biệt (gọi là VLAN)** chạy song song trên cùng một con Switch:
  * Mạng Kế toán (**VLAN 10**) — Lưu bảng lương, tài chính mật.
  * Mạng Kỹ thuật (**VLAN 20**) — Chạy server, code, dữ liệu kỹ thuật.
  * Mạng Khách (**VLAN 30**) — Chỉ cho khách lướt web, không được chọc vào nội bộ.
  * *Trong trạm viễn thông:* Mạng 3G (**VLAN 2764**), Mạng 4G (**VLAN 338**), Mạng Camera giám sát trạm.

### 1.2. Mâu thuẫn sinh ra từ việc chia VLAN
Khi đã chia nhiều VLAN trên 1 con Switch, Switch sẽ đối mặt với 2 vấn đề lớn:
1. **Làm sao để đưa dữ liệu cho Laptop/Camera mà nó đọc hiểu được?** (Vì máy tính, camera thông thường không hiểu mã VLAN).
2. **Làm sao để truyền nhiều VLAN sang một Switch khác mà không cần phải kéo hàng chục sợi dây mạng?**

👉 **Chính 2 bài toán này đã khai sinh ra Cổng ACCESS và Cổng TRUNK!**

---

## 🚪 2. CỔNG ACCESS: "Cửa phòng riêng" (Vào dán tem – Ra bóc tem)

### 2.1. Bản chất và Đối tượng kết nối
* **Đối tượng cắm vào:** Máy tính laptop, PC văn phòng, Camera an ninh trạm, Máy in, Trạm 3G NodeB đời cũ...
* **Đặc điểm thiết bị:** Đây là các **thiết bị đầu cuối** (End-device). Bản thân chúng là các thiết bị **"mù VLAN"**:
  * Chúng chỉ biết gửi và nhận các gói tin trần trụi thông thường (**Untagged**).
  * Nếu bạn gửi cho chúng một gói tin có dán mã số VLAN (Tagged), chúng sẽ coi đó là gói tin bị lỗi/rác và **vứt bỏ ngay lập tức (Drop packet) ➜ Mất mạng!**

### 2.2. Nhiệm vụ của cổng Access
Cổng Access đóng vai trò như một người bảo vệ đứng ở cửa phòng riêng:
* **Chiều vào (Thiết bị gửi lên Switch):** Thiết bị phát gói tin không tem. Cổng Access nhận vào và **tự động dán con tem (VLAN ID)** của cổng đó lên gói tin.
* **Chiều ra (Switch trả dữ liệu về thiết bị):** Gói tin từ trong mạng đi tới cổng Access đang có tem. Trước khi đẩy ra dây mạng cho thiết bị, cổng Access **tự động bóc sạch con tem ra**, trả lại gói tin nguyên bản sạch sẽ cho thiết bị đọc.

```text
[Laptop / Camera] 
       │ 
       │ (1) Gói tin KHÔNG TEM (Untagged)
       ▼
[CỔNG ACCESS] ──► TỰ ĐỘNG DÁN TEM (Ví dụ: Tem VLAN 10)
       │
       ▼
 [RUỘT SWITCH] ──► Chuyển mạch an toàn trong phạm vi VLAN 10
       │
       ▼
[CỔNG ACCESS] ──► TỰ ĐỘNG BÓC TEM (Lột bỏ mã VLAN 10)
       │
       │ (2) Trả lại gói tin KHÔNG TEM sạch sẽ
       ▼
[Laptop / Camera]
```

> 🎯 **Quy tắc nhớ nhanh:** Cắm vào thiết bị đầu cuối chỉ thuộc về 1 dịch vụ ➜ **Bắt buộc chọn ACCESS**.

---

## 🚛 3. CỔNG TRUNK: "Thùng xe tải chở hàng chung" (Giữ nguyên tem)

### 3.1. Bản chất và Đối tượng kết nối
* **Đối tượng cắm vào:**
  * Dây nối giữa **Switch này sang Switch khác** (ví dụ: Switch Tầng 1 nối Switch Tầng 2).
  * Dây nối từ **Switch lên Router truyền dẫn** (VNPT, Viettel).
  * Dây nối vào thiết bị thông minh chạy nhiều dịch vụ cùng lúc (Server ảo hóa ESXi, BBU 4G/5G).

### 3.2. Tại sao bắt buộc phải dùng Trunk?
1. **Tiết kiệm cổng và dây cáp cực lớn:**
   * Giả sử tòa nhà có 5 phòng ban (5 VLAN). Nếu không có Trunk, bạn phải cắm **5 sợi dây mạng** nối giữa 2 con Switch.
   * Cổng Trunk cho phép gom cả 5 phòng ban chạy chung trên **đúng 1 sợi dây cáp duy nhất**!
2. **Giữ nguyên con tem để bên kia phân loại:**
   * Vì nhiều phòng ban đi chung trên 1 sợi dây, các gói tin bắt buộc phải **được giữ nguyên con tem (VLAN Tag)** trên suốt đường đi.
   * Khi sang đến Switch đối diện, Switch đó nhìn con tem sẽ biết ngay: Gói nào tem Kế toán thì chuyển cho Kế toán, gói nào tem Kỹ thuật thì chuyển cho Kỹ thuật, **tuyệt đối không bị lẫn hàng**.

```text
┌──────────────┐                               ┌───────────────┐
│   SWITCH 1   ├─── [1 SỢI DÂY CÁP DUY NHẤT] ───┤   SWITCH 2    │
└──────────────┘    (Chở chung tem 10, 20, 30)  └───────────────┘
       ▲                                               ▲
   [CỔNG TRUNK]                                   [CỔNG TRUNK]
(Cho phép đi qua &                             (Cho phép đi qua &
  GIỮ NGUYÊN TEM)                                GIỮ NGUYÊN TEM)
```

> 🎯 **Quy tắc nhớ nhanh:** Dây liên kết giữa 2 thiết bị mạng chở nhiều VLAN ➜ **Bắt buộc chọn TRUNK**.

---

## 🧠 4. GIẢI ĐÁP CÁC CÂU HỎI THỰC CHIẾN KINH ĐIỂN

Dưới đây là các tình huống thực tế mà kỹ sư mạng hay gặp nhất:

---

### ❓ Câu hỏi 1: Lap 1 cắm Port 1 (SW1), Lap 2 cắm Port 2 (SW2) đều cấu hình Access VLAN 10 thì có thông nhau không?

```text
[Lap 1] ──► (Port 1: Access 10) [SW 1]                      [SW 2] (Port 2: Access 10) ◄── [Lap 2]
                                   │                           ▲
                                   └─── [Dây cáp nối 2 SW] ────┘
```

* **TRẢ LỜI:** **HOÀN TOÀN THÔNG NHAU!**
* **Điều kiện bắt buộc đi kèm:**
  1. Giữa SW1 và SW2 phải có **1 sợi dây cáp nối với nhau**.
  2. Hai đầu cổng của sợi dây cáp đó phải được cấu hình là **TRUNK** (cho phép VLAN 10 đi qua).
  3. Hai Laptop được đặt địa chỉ IP cùng một dải mạng (ví dụ `192.168.10.1` và `192.168.10.2`) và đã tắt tường lửa Windows Firewall.

---

### ❓ Câu hỏi 2: Dây cáp nối giữa SW1 và SW2 có phải cấu hình cả 2 đầu cổng không?

* **TRẢ LỜI:** **BẮT BUỘC PHẢI CẤU HÌNH CẢ 2 ĐẦU CỔNG!**
* **Tại sao?**
  * Sợi dây mạng có 2 đầu: 1 đầu cắm vào Port trên SW1 (ví dụ Port 8), 1 đầu cắm vào Port trên SW2 (ví dụ Port 8).
  * Bạn phải cấu hình:
    * Trên SW1: Khai **Port 8 là TRUNK** (cho phép VLAN 10).
    * Trên SW2: Khai **Port 8 là TRUNK** (cho phép VLAN 10).
* **Nếu chỉ cấu hình 1 bên thì sao?** 
  * SW1 gửi gói tin có dán tem sang. 
  * SW2 chưa được cấu hình Trunk nên không hiểu con tem đó là gì ➜ **Nó vứt bỏ luôn gói tin** ➜ Mất thông mạng ngay lập tức!
* 👉 **Quy tắc vàng:** Hai đầu của một sợi dây liên kết mạng phải luôn **đồng bộ cấu hình với nhau**.

---

### ❓ Câu hỏi 3: Nếu không dùng Trunk mà dùng Access nối 2 Switch thì có được không? Số dây nối tính thế nào?

Đây là câu hỏi tư duy hay nhất!

* **TRẢ LỜI:** **ĐƯỢC, NHƯNG SỐ DÂY NỐI PHỤ THUỘC VÀO SỐ LƯỢNG VLAN, KHÔNG PHỤ THUỘC VÀO SỐ LƯỢNG LAPTOP!**

#### Tình huống A: Trên SW1 có 100 Laptop nhưng TẤT CẢ ĐỀU LÀ VLAN 10
* Bạn **CHỈ CẦN ĐÚNG 1 SỢI DÂY ACCESS (VLAN 10)** nối SW1 sang SW2!
* Vì cả 100 laptop đều chung 1 nhóm, sợi dây Access VLAN 10 này đóng vai trò như chiếc cầu riêng cho nhóm VLAN 10 đi qua. Cả 100 máy tính dùng chung chiếc cầu này bình thường.

#### Tình huống B: Trên SW1 có NHIỀU NHÓM (VLAN 10 - Kế toán, VLAN 20 - Kỹ thuật, VLAN 30 - Giám đốc)
* Nếu bạn **cố tình không dùng Trunk mà dùng Access**:
  * Bạn bắt buộc phải cắm **3 sợi dây cáp riêng biệt** nối giữa SW1 và SW2:
    * Dây 1: Cấu hình Access VLAN 10 (chỉ Kế toán đi).
    * Dây 2: Cấu hình Access VLAN 20 (chỉ Kỹ thuật đi).
    * Dây 3: Cấu hình Access VLAN 30 (chỉ Giám đốc đi).

```text
       ┌─────────── (Dây 1: Access VLAN 10) ───────────┐
       │                                               ▼
┌──────┴───────┐                               ┌───────────────┐
│   SWITCH 1   ├─────────── (Dây 2: Access VLAN 20) ───────────┤   SWITCH 2    │
└──────┬───────┘                               └───────▲───────┘
       │                                               │
       └─────────── (Dây 3: Access VLAN 30) ───────────┘
```

> ⚠️ **Hậu quả:** Nếu công ty có 10 VLAN, bạn sẽ mất **10 sợi dây mạng** và tốn toi **10 cổng mỗi bên switch** chỉ để nối 2 switch với nhau!
> 👉 **Đó là lý do cổng TRUNK ra đời:** Chỉ cần cắm **1 sợi dây duy nhất**, cấu hình 2 đầu là TRUNK là nó gánh được tất cả các VLAN.

---

## 🏷️ 5. GỌI TÊN ĐƯỜNG DÂY ĐÚNG CHUẨN KỸ THUẬT

Khi đi làm, anh em kỹ thuật gọi tên các sợi dây này theo 2 góc nhìn:

| Vị trí nối | Tên theo Chức năng Kỹ thuật | Tên theo Dây vật lý ngoài đời |
| :--- | :--- | :--- |
| **Từ Laptop ➜ Switch** | **Đường Access** *(Access Link)* | Cáp thẳng *(Straight-Through)* hoặc Dây nhảy mạng *(Patch cord RJ45)* |
| **Từ SW1 ➜ SW2** | **Đường Trunk** *(Trunk Link)* hoặc **Đường Uplink** | Cáp chéo *(Crossover)*, Cáp thẳng *(Auto-MDIX)* hoặc Dây nhảy quang *(Fiber Patch cord SFP)* |

* **Mẹo thực tế:** Ngày nay các dòng switch hiện đại đều có tính năng tự đảo chân tín hiệu (**Auto-MDIX**), nên khi nối Switch sang Switch bạn cắm cáp thẳng hay cáp chéo thiết bị đều tự nhận.

---

## ⚡ 6. QUY TẮC NẰM LÒNG 3 GIÂY ĐỂ ĐI LÀM KHÔNG BAO GIỜ NHẦM

Mỗi khi chuẩn bị cấu hình một cổng mạng, bạn chỉ cần tự hỏi đúng 1 câu:

> **"Cổng này đang cắm vào thiết bị đầu cuối chỉ dùng 1 mạng, hay cắm vào thiết bị mạng cần gom nhiều đường?"**

* Cắm vào **Laptop, PC, Camera, Máy in, Trạm 3G chỉ chạy 1 dải IP** ➜ **CẤU HÌNH ACCESS**.
* Cắm vào **Switch khác, Router truyền dẫn VNPT/Viettel, BBU 4G/5G, Server ảo hóa** ➜ **CẤU HÌNH TRUNK**.
