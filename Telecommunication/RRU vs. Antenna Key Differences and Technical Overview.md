# So sánh RRU (Remote Radio Unit) và Anten (Antenna) trong Hạ tầng Viễn thông

Trong kiến trúc trạm phát sóng viễn thông (**BTS / eNodeB / gNodeB**), **RRU** và **Anten** đều thuộc phân hệ xử lý và truyền tải tín hiệu vô tuyến (**RF - Radio Frequency**). Tuy nhiên, mỗi thiết bị đảm nhận vai trò, chức năng và cơ chế hoạt động hoàn toàn khác nhau.

---

## 1. Bảng so sánh tổng quan

| Tiêu chí | RRU (Remote Radio Unit) | Anten (Antenna) |
| :--- | :--- | :--- |
| **Bản chất** | Thiết bị điện tử **chủ động** (*Active Device*), yêu cầu nguồn điện nuôi trực tiếp (thường là nguồn DC -48V). | Thiết bị **thụ động** (*Passive Device*)\*, hoạt động dựa trên nguyên lý bức xạ điện từ. |
| **Chức năng chính** | Biến đổi tín hiệu số (Digital) thành tín hiệu cao tần (RF), khuếch đại công suất và xử lý nhiễu. | Bức xạ tín hiệu RF thành sóng điện từ lan truyền trong không gian (và ngược lại). |
| **Tín hiệu Đầu vào / Đầu ra** | **Đầu vào:** Cáp quang (tín hiệu số CPRI/eCPRI) + Nguồn DC.<br>**Đầu ra:** Cáp đồng trục RF (tín hiệu tương tự cao tần). | **Đầu vào:** Cáp đồng trục RF.<br>**Đầu ra:** Sóng điện từ truyền qua môi trường không khí. |
| **Cấu tạo chính** | • Bộ biến đổi DAC / ADC<br>• Mạch khuếch đại công suất (PA)<br>• Mạch khuếch đại tạp âm thấp (LNA)<br>• Bộ lọc tần số RF & Duplexer | • Các chấn tử bức xạ (*Radiating elements*)<br>• Bộ phản xạ (*Reflector*)<br>• Mạch phân phối công suất & lệch pha (*Phase shifter*) |
| **Vị trí lắp đặt** | Gắn trên cột/tháp ngay phía sau hoặc gần Anten nhằm tối ưu chiều dài cáp dẫn RF. | Lắp tại vị trí cao nhất của cột tháp để đảm bảo hướng phát và diện tích phủ sóng tối ưu. |

> [!NOTE]
> **Lưu ý về Anten có RET (Remote Electrical Tilt):**
> Anten truyền thống là thiết bị thụ động hoàn toàn. Tuy nhiên, các dòng anten hiện đại có thể tích hợp thêm bộ điều khiển góc nghiêng điện tử từ xa (**RET - Remote Electrical Tilt**). Bộ phận RET này sẽ cần cấp nguồn/điện áp tín hiệu điều khiển (chuẩn AISG), nhưng bản thân bộ chấn tử bức xạ RF vẫn hoạt động theo nguyên lý cảm ứng thụ động.

---

## 2. Phân tích chi tiết chức năng và cơ chế hoạt động

### 2.1. RRU (Remote Radio Unit - Khối thu phát vô tuyến từ xa)
RRU đóng vai trò là "trung tâm xử lý tín hiệu vô tuyến" tại trạm phát sóng:

1. **Chiều phát (Downlink - Chiều từ Mạng tới Thiết bị di động):**
   * Nhận dữ liệu chuỗi số (I/Q Data) từ khối xử lý băng gốc (**BBU - Baseband Unit**) qua cáp quang tốc độ cao (giao thức **CPRI** trên 3G/4G hoặc **eCPRI** trên 5G).
   * Thực hiện chuyển đổi số sang tương tự (**DAC - Digital-to-Analog Converter**).
   * Nâng tần số tín hiệu lên dải sóng cao tần RF (Up-conversion qua mạch Mixer).
   * Khuếch đại công suất phát (**PA - Power Amplifier**) lên mức công suất mong muốn (vài chục đến hàng trăm Watts).
   * Lọc sóng hài qua bộ lọc RF (Band-pass Filter) trước khi đẩy tín hiệu ra cổng RF dẫn đến Anten.

2. **Chiều thu (Uplink - Chiều từ Thiết bị di động tới Mạng):**
   * Nhận tín hiệu RF cực yếu được Anten thu thập từ môi trường không gian.
   * Đưa tín hiệu qua bộ lọc tần số và khuếch đại bằng mạch khuếch đại tạp âm cực thấp (**LNA - Low Noise Amplifier**) nhằm tăng cường độ tín hiệu mà không làm tăng nhiễu nền.
   * Hạ tần số tín hiệu xuống dải tần trung tần/băng gốc (Down-conversion).
   * Biến đổi từ tương tự sang số (**ADC - Analog-to-Digital Converter**).
   * Đóng gói luồng dữ liệu số I/Q và truyền ngược về BBU qua cáp quang để xử lý giải mã kênh và giao thức mạng.

