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

export interface GameState {
  joules: number;
  totalJoulesEarned: number;
  totalClicks: number;
  heat: number; // 0 to 100
  isOverdrive: boolean;
  overdriveTimeRemaining: number; // seconds
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
