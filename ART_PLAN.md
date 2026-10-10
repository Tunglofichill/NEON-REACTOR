# KẾ HOẠCH QUY HOẠCH & DANH MỤC TẤT CẢ ART ASSETS ĐƯỢC GEN BẰNG AI
**DỰ ÁN: NEON REACTOR: QUANTUM OVERDRIVE (GAME SPRINT 2026)**

---

## 🎯 1. NGUYÊN TẮC THIẾT KẾ & GENERATION PIPELINE

* **Phong cách đồng nhất (Art Style Consistency):** Cyberpunk Sci-Fi cao cấp, ánh sáng phát quang Neon Bloom (Cyan, Amber, Violet, Crimson, Frost Blue), viền sắc nét, nền trong suốt (Alpha Transparent PNG) để dễ ghép layer trên nền web.
* **Tối ưu hóa hiệu năng (Web Optimization):**
  * Tất cả các asset gen ra đều được nén chuẩn WebP/PNG tối ưu dung lượng (< 100KB/file), tổng toàn bộ thư mục Art dưới 3MB.
  * Tỷ lệ khung hình chuẩn game asset (1:1 cho Sprite và Icon, 16:9 cho Background).
* **Vị trí lưu trữ:** Toàn bộ file ảnh sau khi gen sẽ được đặt tại:
  `E:\project\WorkAndTop1\public\assets\` (truy xuất trực tiếp qua đường dẫn web `/assets/...`).

---

## 🎨 2. DANH MỤC TOÀN BỘ 18 ART ASSETS CẦN GEN (KÈM PROMPT CHI TIẾT)

Dưới đây là danh sách đầy đủ không thiếu một chi tiết nào của tất cả các asset hình ảnh sẽ sử dụng trong game:

---

### NHÓM 1: BỘ LÕI NĂNG LƯỢNG 5 CẤP TIẾN HÓA (CORE PHASES)
*(Hiển thị tại tâm màn hình, xoay tròn và co giãn đàn hồi khi người chơi tương tác)*

#### 1. `core_phase1_plasma.png`
* **Kích thước:** $512 \times 512\text{ px}$ (Transparent PNG).
* **Vị trí trong game:** Tâm Lõi Năng Lượng (Cấp 1: $0 \to 1,000\text{ Joules}$).
* **Mô tả thị giác:** Quả cầu plasma năng lượng màu xanh Cyan Neon phát sáng rực rỡ, bao bọc bởi 2 vòng từ trường kim loại mạ crom mỏng quay quanh trục.
* **AI Generation Prompt:**
  > `"A spherical sci-fi plasma reactor core, glowing cyan and electric neon blue energy orb, floating inside two thin metallic magnetic containment gimbal rings, dark sci-fi video game UI sprite asset, vibrant bloom glow, perfectly centered, isolated on pure black background, 8k resolution, crisp clean edges."`

#### 2. `core_phase2_fusion.png`
* **Kích thước:** $512 \times 512\text{ px}$ (Transparent PNG).
* **Vị trí trong game:** Tâm Lõi Năng Lượng (Cấp 2: $1,000 \to 50,000\text{ Joules}$).
* **Mô tả thị giác:** Lõi nhiệt hạch màu Vàng Hổ Phách rực cháy như một tiểu mặt trời, các vòng từ trường dày hơn và bắn ra các tai lửa corona năng lượng.
* **AI Generation Prompt:**
  > `"A nuclear fusion reactor core, glowing warm amber and intense golden solar plasma sphere, emitting mini solar flare loops, heavy industrial brass and gold containment rings, game asset sprite, centered, isolated on pure black background, hyper-detailed, clean vector-like digital art."`

#### 3. `core_phase3_antimatter.png`
* **Kích thước:** $512 \times 512\text{ px}$ (Transparent PNG).
* **Vị trí trong game:** Tâm Lõi Năng Lượng (Cấp 3: $50,000 \to 2,000,000\text{ Joules}$).
* **Mô tả thị giác:** Lõi phản vật chất màu Tím Huyền Ảo (Deep Violet & Magenta), không gian xung quanh bị bóp méo dạng thấu kính hấp dẫn, tia điện tím phóng quanh.
* **AI Generation Prompt:**
  > `"An exotic antimatter energy core, glowing deep violet and dark magenta mysterious singularity sphere, subtle gravitational distortion effect, alien obsidian magnetic rings with purple runes, game asset sprite, centered, isolated on pure black background, 8k, sharp glowing details."`

#### 4. `core_phase4_darkmatter.png`
* **Kích thước:** $512 \times 512\text{ px}$ (Transparent PNG).
* **Vị trí trong game:** Tâm Lõi Năng Lượng (Cấp 4: $2,000,000 \to 100,000,000\text{ Joules}$).
* **Mô tả thị giác:** Lõi vật chất tối Đỏ Dung Nham (Crimson / Blood-Red), năng lượng bốc cháy dữ dội với các vòng từ trường quay tốc độ cao nạp đầy điện thế cực hạn.
* **AI Generation Prompt:**
  > `"A hyper-dense dark matter core, intense crimson and incandescent blood-red burning energy sphere, crackling with red lightning arcs, jagged carbon-fiber containment matrix, game sprite UI asset, centered, isolated on pure black background, ultra-vibrant contrast."`

#### 5. `core_phase5_singularity.png`
* **Kích thước:** $512 \times 512\text{ px}$ (Transparent PNG).
* **Vị trí trong game:** Tâm Lõi Năng Lượng (Cấp 5: $\ge 100,000,000\text{ Joules}$ - Trạng thái Thức Tỉnh Phá Đảo).
* **Mô tả thị giác:** Lỗ đen lượng tử hoàn hảo (Micro Black Hole), đĩa bồi tụ phát quang màu trắng bạc và xanh băng giá, bẻ cong toàn bộ tia sáng xung quanh.
* **AI Generation Prompt:**
  > `"A cosmic micro black hole singularity core, pitch black event horizon sphere surrounded by an ethereal glowing white and icy blue relativistic accretion disk, warping the fabric of space, god-tier sci-fi artifact, centered, isolated on black background, 8k resolution."`

---

### NHÓM 2: BỘ ICON 4 HỆ THỐNG NÂNG CẤP (UPGRADE ICONS)
*(Hiển thị trên danh sách nút bấm nâng cấp bên bảng điều khiển phải)*

#### 6. `icon_plasma_laser.png`
* **Kích thước:** $256 \times 256\text{ px}$ (Transparent PNG).
* **Vị trí:** Nút Upgrade 1 - Plasma Laser Diodes (Tăng sát thương Click).
* **Mô tả thị giác:** Ống phóng tia laser công nghệ cao phát ra chùm tia laser xanh neon thẳng đứng, khung viền hình lục giác đậm chất Cyberpunk.
* **AI Generation Prompt:**
  > `"A sci-fi plasma laser emitter icon, focused electric cyan beam shooting forward, high-tech metallic hexagonal frame, glowing cyberpunk game ability icon, clean silhouette, isolated on black background, flat 2D game asset style."`

#### 7. `icon_cryo_jet.png`
* **Kích thước:** $256 \times 256\text{ px}$ (Transparent PNG).
* **Vị trí:** Nút Upgrade 2 - Cryo-Cooling Jets (Tản nhiệt & Mở Overdrive).
* **Mô tả thị giác:** Van xả khí áp lực cao với luồng khí ni-tơ lỏng đóng băng màu xanh tuyết, họa tiết hoa tuyết cơ khí băng giá phát sáng.
* **AI Generation Prompt:**
  > `"A futuristic cryogenic cooling valve icon, spraying frosted sub-zero nitrogen mist, mechanical snowflake emblem, glowing icy cyan and frost white, hexagonal game UI icon, isolated on black background, crisp vector styling."`

#### 8. `icon_subatomic_drone.png`
* **Kích thước:** $256 \times 256\text{ px}$ (Transparent PNG).
* **Vị trí:** Nút Upgrade 3 - Subatomic Drones (Tự động sản xuất JPS).
* **Mô tả thị giác:** Chiếc drone lượng tử 4 cánh lơ lửng, ở bụng drone gắn viên ngọc năng lượng đang chiếu tia từ trường thu hoạch xuống dưới.
* **AI Generation Prompt:**
  > `"A compact autonomous quantum harvester drone icon, sleek sci-fi quad-rotor drone with glowing power core in center, scanning beam, cyberpunk game upgrade icon, isolated on black background, polished mobile game asset."`

#### 9. `icon_harmonic_stabilizer.png`
* **Kích thước:** $256 \times 256\text{ px}$ (Transparent PNG).
* **Vị trí:** Nút Upgrade 4 - Harmonic Stabilizer (Tăng tỉ lệ Crit).
* **Mô tả thị giác:** Thiết bị âm thoa lượng tử công nghệ cao kết hợp đồ thị sóng hài hình sin phát sáng màu vàng kim và tím neon.
* **AI Generation Prompt:**
  > `"A quantum harmonic stabilizer icon, futuristic metallic tuning fork vibrating with holographic sine sound waves, gold and electric purple glow, high-tech balance device, hexagonal game icon, isolated on black background."`

---

### NHÓM 3: GIAO DIỆN & CÁC CHI TIẾT TƯƠNG TÁC (UI & INTERACTIVE ASSETS)
*(Dựng khung giao diện đắm chìm cho màn hình đơn Single-screen)*

#### 10. `ui_reactor_pedestal.png`
* **Kích thước:** $1024 \times 512\text{ px}$ (Transparent PNG).
* **Vị trí:** Đặt ngay bên dưới Lõi năng lượng ở nửa trái màn hình.
* **Mô tả thị giác:** Bệ phóng từ trường kim loại chống trọng lực, có các khe tản nhiệt phát sáng và ống dẫn ni-tơ lỏng kết nối vào lòng đất.
* **AI Generation Prompt:**
  > `"A heavy sci-fi magnetic containment pedestal platform, isometric perspective, industrial cyberpunk base with glowing cyan conduits and vent grilles, designed to hold a floating floating reactor core, isolated on pure black background, 8k."`

#### 11. `ui_heat_gauge_frame.png`
* **Kích thước:** $512 \times 128\text{ px}$ (Transparent PNG).
* **Vị trí:** Khung đo nhiệt độ $0 \to 100\%$ phía dưới Lõi.
* **Mô tả thị giác:** Khung thước đo kim loại bọc kính thủy tinh cường lực, hai đầu có vạch cảnh báo sọc vàng đen Hazard Stripe sắc sảo.
* **AI Generation Prompt:**
  > `"A horizontal cyberpunk temperature gauge frame, metallic bezel with black and yellow hazard caution stripes, hollow glass display slot in middle for progress bar, game UI HUD element, isolated on transparent background, crisp 2D."`

#### 12. `ui_cryo_vent_button_ready.png`
* **Kích thước:** $256 \times 256\text{ px}$ (Transparent PNG).
* **Vị trí:** Nút bấm kích hoạt Xả Tản Nhiệt (Khi Heat = 100%).
* **Mô tả thị giác:** Nút bấm cơ khí hình tròn màu đỏ/băng tuyết với biểu tượng xả áp suất, viền ngoài có vòng LED chớp nháy báo động giục giã.
* **AI Generation Prompt:**
  > `"A circular emergency industrial valve release button, glowing frost blue and warning emergency red LED ring, stamped with pressure vent icon, high-tech tactile button, game UI element, isolated on black background."`

#### 13. `ui_cryo_vent_button_locked.png`
* **Kích thước:** $256 \times 256\text{ px}$ (Transparent PNG).
* **Vị trí:** Nút bấm Xả Tản Nhiệt khi chưa đủ 100% Heat (Trạng thái khóa xám).
* **Mô tả thị giác:** Nút bấm xả áp suất ở trạng thái nguội tắt đèn, vật liệu kim loại xám sẫm mờ (Gunmetal matte), có icon ổ khóa nhỏ.
* **AI Generation Prompt:**
  > `"A deactivated industrial emergency button, dark matte gunmetal steel, unlit LED indicators, stamped vent icon with subtle lock symbol, dormant UI button asset, isolated on black background."`

#### 14. `ui_resonance_target.png`
* **Kích thước:** $512 \times 512\text{ px}$ (Transparent PNG).
* **Vị trí:** Vòng định tâm canh nhịp Resonance bao quanh Lõi.
* **Mô tả thị giác:** Thước đo radar holographic hình tròn đồng tâm, có 4 vạch ngắm và cung tròn chia độ tinh xảo phát quang xanh.
* **AI Generation Prompt:**
  > `"A circular holographic sci-fi targeting reticle ring, concentric HUD circle with precision tick marks and glowing cyan crosshairs, rhythmic timing ring for music rhythm game, isolated on black background, crisp vector transparency."`

---

### NHÓM 4: BỐI CẢNH & HIỆU ỨNG ĐẶC BIỆT (BACKGROUND & VFX ASSETS)

#### 15. `bg_space_laboratory.png`
* **Kích thước:** $1920 \times 1080\text{ px}$ (16:9 WebP tối ưu).
* **Vị trí:** Toàn màn hình phông nền phía sau.
* **Mô tả thị giác:** Góc nhìn từ bên trong trạm nghiên cứu lượng tử ngoài không gian sâu, cửa sổ kính vòm nhìn ra tinh vân vũ trụ màu tím xanh huyền bí, hai bên có các dàn máy chủ server đèn LED nhấp nháy mờ ảo.
* **AI Generation Prompt:**
  > `"Interior of a futuristic deep space orbital research laboratory, dark atmosphere, panoramic observation window overlooking a breathtaking violet nebula in outer space, faint ambient cyan server racks, atmospheric moody cyberpunk lighting, 16:9 wallpaper, clean composition without clutter."`

#### 16. `vfx_particle_spark.png`
* **Kích thước:** $64 \times 64\text{ px}$ (Transparent PNG).
* **Vị trí:** Hệ thống hạt bắn ra khi click chuột và khi drone thu hoạch.
* **Mô tả thị giác:** Đốm sáng hạt plasma hình thoi phát quang với quầng sáng mềm (Radial bloom falloff) màu xanh cyan và vàng kim.
* **AI Generation Prompt:**
  > `"A glowing energy spark particle texture, bright white core with electric cyan radial flare falloff, game VFX particle asset, isolated on black background."`

#### 17. `vfx_overdrive_frost_frame.png`
* **Kích thước:** $1920 \times 1080\text{ px}$ (Transparent PNG).
* **Vị trí:** Lớp phủ (Overlay Vignette) 4 góc màn hình khi nổ trạng thái Superconductor Overdrive x3.
* **Mô tả thị giác:** Viền băng tuyết và tia điện lạnh tỏa ra từ 4 mép màn hình, tạo cảm giác buồng phản ứng đang bị đông lạnh tuyệt đối bằng ni-tơ lỏng.
* **AI Generation Prompt:**
  > `"A screen edge vignette overlay frame of creeping frost crystals and sub-zero electric blue lightning crackles around the borders, center completely hollow and transparent, sci-fi freezing effect HUD overlay."`

#### 18. `vfx_victory_ascension.png`
* **Kích thước:** $1024 \times 1024\text{ px}$ (Transparent PNG).
* **Vị trí:** Màn hình kết thúc trò chơi (Victory Speedrun Screen).
* **Mô tả thị giác:** Cổng siêu không gian lượng tử nổ tung chùm tia sáng trắng và vàng kim dạng vòng sóng xung kích (Supernova Shockwave) mang tính vũ trụ vô tận.
* **AI Generation Prompt:**
  > `"A cosmic supernova shockwave blast ring, ethereal burst of golden and blinding white quantum light particles, expanding hyperspace portal ring, game victory climax VFX sprite, isolated on pure black background, 8k."`

---

## 🏗️ 3. SƠ ĐỒ LẮP GHÉP CÁC ASSET TRÊN MÀN HÌNH DUY NHẤT (SINGLE-SCREEN COMPOSITING)

```text
+---------------------------------------------------------------------------------------------------+
| [bg_space_laboratory.png] (Background tĩnh toàn màn hình)                                          |
|                                                                                                   |
|  [HEADER BAR]: ⚡ JOULES | 📈 J/S | 🏆 PHASE CẤP ĐỘ | [vfx_overdrive_frost_frame.png (Overlay)]    |
+---------------------------------------------------------------------------------------------------+
|  [KHU VỰC TƯƠNG TÁC LÕI - 45% CHIỀU RỘNG]     |  [BẢNG ĐIỀU KHIỂN NÂNG CẤP - 55% CHIỀU RỘNG]      |
|                                                |                                                   |
|           [ui_resonance_target.png]            |  [icon_plasma_laser.png]       PLASMA DIODES      |
|                     ▲                          |                                [BUY BUTTON]       |
|                     │                          |                                                   |
|          [core_phase1_to_5.png]                |  [icon_cryo_jet.png]           CRYO JETS          |
|         (Lõi năng lượng xoay 3D)               |                                [BUY BUTTON]       |
|                     │                          |                                                   |
|                     ▼                          |  [icon_subatomic_drone.png]    SUBATOMIC DRONES   |
|          [ui_reactor_pedestal.png]             |                                [BUY BUTTON]       |
|             (Bệ từ trường đỡ lõi)              |                                                   |
|                                                |  [icon_harmonic_stabilizer.png] HARMONIC STABILIZER|
|  [ui_heat_gauge_frame.png] (Thước đo nhiệt độ) |                                [BUY BUTTON]       |
|  [ui_cryo_vent_button]     (Nút xả Overdrive)  |                                                   |
+---------------------------------------------------------------------------------------------------+
| [vfx_particle_spark.png] & Floating Numbers bắn ra mỗi khi click chuột lên Lõi                    |
+---------------------------------------------------------------------------------------------------+
```

---

## ⚡ 4. CƠ CHẾ NẠP VÀ RENDER ASSET MƯỢT MÀ 60 FPS

1. **Sprite Preloading:** Toàn bộ 18 asset được tiền nạp (Preload) ngay khi web khởi động qua `HTMLImageElement` vào bộ nhớ RAM, đảm bảo khi người chơi lên cấp hoặc nổ Overdrive thì hình ảnh xuất hiện ngay lập tức, không bị giật lag hay nhấp nháy trắng (Flicker).
2. **Canvas Render Pipeline:** 
   * Lõi `core_phaseX.png` được vẽ trên thẻ `<canvas>` độc lập, dùng hàm `ctx.rotate()` và `ctx.scale()` kết hợp toán học sóng sin để tạo hiệu ứng nhịp đập phập phồng (Breathing effect) mượt mà 60 FPS mà không hề kích hoạt React re-render.
3. **Responsive Scaling:** Sử dụng CSS Container Queries và Canvas Auto-resize theo tỷ lệ khung hình màn hình để trên cả Laptop, Màn hình rời 2K/4K hay Màn hình điện thoại đều hiển thị cân đối và sắc nét.

---
*Tài liệu được hoàn thiện và lưu trữ tại `E:\project\WorkAndTop1\ART_PLAN.md` - Sẵn sàng cho quá trình Gen Asset và Triển khai Code.*
