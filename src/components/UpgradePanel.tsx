import React from 'react';
import { GameState, UpgradeId } from '../types/game';
import { UPGRADE_CONFIGS } from '../data/gameConstants';
import { calculateUpgradeCost } from '../utils/gameCalculations';
import { formatJoules } from '../utils/formatters';
import { Wrench, ChevronUp, Lock, Zap, Shield, Bot, Radio } from 'lucide-react';

interface UpgradePanelProps {
  gameState: GameState;
  onBuyUpgrade: (id: UpgradeId) => void;
}

const UPGRADE_ICONS = {
  plasmaLaser: Zap,
  cryoJets: Radio,
  subatomicDrones: Bot,
  harmonicStabilizer: Shield,
};

const UPGRADE_COLORS = {
  plasmaLaser: '#00f0ff',
  cryoJets: '#22d3ee',
  subatomicDrones: '#818cf8',
  harmonicStabilizer: '#fbbf24',
};

export const UpgradePanel: React.FC<UpgradePanelProps> = ({ gameState, onBuyUpgrade }) => {
  return (
    <div className="w-full h-full flex flex-col border-l z-10 overflow-hidden" style={{ borderColor: 'rgba(0,240,255,0.1)', background: 'rgba(2,6,16,0.96)' }}>

      {/* Panel Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: 'rgba(0,240,255,0.12)', background: 'rgba(0,0,0,0.6)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
            <Wrench className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-orbitron font-black text-xs tracking-[0.12em] text-slate-100">UPGRADE CONSOLE</h2>
            <p className="text-[9px] font-mono text-slate-500 tracking-wider">4 HỆ THỐNG LÕI LƯỢNG TỬ</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
          gameState.joules < 0
            ? 'bg-red-500/15 border-red-500/40 text-red-400'
            : 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${gameState.joules < 0 ? 'bg-red-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
          <span className="text-[9px] font-mono font-bold">{gameState.joules < 0 ? 'PHONG TỎA NỢ' : 'ONLINE'}</span>
        </div>
      </div>

      {/* Debt Lockdown Banner */}
      {gameState.joules < 0 && (
        <div className="mx-3 mt-2.5 px-3 py-2 rounded-lg bg-red-950/60 border border-red-500/40 text-[10px] font-mono text-red-300 flex flex-col gap-1">
          <div className="font-bold text-red-400 flex items-center gap-1">
            <Lock className="w-3 h-3" /> HỆ THỐNG NÂNG CẤP ĐANG KHÓA
          </div>
          <div>Đang nợ <span className="font-bold text-red-200">{formatJoules(gameState.joules)}</span> do Lõi phát nổ. Hãy nhấp chuột vào Lõi hoặc để Drone thu hoạch để trả hết nợ!</div>
        </div>
      )}

      {/* Upgrade List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
        {UPGRADE_CONFIGS.map((upgrade, idx) => {
          const currentLevel = gameState.upgrades[upgrade.id] || 0;
          const cost = calculateUpgradeCost(upgrade.id, currentLevel);
          const canAfford = gameState.joules >= cost;
          const colorHex = UPGRADE_COLORS[upgrade.id];
          const IconComp = UPGRADE_ICONS[upgrade.id];
          const maxLevelBar = Math.min(currentLevel, 20);

          return (
            <div
              key={upgrade.id}
              className={`upgrade-card rounded-xl border transition-all duration-200 overflow-hidden ${canAfford ? 'can-afford' : ''}`}
              style={{
                borderColor: canAfford ? `${colorHex}60` : 'rgba(51,65,85,0.4)',
                background: canAfford
                  ? `linear-gradient(135deg, ${colorHex}12 0%, rgba(2,6,16,0.97) 60%)`
                  : 'linear-gradient(135deg, rgba(15,23,42,0.5) 0%, rgba(2,6,16,0.97) 100%)',
                boxShadow: canAfford ? `0 0 18px ${colorHex}20, inset 0 0 20px ${colorHex}06` : 'none',
              }}
            >
              {/* Level indicator bar at top */}
              <div className="h-0.5 w-full bg-slate-900">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${(maxLevelBar / 20) * 100}%`, backgroundColor: colorHex, boxShadow: `0 0 6px ${colorHex}` }}
                />
              </div>

              <div className="p-3 flex items-start gap-3">
                {/* Left: Icon + Level */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1">
                  {/* Icon */}
                  <div
                    className="relative w-12 h-12 rounded-xl overflow-hidden border"
                    style={{ borderColor: `${colorHex}40`, background: `${colorHex}10`, boxShadow: canAfford ? `0 0 10px ${colorHex}25` : 'none' }}
                  >
                    <img src={upgrade.iconPath} alt={upgrade.name} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: `${colorHex}15` }}>
                      <IconComp className="w-5 h-5 drop-shadow-lg" style={{ color: colorHex }} />
                    </div>
                  </div>

                  {/* Level badge */}
                  <div
                    className="px-2 py-0.5 rounded-full text-[10px] font-orbitron font-black border"
                    style={{
                      color: colorHex,
                      borderColor: `${colorHex}40`,
                      background: `${colorHex}12`
                    }}
                  >
                    Lv.{currentLevel}
                  </div>
                </div>

                {/* Middle: Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <h3 className="font-bold text-xs text-slate-100 truncate">{upgrade.name}</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-snug line-clamp-2 mb-1.5">
                    {upgrade.description}
                  </p>

                  {/* Current bonus line */}
                  <div className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: colorHex }}>
                    <ChevronUp className="w-2.5 h-2.5" />
                    {upgrade.id === 'plasmaLaser' && `+${currentLevel} J/click (×${(1 + Math.floor(currentLevel / 10) * 0.05).toFixed(2)} bonus)`}
                    {upgrade.id === 'cryoJets' && `+${(currentLevel * 12).toFixed(0)}% tản nhiệt / +${(currentLevel * 0.5).toFixed(1)}s Overdrive`}
                    {upgrade.id === 'subatomicDrones' && `+${currentLevel * 15} J/giây tự động`}
                    {upgrade.id === 'harmonicStabilizer' && `+${Math.min(40, currentLevel * 3)}% Crit rate`}
                  </div>
                </div>

                {/* Right: Buy Button */}
                <button
                  onClick={() => onBuyUpgrade(upgrade.id)}
                  disabled={!canAfford}
                  className={`flex-shrink-0 flex flex-col items-center gap-0.5 rounded-xl px-3 py-2.5 font-mono font-bold transition-all duration-150 min-w-[72px] ${canAfford ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed'}`}
                  style={canAfford ? {
                    background: `linear-gradient(135deg, ${colorHex}20, ${colorHex}08)`,
                    border: `1px solid ${colorHex}60`,
                    boxShadow: `0 0 12px ${colorHex}25`,
                    color: colorHex,
                  } : {
                    background: 'rgba(15,23,42,0.4)',
                    border: '1px solid rgba(51,65,85,0.4)',
                    color: '#334155',
                  }}
                >
                  {canAfford ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 opacity-50" />
                  )}
                  <span className="text-[9px] uppercase tracking-wider opacity-60">
                    {gameState.joules < 0 ? 'ĐANG NỢ' : canAfford ? 'NÂNG CẤP' : 'KHÓA'}
                  </span>
                  <span className="text-xs font-orbitron font-black whitespace-nowrap" style={{ color: canAfford ? colorHex : '#475569' }}>
                    {formatJoules(cost)}
                  </span>
                </button>
              </div>

              {/* Bottom: multi-tick level track */}
              <div className="px-3 pb-2 flex items-center gap-0.5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{ backgroundColor: i < maxLevelBar ? colorHex : 'rgba(51,65,85,0.4)', opacity: i < maxLevelBar ? 0.9 : 0.4 }}
                  />
                ))}
                {currentLevel > 20 && (
                  <span className="text-[9px] font-orbitron font-bold ml-1" style={{ color: colorHex }}>+{currentLevel - 20}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Panel Footer */}
      <div className="px-4 py-2 border-t flex flex-col gap-1 text-[10px] font-mono" style={{ borderColor: 'rgba(0,240,255,0.1)', background: 'rgba(0,0,0,0.85)' }}>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">
            VÍ: <strong className={gameState.joules < 0 ? 'text-red-400 flicker font-bold' : 'text-cyan-400'}>{formatJoules(gameState.joules)}</strong>
          </span>
          <a
            href="https://pawfoliostudio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-cyan-400 transition-colors"
          >
            ✨ PAWFOLIO STUDIO
          </a>
        </div>
        <div className="text-[9px] text-amber-400/90 flex items-center gap-1">
          <span>💡</span> Mẹo: Dùng hết Joules mua nâng cấp để không bị mất tiền khi Lõi nổ!
        </div>
      </div>
    </div>
  );
};