### Sơ đồ luồng tín hiệu (Signal Flow Diagram)
```text
[CHIỀU PHÁT - DOWNLINK]
BBU (Baseband)  ──(Cáp quang CPRI/eCPRI)──>  RRU [DAC ──> Trộn tần RF ──> Khuếch đại PA ──> Bộ lọc]
                                                                                               │
                                                                                    (Cáp Jumper RF)
                                                                                               ▼
UE (Điện thoại) <═══════(Sóng điện từ không gian)═══════ Anten [Chấn tử bức xạ & Định hình búp sóng]

[CHIỀU THU - UPLINK]
UE (Điện thoại) ═══════(Sóng điện từ cực yếu)═══════>  Anten [Chấn tử bức xạ thu nhận tín hiệu]
                                                                                               │
                                                                                    (Cáp Jumper RF)
                                                                                               ▼
BBU (Baseband)  <──(Cáp quang CPRI/eCPRI)──  RRU [ADC <── Hạ tần <── Bộ lọc <── Khuếch đại LNA]
```

---

### 2.2. Anten (Antenna)
Anten đóng vai trò là "cầu nối không gian" giao tiếp giữa thiết bị hữu tuyến và môi trường vô tuyến tự do:

1. **Chuyển đổi năng lượng lưỡng chiều:**
   * **Phát:** Chuyển đổi dòng điện cao tần xoay chiều chạy trong cáp RF thành sóng điện từ biến thiên lan truyền trong môi trường không gian.
   * **Thu:** Cảm ứng sóng điện từ trong không gian thành dòng điện dao động siêu nhỏ trong dây dẫn RF để đưa vào RRU.

2. **Tập trung và định hình năng lượng (Beam Shaping):**
   * Anten **không tự sinh ra năng lượng** và **không có chức năng khuếch đại tín hiệu điện**.
   * Chức năng tối quan trọng của nó là gom năng lượng phát xạ tập trung vào khu vực cần phủ sóng thay vì phát tán lãng phí ra mọi hướng.
   * **Độ lợi Anten (Gain - dBi):** Đại lượng đo mức độ tập trung năng lượng theo một hướng xác định so với một anten đẳng hướng lý thuyết.
   * **Góc phủ ngang (Azimuth Beamwidth):** Thường từ $65^\circ$ đối với trạm 3 sector.
   * **Góc ngẩng/nghiêng dọc (Elevation Tilt):** Điều chỉnh cơ học (Mechanical Tilt) hoặc điện tử (Electrical Tilt) để giới hạn vùng phủ, tránh gây can nhiễu sang các trạm lân cận (Inter-cell Interference).

---

## 3. Mối quan hệ và Xu hướng phát triển công nghệ (2G/3G/4G vs 5G)

* **Trạm 2G / 3G / 4G (Kiến trúc phân tán - Distributed BTS):**
  * RRU và Anten là hai khối phần cứng **tách rời**.
  * Kết nối giữa RRU và Anten sử dụng các đoạn cáp đồng trục ngắn (Cáp Jumper RF 1/2").
  * Nhược điểm: Cáp Jumper gây suy hao tín hiệu RF (0.5 ~ 2 dB), tiềm ẩn nguy cơ thấm nước, gỉ sét đầu nối và giới hạn số lượng cổng thu phát (2T2R, 4T4R, 8T8R).

* **Trạm 5G (Kiến trúc tích hợp - AAU - Active Antenna Unit):**
  * Với sự xuất hiện của công nghệ **Massive MIMO** (sử dụng 32T32R, 64T64R với hàng chục đến hàng trăm chấn tử thu/phát đồng thời), việc kết nối cáp rời trở nên bất khả thi và gây suy hao nghiêm trọng.
  * RRU và Anten được **tích hợp hoàn toàn thành một khối duy nhất** gọi là **AAU (Active Antenna Unit)**.

> [!TIP]
> **Vì sao AAU là bước tiến tất yếu cho mạng 5G Massive MIMO?**
> 1. **Triệt tiêu hoàn toàn suy hao cáp:** Không còn cáp Jumper đồng trục, tín hiệu RF truyền trực tiếp từ vi mạch khuếch đại PA đến từng chấn tử trên bo mạch, loại bỏ hoàn toàn suy hao $1 \sim 2\text{ dB}$ quý giá ở tần số cao (3.5 GHz, 4.8 GHz).
> 2. **Hỗ trợ định hình chùm tia động 3D (3D Beamforming):** Từng chấn tử được điều khiển biên độ và pha độc lập, cho phép búp sóng tự động hướng trực tiếp đến từng người dùng di động theo thời gian thực thay vì phát tràn lan cả sector.
> 3. **Tối ưu hóa không gian và tải trọng cột:** Thay vì phải treo 3 khối RRU cồng kềnh cộng thêm 3 anten to bản với hàng chục sợi cáp chằng chịt, trạm phát sóng chỉ cần treo các khối AAU gọn gàng, giảm lực cản gió và tải trọng cột tháp.

> [!IMPORTANT]
> **Tóm lược ghi nhớ nhanh:**
> * **RRU** = *"Bộ não xử lý và cơ bắp khuếch đại tín hiệu"* (Có mạch điện, biến đổi Digital $\leftrightarrow$ RF, cần nguồn điện).
> * **Anten** = *"Cánh tay phóng và thu nhận sóng"* (Thụ động, biến dòng điện RF $\leftrightarrow$ Sóng điện từ lan truyền trong không khí).
> * **AAU (5G)** = **RRU + Anten** gộp chung vào 1 thiết bị duy nhất phục vụ Massive MIMO và Beamforming.