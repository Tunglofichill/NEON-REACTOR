# SPECIFICATION REQUIREMENT (GDD)
**GAME SPRINT 2026 - GIAI ĐOẠN 1: GDD SUBMISSION**

---

### 1. Project Overview
- **Game Title:** NEON REACTOR: QUANTUM OVERDRIVE *(Lõi Lượng Tử Siêu Dẫn)*
- **Genre:** Idle Game / Incremental Game
- **Engine/Platform:** Web HTML5 (React 19 + Vite + Canvas Particle Engine + Web Audio API). Chơi trực tiếp trên mọi trình duyệt PC và Mobile qua link Web 1-click, không cần cài đặt.
- **Elevator Pitch:** Trong vai kỹ sư điều hành trạm nghiên cứu không gian, người chơi kích thích một Lõi Năng Lượng Lượng Tử bí ẩn để khai thác hạt Joules. Bằng việc kết hợp giữa căn nhịp kích nổ vi mô, quản trị tản nhiệt ni-tơ và bầy drone tự động, người chơi sẽ đưa Lõi tiến hóa qua 5 trạng thái vật lý để kích hoạt Cổng Siêu Không Gian hoàn thành trò chơi trong 15-20 phút.
- **Unique Selling Proposition (USP):** Cơ chế độc quyền tuân thủ luật Anti-clone: **"Resonance Timing & Thermal Management" (Nhịp Điệu Đồng Điệu & Quản Trị Quá Nhiệt)**.
  - *Resonance Pulse:* Lõi phát quang theo nhịp đập tần số; click đúng nhịp sẽ kích hoạt Critical Hit nhân $\times 3 \to \times 5$ sản lượng, tạo trải nghiệm tương tác nhịp điệu cuốn hút thay vì spam chuột vô thức.
  - *Thermal Venting (Overdrive):* Thao tác click liên tục sinh nhiệt độ (Heat). Khi chạm 100%, người chơi kích hoạt nút Xả Ni-tơ lỏng (Cryo Vent) để đưa Lõi vào trạng thái Siêu Dẫn (Superconductor Overdrive) — nhân $\times 3$ tốc độ tự động sản xuất trong 10 giây.

---

### 2. Core Gameplay & Mechanics
- **Core Loop:** Mô tả chi tiết luồng vận hành khép kín 4 bước:
  - *Auto (Tự động hóa):* Hệ thống **Subatomic Drones** và từ trường tự động trích xuất năng lượng theo từng chu kỳ tick $100\text{ms}$ ($10\text{ ticks/giây}$), đảm bảo sản lượng liên tục tăng trưởng ngay cả khi người chơi không bấm chuột.
  - *Earn (Tạo tài nguyên):* 
    - **Joules ($J$):** Tiền tệ chính, sinh ra từ Click thủ công và Drone tự động, dùng để mua mọi nâng cấp.
    - **Heat ($^\circ C$):** Tài nguyên phụ, tích tụ từ thao tác Click và giải phóng qua cơ chế Xả tản nhiệt Overdrive.
  - *Upgrade (Nâng cấp):* Người chơi tiêu hao Joules vào 4 nhánh nâng cấp cốt lõi để gia tăng sản lượng Click (JPC), tốc độ sinh tự động (JPS), dung sai nhiệt và tỉ lệ nhịp Crit.
  - *Progress (Tiến trình):* Mục tiêu tối hậu là nâng cấp tích lũy Joules để tiến hóa Lõi qua 5 cột mốc:
    1. *Plasma Core* ($0 \to 1,000\text{ J}$): Mở khóa Drone tự động.
    2. *Fusion Core* ($1K \to 50K\text{ J}$): Mở khóa Tản nhiệt & Overdrive x3.
    3. *Antimatter Core* ($50K \to 2M\text{ J}$): Mở khóa Bộ ổn định sóng hài (Crit x5).
    4. *Dark Matter Core* ($2M \to 100M\text{ J}$): Tăng tốc hàm mũ.
    5. *Singularity Black Hole* ($100M\text{ J}$): **Victory End-Game Screen** kèm bảng thành tích Speedrun Timer.

- **Game Layout:** Sơ đồ bố cục UI trên 1 màn hình (Single-screen wireframe) chuẩn quy định:

