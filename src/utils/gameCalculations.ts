import { UPGRADE_CONFIGS, OVERDRIVE_MULTIPLIER, OVERDRIVE_BASE_DURATION } from '../data/gameConstants';
import { UpgradeId } from '../types/game';

export function calculateUpgradeCost(id: UpgradeId, currentLevel: number): number {
  const config = UPGRADE_CONFIGS.find(u => u.id === id);
  if (!config) return 0;
  return Math.floor(config.baseCost * Math.pow(config.multiplier, currentLevel));
}

export function calculateJPC(
  upgrades: Record<UpgradeId, number>,
  isOverdrive: boolean
): number {
  const laserLevel = upgrades.plasmaLaser || 0;
  let jpc = 1 + laserLevel * 1.0;

  // 5% bonus for every 10 levels of Plasma Laser
  const tenLevelMilestones = Math.floor(laserLevel / 10);
  if (tenLevelMilestones > 0) {
    jpc *= (1 + tenLevelMilestones * 0.05);
  }

  if (isOverdrive) {
    jpc *= OVERDRIVE_MULTIPLIER;
  }

  return Math.max(1, jpc);
}

export function calculateJPS(
  upgrades: Record<UpgradeId, number>,
  isOverdrive: boolean
): number {
  const droneLevel = upgrades.subatomicDrones || 0;
  let jps = droneLevel * 15.0;

  if (isOverdrive) {
    jps *= OVERDRIVE_MULTIPLIER;
  }

  return jps;
}

export function calculateCoolingRate(upgrades: Record<UpgradeId, number>): number {
  const cryoLevel = upgrades.cryoJets || 0;
  // Base cooling: 6% per second + 0.8% per Cryo Jet level
  return 6.0 + cryoLevel * 0.8;
}

export function calculateOverdriveDuration(upgrades: Record<UpgradeId, number>): number {
  const cryoLevel = upgrades.cryoJets || 0;
  return OVERDRIVE_BASE_DURATION + cryoLevel * 0.5;
}

export function calculateCritStats(upgrades: Record<UpgradeId, number>): { chance: number; multiplier: number } {
  const stabilizerLevel = upgrades.harmonicStabilizer || 0;
  // Base chance: 5%, capped at 45%
  const chance = Math.min(0.45, 0.05 + stabilizerLevel * 0.03);
  // Multiplier: base 3x, increases to 5x with stabilizer
  const multiplier = stabilizerLevel >= 5 ? 5.0 : 3.0 + stabilizerLevel * 0.4;
  return { chance, multiplier };
}
