import { UpgradeConfig, EvolutionPhaseInfo } from '../types/game';

export const UPGRADE_CONFIGS: UpgradeConfig[] = [
  {
    id: 'plasmaLaser',
    name: 'Plasma Laser Diodes',
    subtitle: 'Nâng Cấp Kích Nổ Thủ Công',
    baseCost: 15,
    multiplier: 1.15,
    iconPath: '/assets/icons/icon_plasma_laser.jpg',
    description: '+1 Joules / cú click. Cứ mỗi 10 cấp tăng thêm 5% tổng sản lượng click.',
    unit: 'J/Click'
  },
  {
    id: 'cryoJets',
    name: 'Cryo-Cooling Jets',
    subtitle: 'Hệ Thống Tản Nhiệt Ni-tơ',
    baseCost: 120,
    multiplier: 1.18,
    iconPath: '/assets/icons/icon_cryo_jet.jpg',
    description: '+12% tốc độ tản nhiệt tự nhiên và +0.5s thời lượng buff Siêu Dẫn Overdrive x3.',
    unit: 'Tản Nhiệt & Overdrive'
  },
  {
    id: 'subatomicDrones',
    name: 'Subatomic Drones',
    subtitle: 'Hạm Đội Drone Lượng Tử',
    baseCost: 300,
    multiplier: 1.16,
    iconPath: '/assets/icons/icon_subatomic_drone.jpg',
    description: '+15 Joules tự động thu hoạch mỗi giây từ trường lượng tử.',
    unit: 'J/Giây'
  },
  {
    id: 'harmonicStabilizer',
    name: 'Harmonic Stabilizer',
    subtitle: 'Bộ Ổn Định Sóng Hài',
    baseCost: 3500,
    multiplier: 1.22,
    iconPath: '/assets/icons/icon_harmonic_stabilizer.jpg',
    description: '+3% tỉ lệ xuất hiện nhịp Resonance Pulse (Tối đa 40%) và nâng Crit từ x3 lên x5.',
    unit: 'Tỉ Lệ Crit x5'
  }
];

export const EVOLUTION_PHASES: EvolutionPhaseInfo[] = [
  {
    phase: 1,
    name: 'Plasma Core',
    threshold: 1000,
    image: '/assets/cores/core_phase1_plasma.jpg',
    colorName: 'Cyan Neon',
    accentHex: '#00f0ff',
    description: 'Lõi Plasma sơ khai. Thu hoạch năng lượng điện tích để khởi động trạm.'
  },
  {
    phase: 2,
    name: 'Fusion Core',
    threshold: 50000,
    image: '/assets/cores/core_phase2_fusion.jpg',
    colorName: 'Amber Solar',
    accentHex: '#ffaa00',
    description: 'Phản ứng nhiệt hạch mặt trời. Mở khóa buồng làm mát và chế độ Overdrive.'
  },
  {
    phase: 3,
    name: 'Antimatter Core',
    threshold: 2000000,
    image: '/assets/cores/core_phase3_antimatter.jpg',
    colorName: 'Violet Singularity',
    accentHex: '#b026ff',
    description: 'Năng lượng phản vật chất bẻ cong không gian. Mở khóa nhịp Sóng Hài Crit x5.'
  },
  {
    phase: 4,
    name: 'Dark Matter Core',
    threshold: 100000000,
    image: '/assets/cores/core_phase4_darkmatter.jpg',
    colorName: 'Crimson Plasma',
    accentHex: '#ff2a55',
    description: 'Vật chất tối siêu đậm đặc. Sản lượng Joules bùng nổ theo cấp số nhân.'
  },
  {
    phase: 5,
    name: 'Singularity Black Hole',
    threshold: 100000000,
    image: '/assets/cores/core_phase5_singularity.jpg',
    colorName: 'Cosmic Singularity',
    accentHex: '#ffffff',
    description: 'Thức tỉnh Lỗ Đen Lượng Tử Tối Thượng! Kích hoạt Cổng Siêu Không Gian hoàn thành game.'
  }
];

export const RESONANCE_BPM = 110;
export const RESONANCE_PERIOD_SEC = 60 / RESONANCE_BPM; // ~0.545s
export const OVERDRIVE_BASE_DURATION = 10; // seconds
export const OVERDRIVE_MULTIPLIER = 3.0; // 3x passive & active output
