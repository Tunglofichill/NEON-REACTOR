# ⚡ NEON REACTOR: QUANTUM OVERDRIVE

> **Dự án dự thi:** Game Sprint 2026  
> **Tên đội thi (Team Name):** **Seki and Kiva**  
> **Studio trực thuộc:** [Pawfolio Studio](https://pawfoliostudio.vercel.app/) ✨

---

## 👥 THÀNH VIÊN ĐỘI THI (TEAM MEMBERS)

- **Seki (Nhật Tùng - PH58350) — Lead Developer & Game Designer:** Chủ nhiệm dự án, thiết kế kiến trúc game loop, balance kinh tế năng lượng Joules và gameplay mechanics.
- **Kiva — AI Co-Pilot & Technical Assistant:** Trợ lý AI đồng hành, tối ưu hóa thuật toán render Canvas 60 FPS, âm thanh Procedural Web Audio API và hỗ trợ kỹ thuật trực tiếp.

---

## 🌌 1. GIỚI THIỆU TỔNG QUAN (OVERVIEW)

**NEON REACTOR: QUANTUM OVERDRIVE** là một tựa game Web Sci-Fi Idle / Incremental Clicker tốc độ cao đạt chuẩn 60 FPS, lấy bối cảnh tại Trạm Nghiên Cứu Lượng Tử Vũ Trụ. 

Người chơi vào vai Chỉ Huy Trạm (Commander), tương tác trực tiếp với Lõi Phản Ứng Lượng Tử đa tầng để khai thác năng lượng **Joules (J)**, canh nhịp sóng hài âm nhạc, quản lý nhiệt lượng và kích hoạt trạng thái Siêu Dẫn nhằm tiến hóa qua 5 cấp bậc vũ trụ, hướng tới mục tiêu tối thượng: **Thức Tỉnh Lỗ Đen Lượng Tử (Singularity Black Hole)**.

---

## 🎮 2. CƠ CHẾ GAMEPLAY CỐT LÕI (CORE MECHANICS)

1. **Kích Nổ Thủ Công & Sóng Hài (Resonance Rhythm - 110 BPM):**
   - Click chuột trực tiếp lên quả cầu Lõi để thu hoạch năng lượng.
   - Khi nhấp đúng nhịp dao động sóng hài (Resonance Pulse), người chơi kích hoạt **Crit x3 - x5** và tích lũy **Combo Streak** (thưởng thêm tới $+160\%$ sản lượng).
2. **Hệ Thống Nhiệt Lượng & Overdrive x3 (Cryo-Vent):**
   - Mỗi cú click sinh nhiệt. Khi nhiệt độ đạt $\ge 85\%$, hệ thống cho phép kích hoạt **Cryo-Vent Xả Tản Nhiệt Khẩn Cấp** để bước vào trạng thái **Siêu Dẫn Overdrive x3** trong 10 giây.
3. **Cơ Chế Phát Nổ Meltdown & Phong Tỏa Nợ (Hardcore Debt Mode):**
   - Nếu người chơi cố tình spam click đẩy nhiệt độ chạm ngưỡng $100\%$, Lõi sẽ phát nổ Meltdown!
   - **Hậu quả:** Bị trừ sạch tiền ví, phạt nợ âm Joules, phong tỏa toàn bộ bảng nâng cấp và **tụt cấp Lõi về lại Phase 1 (Plasma Core)**! Người chơi phải cày click hoặc chờ Drone thu hoạch để trả hết nợ mới được mở khóa lại hệ thống.
4. **4 Hệ Thống Nâng Cấp Công Nghệ (Upgrade Console):**
   - **Plasma Laser Diodes:** Tăng Joules/click thủ công.
   - **Cryo-Cooling Jets:** Tăng tốc độ tản nhiệt tự nhiên & kéo dài thời gian Overdrive.
   - **Subatomic Drones:** Triệu hồi hạm đội Drone tự động sản xuất Joules mỗi giây (JPS).
   - **Harmonic Stabilizer:** Tăng tỷ lệ xuất hiện nhịp sóng hài và nâng Crit lên x5.
5. **5 Giai Đoạn Tiến Hóa Lõi (Evolution Phases):**
   - **Cấp 1:** Plasma Core (Cyan Neon)
   - **Cấp 2:** Fusion Core (Amber Solar)
   - **Cấp 3:** Antimatter Core (Violet Singularity)
   - **Cấp 4:** Dark Matter Core (Crimson Plasma)
   - **Cấp 5:** Singularity Black Hole (Cosmic Awakening - Phá Đảo)
6. **Dị Thường Lượng Tử (Quantum Anomalies - Cơ Chế Tương Tác Bất Ngờ):**
   - Cứ mỗi 16 - 25 giây, trong buồng phản ứng xuất hiện ngẫu nhiên **1 Quả Cầu Năng Lượng Bay Lơ Lửng** với 3 loại hiệu ứng cực mạnh:
     - 🌟 **Kho Báu Lượng Tử (Surge):** Nhận ngay một lượng Joules khổng lồ tức thì!
     - ❄️ **Đóng Băng Tuyệt Đối (Deep Freeze):** Khóa nhiệt độ về $0\%$ trong 8.5 giây $\to$ spam click tẹt ga không bao giờ nổ Lõi!
     - ⚡ **Cuồng Nộ Lượng Tử (Frenzy x5):** Tăng gấp $\times 5$ toàn bộ sản lượng Joules từ Click và Drone trong 10 giây!
7. **KIVA-OS v2.6 AI Co-Pilot:**
   - Trợ lý AI đồng hành thoại theo ngữ cảnh thực tế (vừa nổ, nợ xấu, sắp nổ, thăng cấp, dị thường bay qua, kích hoạt siêu dẫn).

---

## 🛠️ 3. CÔNG NGHỆ & KIẾN TRÚC (TECH STACK)

- **Frontend Core:** React 18 + TypeScript + Vite
- **Styling & HUD:** Tailwind CSS + Custom Sci-Fi Cyberpunk Theme
- **Đồ Họa & Visuals:**
  - Canvas 2D Render Pipeline cho hệ thống hạt 60 FPS (Ambient dust, pulse waves, drone lasers, shockwaves, floating text).
  - SVG Concentric Gyroscope Rings (2 vòng con quay hồi chuyển vector đồng tâm tuyệt đối).
- **Âm Thanh (Procedural Web Audio API):**
  - Tự tổng hợp sóng Synthwave 110 BPM và âm thanh SFX thời gian thực, **100% không dùng file MP3 bên ngoài** (không lo lỗi mạng, CORS hay chậm tải).
- **Lưu Trữ:** LocalStorage Auto-Save delta-state định kỳ mỗi 3 giây.

---

## 🚀 4. HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN (GETTING STARTED)

```bash
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Khởi chạy máy chủ phát triển (Development)
npm run dev

# 3. Build mã nguồn sản xuất (Production Build)
npm run build

# 4. Xem trước bản build production
npm run preview
```

---

## 🌐 5. TRIỂN KHAI VERCEL (DEPLOY TO VERCEL)

Dự án được tối ưu hóa 100% sẵn sàng deploy chỉ với 1 click trên [Vercel](https://vercel.com):
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

---

## ✨ 6. ĐỘI THI & BẢN QUYỀN (CREDITS)

- **Tên đội thi:** **Seki and Kiva**
- **Thành viên:** **Seki (Nhật Tùng - PH58350)** & **Kiva (AI Co-Pilot)**
- **Studio trực thuộc:** [Pawfolio Studio](https://pawfoliostudio.vercel.app/) ✨  
- **Bản quyền:** © 2026 Seki & Kiva (Pawfolio Studio). All rights reserved.