```
+-----------------------------------------------------------------------------------------------+
|  ⚡ TOTAL JOULES: 1,450,200 J  |  📈 PROD: +14,250 J/s  |  🏆 PHASE: 3/5 (ANTIMATTER CORE)    |
|  TIẾN TRÌNH LÕI: [=========================================>..........] 68% Đến Cột Mốc Tiếp   |
+-----------------------------------------------------------------------------------------------+
|                                              |                                                |
|            [KHU VỰC TƯƠNG TÁC LÕI]           |               [BẢNG ĐIỀU KHIỂN NÂNG CẤP]        |
|                                              |                                                |
|                    /```\                     |  [1] PLASMA DIODES (Lv 18)       [BUY: 2.45K J]|
|                   | (●) |                    |      +25 Joules mỗi cú click.                  |
|                    \___/                     |                                                |
|             << RESONANCE PULSE >>            |  [2] CRYO JETS (Lv 9)            [BUY: 12.8K J]|
|             (Bấm đúng nhịp: CRIT x3)          |      Tản nhiệt +20%/s & mở Overdrive x3.       |
|                                              |                                                |
|  [BẤM ĐỂ KÍCH NỔ NĂNG LƯỢNG]                 |  [3] SUBATOMIC DRONES (Lv 35)    [BUY: 85.0K J]|
|                                              |      Tự động sản sinh +1,200 J/s.              |
|  THANH NHIỆT ĐỘ (HEAT GAUGE):                |                                                |
|  [████████████████████░░░░░░░░] 65%          |  [4] HARMONIC STABILIZER (Lv 6)  [BUY: 350K J] |
|  [⚡ KÍCH HOẠT XẢ TẢN NHIỆT (OVERDRIVE x3)]  |      Tăng tỉ lệ xuất hiện nhịp Crit +15%.      |
+-----------------------------------------------------------------------------------------------+
|  STATUS TICKER: "Hệ thống Siêu Dẫn sẵn sàng kích hoạt! Bấm Cryo Vent để nhân x3 sản lượng!"    |
+-----------------------------------------------------------------------------------------------+
```

---

### 3. Economy & Upgrade Systems
- **Tài nguyên (Resources):**
  - **Joules ($J$):** Đơn vị tiền tệ chính, định dạng hiển thị thông minh ($1.25\text{K}, 45.8\text{M}, 2.1\text{B}...$).
  - **Joules Per Click (JPC):** Năng lượng thu hoạch thủ công mỗi click.
  - **Joules Per Second (JPS):** Năng lượng tự động tích lũy mỗi giây từ Drone.
  - **Heat ($0 \to 100\%$):** Mức nhiệt độ của Lõi.

- **Hệ thống Upgrades (4 hệ thống cốt lõi):**
  *Áp dụng công thức tăng trưởng chuẩn của thể loại Idle:* $\text{Cost}(L) = \text{BaseCost} \times (\text{Multiplier})^L$

  - **Upgrade 1: Plasma Laser Diodes**
    - *Chức năng:* Tăng năng lượng thu được từ mỗi cú click chuột ($+1\text{ JPC}$ mỗi cấp, kèm buff ẩn $+5\%$ tổng JPC mỗi khi đạt mốc 10 cấp).
    - *Công thức giá / Base cost:* $\text{BaseCost} = 15\text{ J}$, $\text{Multiplier} = 1.15 \implies \text{Cost}(L) = 15 \times (1.15)^L$.
  - **Upgrade 2: Cryo-Cooling Jets**
    - *Chức năng:* Tăng tốc độ tản nhiệt $+10\%/\text{giây}$, tăng thời lượng trạng thái Superconductor Overdrive thêm $+0.5\text{s}$ (giúp duy trì buff nhân 3 sản lượng).
    - *Công thức giá / Base cost:* $\text{BaseCost} = 120\text{ J}$, $\text{Multiplier} = 1.18 \implies \text{Cost}(L) = 120 \times (1.18)^L$.
  - **Upgrade 3: Subatomic Drones**
    - *Chức năng:* Tự động trích xuất năng lượng từ trường ($+15\text{ JPS}$ mỗi cấp), là động cơ tích lũy nhàn rỗi chính của game.
    - *Công thức giá / Base cost:* $\text{BaseCost} = 300\text{ J}$, $\text{Multiplier} = 1.16 \implies \text{Cost}(L) = 300 \times (1.16)^L$.
  - **Upgrade 4: Harmonic Stabilizer**
    - *Chức năng:* Ổn định sóng dao động của Lõi, tăng $+3\%$ xác suất xuất hiện nhịp Resonance Pulse (Tối đa $40\%$) và nâng sát thương Crit từ $\times 3$ lên $\times 5$.
    - *Công thức giá / Base cost:* $\text{BaseCost} = 3,500\text{ J}$, $\text{Multiplier} = 1.22 \implies \text{Cost}(L) = 3500 \times (1.22)^L$.

---

### 4. Game Feel & Feedback
- **Visual Feedback:**
  - *Hiệu ứng hạt (Canvas Particles):* Mỗi cú click bắn ra chùm tia plasma phát sáng neon (xanh cyan / tím / vàng), bay theo quỹ đạo vật lý và được hút về thanh năng lượng trên header.
  - *Animation đàn hồi (Squash & Stretch):* Lõi co giãn nảy theo nhịp click chuột; hiệu ứng hào quang (Glow Bloom) phập phồng theo tần số dao động.
  - *Pop-up Dynamic Text:* Số tiền nhảy tung tóe nổi trên con trỏ chuột (`+25`, `CRITICAL x3!`, `OVERDRIVE x3!`) với font chữ Cyberpunk và màu sắc phân cấp.
  - *Screen Shake:* Rung lắc màn hình nhẹ 2-3px khi click thường, rung giật mạnh khi kích hoạt Overdrive xả ni-tơ.
- **Audio Feedback:**
  - *Nhạc nền (BGM):* 1 Track Synthwave Lo-Fi tuần hoàn tiết tấu 110 BPM tạo sự tập trung và hưng phấn.
  - *Hiệu ứng âm thanh (SFX - Web Audio Synthesizer):*
    - Click: Âm thanh laser blip tần số quét tăng dần khi click liên hồi.
    - Resonance Hit: Tiếng chuông lượng tử trong trẻo ngân vang.
    - Cryo Vent Overdrive: Tiếng xả áp suất khí lạnh nén rít mạnh "Whooosh...!" sảng khoái.
    - Upgrade Buy: Tiếng cơ khí kim loại ăn khớp chắc nịch xác nhận giao dịch thành công.

---

### 5. AI Implementation Log
*(Ghi nhận chi tiết cách ứng dụng AI trong việc nghiên cứu, viết tài liệu GDD Giai đoạn 1 và quy trình sản xuất Giai đoạn tiếp theo)*

> **Tuyên bố Bộ công cụ AI của Dự án:** Nhóm cam kết tối giản quy trình và tối ưu hiệu suất tuyệt đối bằng việc **chỉ sử dụng duy nhất 2 công nghệ AI chuyên sâu**:
> 1. **Google Antigravity:** Đảm nhiệm toàn diện vai trò Trợ lý Thiết kế Game (GDD Co-Designer), Kiến trúc sư Hệ thống & Lập trình viên Lõi (AI Code & Systems Architecture), và Thiết kế Đồ họa Thủ tục Động (Procedural Canvas/SVG Art & Shaders).
> 2. **Suno AI:** Đảm nhiệm sản xuất Âm nhạc (BGM) và mảng Âm thanh Synthwave không gian.

---

#### 5.1. Báo cáo phương pháp luận ứng dụng Google Antigravity để xây dựng GDD (Giai đoạn 1)
Trong Giai đoạn 1, nhóm đã hợp tác cùng **Google Antigravity** để thiết lập quy trình **Human-AI Co-Design Pipeline (Đồng thiết kế Người - AI)** có phương pháp luận chặt chẽ:

1. **Ứng dụng Antigravity phân tích lỗ hổng & Tạo cơ chế Anti-Clone:**
   - *Mục tiêu:* Khắc phục nhược điểm "click spam vô vị" của 90% game Idle truyền thống, đáp ứng tiêu chuẩn nghiêm ngặt về Anti-Clone của Game Sprint 2026.
   - *Cách thực hiện:* Đóng vai Antigravity thành *Lead Game Systems Designer*, mổ xẻ cơ chế Idle truyền thống và phát triển cơ chế kết hợp nhịp xung tần số (Resonance Timing) và cơ chế rủi ro - phần thưởng qua tản nhiệt (Thermal Venting Overdrive).
   - *Prompt mẫu trên Antigravity:*
     > `"Đóng vai Lead Game Systems Designer. Hãy phân tích các điểm yếu gây nhàm chán của dòng game Idle Clicker truyền thống. Hãy đề xuất 1 cơ chế tương tác thời gian thực (Micro-mechanic) kết hợp yếu tố Risk & Reward trên 1 màn hình duy nhất (Single-screen), vừa giữ được tính chất nhàn rỗi (Idle), vừa có kỹ năng tương tác phản xạ để đáp ứng luật Anti-Clone của Game Sprint 2026."`
2. **Ứng dụng Antigravity mô phỏng toán học kinh tế & Cân bằng nhịp độ chơi (Pacing 15-20 phút):**
   - *Mục tiêu:* Thiết lập bộ 4 thông số [BaseCost, Multiplier, Effect] hoàn chỉnh, đảm bảo trải nghiệm chơi cuốn hút, không bị lạm phát và về đích đúng 15 - 20 phút cho giám khảo chấm thi.
   - *Cách thực hiện:* Antigravity trực tiếp tính toán mô phỏng hàm số mũ và kiểm tra pacing theo thời gian thực.
   - *Prompt mẫu trên Antigravity:*
     > `"Hãy phân tích và cân bằng toán học kinh tế cho 1 Idle Game 4 hệ thống nâng cấp. Giả lập người chơi click 4 lần/giây trong 2 phút đầu và phụ thuộc vào Auto 80% thời gian sau. Hãy cân bằng 4 bộ chỉ số sao cho mốc tiến trình 100,000,000 Joules (Singularity Core) đạt được đúng trong khoảng thời gian từ 15 đến 20 phút."`
3. **Ứng dụng Antigravity chuẩn hóa Wireframe Single-Screen theo tỷ lệ thị giác:**
   - *Mục tiêu:* Thiết kế bố cục UI 1 màn hình chuẩn xác theo nguyên lý F-pattern và quy tắc tỷ lệ vàng 40% (Khu vực tương tác Lõi Lượng Tử) - 60% (Khu vực Nâng cấp & Quản trị trạng thái).

---

#### 5.2. Nhật ký công cụ và Prompt AI cho quy trình sản xuất (Development Pipeline)
Tuân thủ nguyên tắc tinh gọn, toàn bộ pipeline sản xuất được vận hành bởi bộ đôi **Google Antigravity & Suno AI**:

- **AI Art & Visual Effects (Google Antigravity):**
  - *Phương pháp thực hiện:* Thay vì dùng các AI tạo ảnh raster nặng nề (Midjourney/SD) làm phình to dung lượng build và gây giật lag khi tải web, nhóm sử dụng **Google Antigravity** để sinh mã nguồn **Procedural Vector Art (SVG) & Canvas Particle Shaders** trực tiếp trong code. Lõi Plasma phát sáng neon và 5 cấp hình thái tiến hóa được vẽ bằng toán học hình học và CSS Glow Filters.
  - *Ưu điểm vượt trội:* Dung lượng toàn bộ game siêu nhẹ (< 1MB), thời gian tải 0.5 giây, tương thích mọi độ phân giải màn hình mà không bị vỡ nét, duy trì 60 FPS mượt mà.
  - *Prompt mẫu trên Antigravity:*
    > `"Hãy sinh mã nguồn Canvas 2D render một Lõi Năng Lượng Lượng Tử Sci-Fi phát sáng dạng Neon Plasma hình cầu với 3 vòng từ trường quay đa trục đối xứng. Tích hợp hiệu ứng hạt plasma phát quang bắn ra khi click và co bóp đàn hồi theo nhịp đập 110 BPM."`

- **AI Code & Engine Architecture (Google Antigravity):**
  - *Phương pháp thực hiện:* Antigravity đảm nhiệm 100% kiến trúc phần mềm: Game Loop chính xác bằng `requestAnimationFrame` kết hợp Delta-Time chống hack thời gian, bộ tổng hợp âm thanh Web Audio API độc lập, hệ thống State Management và thuật toán định dạng số lớn.
  - *Prompt mẫu trên Antigravity:*
    > `"Viết một custom hook useIdleEngine bằng TypeScript: quản lý Game Loop bằng requestAnimationFrame với Delta-Time, tích hợp công thức tăng trưởng chi phí hàm mũ cho 4 hệ thống nâng cấp, cơ chế Heat Meter tự tăng khi click và tự tản nhiệt theo thời gian, hỗ trợ lưu trạng thái vào localStorage."`

- **AI Audio (Suno AI):**
  - *Phương pháp thực hiện:* Sử dụng Suno AI để tạo track nhạc nền Cyberpunk Synthwave không lời có tiết tấu 110 BPM, hòa hợp hoàn hảo với nhịp đập thị giác của Lõi Plasma và mang lại cảm giác tập trung cao độ.
  - *Prompt mẫu trên Suno AI:*
    > `"Futuristic cyberpunk idle game BGM, upbeat hypnotic synthesizer arpeggio, deep sub-bass pulse, 110 BPM, lo-fi sci-fi laboratory atmosphere, seamless loop, instrumental only."`
