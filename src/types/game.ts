export type UpgradeId = 'plasmaLaser' | 'cryoJets' | 'subatomicDrones' | 'harmonicStabilizer';

export interface UpgradeConfig {
  id: UpgradeId;
  name: string;
  subtitle: string;
  baseCost: number;
  multiplier: number;
  iconPath: string;
  description: string;
  unit: string;
}

export interface EvolutionPhaseInfo {
  phase: number;
  name: string;
  threshold: number;
  image: string;
  colorName: string;
  accentHex: string;
  description: string;
}

export type AnomalyType = 'surge' | 'freeze' | 'frenzy';

export interface QuantumAnomaly {
  id: string;
  type: AnomalyType;
  x: number; // percent 10 to 85
  y: number; // percent 15 to 80
  vx: number;
  vy: number;
  timeLeft: number; // seconds
  totalDuration: number;
}

export interface GameState {
  joules: number;
  totalJoulesEarned: number;
  totalClicks: number;
  heat: number; // 0 to 100
  isOverdrive: boolean;
  overdriveTimeRemaining: number; // seconds
  cryoFreezeRemaining: number; // seconds buff: nhiệt bị khóa 0%, spam tẹt ga
  frenzyRemaining: number; // seconds buff: sản lượng x5 toàn diện
  activeAnomaly: QuantumAnomaly | null; // Dị thường lượng tử đang bay lượn
  upgrades: Record<UpgradeId, number>; // level per upgrade
  currentPhase: number; // 1 to 5
  hasWon: boolean;
  speedrunSeconds: number;
  isMuted: boolean;
  meltdownCount: number; // Tổng số lần lõi phát nổ do cố tình quá nhiệt 100%
  lastMeltdownPenalty: number; // Mức phạt âm tiền của vụ nổ gần nhất
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  opacity: number;
  vy: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  targetX?: number;
  targetY?: number;
}

export type ScreenShakeLevel = 'off' | 'low' | 'normal' | 'high';
export type ParticleQualityLevel = 'low' | 'high';

export interface GameSettings {
  bgmVolume: number; // 0 to 100
  sfxVolume: number; // 0 to 100
  isBgmMuted: boolean;
  isSfxMuted: boolean;
  screenShake: ScreenShakeLevel;
  particleQuality: ParticleQualityLevel;
}

