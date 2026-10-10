import React, { useState } from 'react';
import { GameState } from '../types/game';
import { EVOLUTION_PHASES, OVERDRIVE_MULTIPLIER } from '../data/gameConstants';
import { calculateJPC, calculateCritStats, calculateJPS } from '../utils/gameCalculations';
import { AIAssistantCompanion } from './AIAssistantCompanion';
import { Flame, Snowflake, Zap, AlertTriangle, Crosshair, Sparkles, Activity, Cpu, Skull } from 'lucide-react';
import { formatRate, formatJoules } from '../utils/formatters';

interface ReactorViewProps {
  gameState: GameState;
  comboCount: number;
  onCoreClick: (clientX: number, clientY: number) => void;
  onCryoVent: () => void;
}

// Mini circular gauge SVG widget
const CircularGauge: React.FC<{ value: number; max: number; label: string; unit: string; colorHex: string; size?: number }> = ({
  value, max, label, unit, colorHex, size = 72
}) => {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = Math.min(1, value / max);
  const dashOffset = circ * (1 - fill);

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          {/* Fill */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={colorHex}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ filter: `drop-shadow(0 0 4px ${colorHex})`, transition: 'stroke-dashoffset 0.4s ease' }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-orbitron font-black text-sm leading-none" style={{ color: colorHex }}>
            {typeof value === 'number' && value > 999 ? `${(value / 1000).toFixed(1)}K` : Math.floor(value)}
          </span>
          <span className="text-[8px] text-slate-500 font-mono">{unit}</span>
        </div>
      </div>
      <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">{label}</span>
    </div>
  );
};

export const ReactorView: React.FC<ReactorViewProps> = ({
  gameState,
  comboCount,
  onCoreClick,
  onCryoVent
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const currentPhaseInfo = EVOLUTION_PHASES[gameState.currentPhase - 1];
  const jpc = calculateJPC(gameState.upgrades, gameState.isOverdrive);
  const critStats = calculateCritStats(gameState.upgrades);
  const jps = calculateJPS(gameState.upgrades, gameState.isOverdrive);

  const isOverheatReady = gameState.heat >= 85 && !gameState.isOverdrive;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsPressing(true);
    onCoreClick(e.clientX, e.clientY);
  };
  const handlePointerUp = () => setIsPressing(false);

  const accent = currentPhaseInfo.accentHex;

  return (
    <div className="relative w-full h-full flex flex-col gap-1.5 p-2 md:p-3 z-10 overflow-hidden">

      {/* ── TOP TELEMETRY BAR ── */}
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border border-slate-800/80 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Zap className="w-3.5 h-3.5" style={{ color: accent }} />
            <strong style={{ color: accent }}>+{Math.round(jpc)} J</strong>
            <span className="text-slate-500">/click</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <strong className="text-emerald-400">{formatRate(jps)}</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Crosshair className="w-3 h-3 text-amber-400" />
            <strong className="text-amber-400">CRIT x{critStats.multiplier.toFixed(1)}</strong>
            <span className="text-slate-500">{Math.round(critStats.chance * 100)}%</span>
          </span>
        </div>

        {/* Combo Streak Badge */}
        {comboCount >= 2 ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-400 font-orbitron font-black text-xs animate-pulse" style={{ background: 'rgba(255,183,3,0.12)', color: '#ffb703', boxShadow: '0 0 12px rgba(255,183,3,0.4)' }}>
            <Sparkles className="w-3 h-3" />
            COMBO ×{comboCount}!
          </div>
        ) : (
          <div className="text-[10px] text-slate-600 font-mono flex items-center gap-1">
            <Crosshair className="w-3 h-3 text-slate-700" />
            CANH NHỊP SÓNG HÀI
          </div>
        )}
      </div>

      {/* ── MAIN REACTOR CHAMBER ── */}
      <div className="relative flex-1 flex min-h-0">
        {/* Reactor Chamber Frame (sci-fi angled border) */}
        <div
          className="relative flex-1 flex items-center justify-center overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,240,255,0.03) 0%, rgba(2,8,20,0.8) 60%, rgba(0,0,0,0.9) 100%)',
            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
            border: `1px solid ${accent}25`
          }}
        >
          {/* Corner accent marks */}
          {[
            'top-1 left-1 border-t-2 border-l-2',
            'top-1 right-4 border-t-2 border-r-2',
            'bottom-1 left-1 border-b-2 border-l-2',
            'bottom-1 right-1 border-b-2 border-r-2',
          ].map((cls, i) => (
            <div key={i} className={`absolute w-4 h-4 ${cls}`} style={{ borderColor: `${accent}80` }} />
          ))}

          {/* Interior grid lines */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `
              linear-gradient(${accent} 1px, transparent 1px),
              linear-gradient(90deg, ${accent} 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />

          {/* Left Turret */}
          <div className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 flex-col items-center gap-2 opacity-80 z-10">
            <div className="w-1.5 h-10 rounded-sm" style={{ background: `linear-gradient(to bottom, ${accent}, transparent)`, boxShadow: `0 0 6px ${accent}` }} />
            <div className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: `${accent}60`, background: 'rgba(0,0,0,0.8)' }}>
              <div className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: accent, opacity: 0.7 }} />
            </div>
            <div className="w-1.5 h-6 rounded-sm" style={{ background: `linear-gradient(to bottom, transparent, ${accent}60)` }} />
            <span className="text-[8px] font-mono text-slate-600 tracking-wider">T-L1</span>
          </div>

          {/* Right Turret */}
          <div className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 flex-col items-center gap-2 opacity-80 z-10">
            <div className="w-1.5 h-10 rounded-sm" style={{ background: `linear-gradient(to bottom, ${accent}, transparent)`, boxShadow: `0 0 6px ${accent}` }} />
            <div className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: `${accent}60`, background: 'rgba(0,0,0,0.8)' }}>
              <div className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: accent, opacity: 0.7 }} />
            </div>
            <div className="w-1.5 h-6 rounded-sm" style={{ background: `linear-gradient(to bottom, transparent, ${accent}60)` }} />
            <span className="text-[8px] font-mono text-slate-600 tracking-wider">T-R2</span>
          </div>

          {/* ── CENTRAL REACTOR STAGE (HỆ THỐNG ĐỒNG TÂM 100% HOÀN HẢO) ── */}
          <div className="relative flex items-center justify-center w-[280px] h-[280px] max-w-[85vw] max-h-[85vh] aspect-square select-none my-auto">
            {/* 1. Concentric Gyroscope Ring 1 - Outer Tech Ring (SVG đồng tâm tuyệt đối) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ animation: 'spin 40s linear infinite' }}
              viewBox="0 0 280 280"
            >
              <circle cx="140" cy="140" r="134" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="8 6" opacity="0.45" />
              <circle cx="140" cy="140" r="124" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="26 13 4 13" opacity="0.3" />
              {/* 4 Cardinal Tick Marks */}
              <line x1="140" y1="3" x2="140" y2="15" stroke={accent} strokeWidth="2.5" opacity="0.8" />
              <line x1="140" y1="265" x2="140" y2="277" stroke={accent} strokeWidth="2.5" opacity="0.8" />
              <line x1="3" y1="140" x2="15" y2="140" stroke={accent} strokeWidth="2.5" opacity="0.8" />
              <line x1="265" y1="140" x2="277" y2="140" stroke={accent} strokeWidth="2.5" opacity="0.8" />
            </svg>

            {/* 2. Concentric Gyroscope Ring 2 - Middle Reverse Ring */}
            <svg
              className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] pointer-events-none"
              style={{ animation: 'spin 25s linear infinite reverse' }}
              viewBox="0 0 256 256"
            >
              <circle cx="128" cy="128" r="122" fill="none" stroke={accent} strokeWidth="1.2" strokeDasharray="4 8" opacity="0.5" />
              <circle cx="128" cy="128" r="112" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2 12" opacity="0.35" />
            </svg>

            {/* 3. Ambient Glow Aura ở tâm */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: '196px',
                height: '196px',
                backgroundColor: gameState.joules < 0 ? '#ff2a5f' : accent,
                filter: 'blur(40px)',
                opacity: gameState.isOverdrive ? 0.45 : 0.25,
                transition: 'all 0.5s ease'
              }}
            />

            {/* 4. ── THE CORE ── (Quả cầu Lõi tròn chuẩn 100% 184px x 184px) */}
            <div
              data-testid="reactor-core"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className={`relative z-10 cursor-pointer rounded-full overflow-hidden select-none aspect-square flex items-center justify-center ${
                gameState.joules < 0 ? 'ring-4 ring-red-500/80 animate-pulse' : ''
              }`}
              style={{
                width: '184px',
                height: '184px',
                boxShadow: gameState.joules < 0
                  ? '0 0 50px rgba(255,42,95,0.8), 0 0 90px rgba(255,42,95,0.4)'
                  : `0 0 45px ${accent}60, 0 0 80px ${accent}25`,
                transform: isPressing ? 'scale(0.92)' : 'scale(1)',
                outline: gameState.joules < 0
                  ? '3px dashed #ff2a5f'
                  : gameState.isOverdrive
                  ? `3px solid ${accent}`
                  : 'none',
                transition: 'transform 0.08s ease, outline 0.3s ease, box-shadow 0.5s ease'
              }}
            >
              <img
                src={currentPhaseInfo.image}
                alt={currentPhaseInfo.name}
                className="w-full h-full object-cover rounded-full pointer-events-none core-pulse"
                style={{
                  filter: gameState.joules < 0 ? 'sepia(0.6) hue-rotate(300deg)' : 'none'
                }}
              />

              {/* Overdrive shimmer overlay */}
              {gameState.isOverdrive && (
                <div className="absolute inset-0 pointer-events-none rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.25) 0%, transparent 70%)', animation: 'pulse 0.8s ease-in-out infinite' }} />
              )}

              {/* Meltdown danger overlay when >= 90% */}
              {gameState.heat >= 90 && !gameState.isOverdrive && (
                <div className="absolute inset-0 pointer-events-none bg-red-600/35 rounded-full flex items-center justify-center flicker">
                  <span className="font-orbitron font-black text-[11px] text-white bg-red-600 px-2 py-0.5 rounded shadow-lg uppercase">
                    SẮP NỔ 100%!
                  </span>
                </div>
              )}
            </div>

            {/* 5. Pedestal Badge (Huy hiệu tên Lõi nằm ngay dưới đế Lõi - KHÔNG che lấp quả cầu) */}
            <div
              className="absolute -bottom-3 z-20 px-3 py-1 rounded-full border shadow-lg flex items-center gap-1.5 backdrop-blur-md"
              style={{
                background: 'rgba(2, 6, 16, 0.92)',
                borderColor: gameState.joules < 0 ? 'rgba(255,42,95,0.6)' : `${accent}60`,
                boxShadow: gameState.joules < 0 ? '0 0 12px rgba(255,42,95,0.4)' : `0 0 12px ${accent}30`
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: gameState.joules < 0 ? '#ff2a5f' : accent }} />
              <span className="font-orbitron text-[10px] font-bold tracking-widest leading-none" style={{ color: gameState.joules < 0 ? '#ff2a5f' : accent }}>
                {gameState.joules < 0 ? `ĐANG TRẢ NỢ: ${formatJoules(gameState.joules)}` : currentPhaseInfo.name.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Critical Warning Floating Alert when heat >= 90% */}
          {gameState.heat >= 90 && !gameState.isOverdrive && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white font-orbitron font-bold text-xs shadow-lg animate-bounce border border-yellow-300">
              <Skull className="w-4 h-4 animate-spin" />
              BÁO ĐỘNG ĐỎ: {Math.round(gameState.heat)}%! CHẠM 100% SẼ NỔ VÀ ÂM TIỀN!
            </div>
          )}

          {/* Phase description bottom bar — Thoáng đãng, không bao giờ bị đè hay cắt xén */}
          <div className="absolute bottom-2 left-6 right-6 flex items-center justify-center pointer-events-none z-10">
            <div className="px-3 py-0.5 rounded-full bg-black/75 border border-slate-800/80 backdrop-blur-md max-w-full">
              <p className="text-[10px] text-slate-400 font-mono tracking-wide truncate">
                {gameState.joules < 0
                  ? '⚠️ Trạm đang thiệt hại sau vụ nổ lượng tử. Nhấp chuột hoặc chờ Drone cày trả nợ!'
                  : currentPhaseInfo.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM CONTROL DECK ── */}
      <div className="flex flex-col gap-1.5">

        {/* Mini Stats Row (Circular Gauges) */}
        <div className="flex items-center justify-around px-3 py-2 rounded-lg border border-slate-800/80 bg-black/60 backdrop-blur-sm">
          <CircularGauge value={gameState.heat} max={100} label="NHIỆT" unit="%" colorHex={gameState.heat > 85 ? '#ff2a5f' : gameState.heat > 55 ? '#ffaa00' : '#00f0ff'} size={68} />
          <div className="w-px h-10 bg-slate-800" />
          <CircularGauge value={jps} max={Math.max(500, jps * 1.2)} label="AUTO/S" unit="J" colorHex="#22d3ee" size={68} />
          <div className="w-px h-10 bg-slate-800" />
          <CircularGauge value={Math.round(critStats.chance * 100)} max={45} label="CRIT%" unit="%" colorHex="#fbbf24" size={68} />
          <div className="w-px h-10 bg-slate-800" />
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-[68px] h-[68px] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Cpu className="w-6 h-6 mb-0.5" style={{ color: accent }} />
                <span className="font-orbitron font-black text-sm" style={{ color: accent }}>Lv.{gameState.upgrades.subatomicDrones}</span>
              </div>
            </div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">DRONES</span>
          </div>
        </div>

        {/* AI Companion */}
        <AIAssistantCompanion gameState={gameState} comboCount={comboCount} />

        {/* Meltdown / Debt Notification Banner if in debt */}
        {gameState.joules < 0 && (
          <div className="px-3 py-1.5 rounded-lg border border-red-500/50 bg-red-950/40 flex items-center justify-between text-xs font-mono text-red-300">
            <span className="flex items-center gap-1.5 font-bold">
              <Skull className="w-3.5 h-3.5 text-red-400" />
              SỰ CỐ NỔ #{gameState.meltdownCount || 1} (Phạt: -{formatJoules(gameState.lastMeltdownPenalty || 0)})
            </span>
            <span className="text-red-400 font-bold animate-pulse">CÀY TRẢ NỢ ĐỂ MỞ NÂNG CẤP</span>
          </div>
        )}

        {/* Heat Bar + Cryo Vent */}
        <div className="rounded-lg border border-slate-800/80 bg-black/70 backdrop-blur-md px-3 py-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <Flame className={`w-4 h-4 ${gameState.heat > 85 ? 'text-red-400 flicker' : gameState.heat > 55 ? 'text-yellow-400' : 'text-cyan-400'}`} />
              HEAT METER — LÕI PHẢN ỨNG
              {gameState.heat >= 90 && (
                <span className="text-[10px] text-red-400 font-mono animate-pulse uppercase ml-2">⚠️ SẮP NỔ!</span>
              )}
            </span>
            <span className={`font-mono font-bold text-sm ${gameState.heat >= 85 ? 'text-red-400' : 'text-slate-200'}`}>
              {Math.floor(gameState.heat)}% / 100%
            </span>
          </div>

          {/* Segmented heat bar */}
          <div className="relative h-3.5 rounded-full bg-slate-900/90 overflow-hidden border border-slate-700/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
            <div
              className="h-full rounded-full heat-bar-fill relative"
              style={{
                width: `${gameState.heat}%`,
                background: gameState.heat >= 85
                  ? 'linear-gradient(90deg, #ff2a5f, #ff0033)'
                  : gameState.heat > 50
                  ? 'linear-gradient(90deg, #ffaa00, #ffd700)'
                  : `linear-gradient(90deg, ${accent}, ${accent}cc)`,
                boxShadow: gameState.heat >= 85 ? '0 0 16px rgba(255,42,95,0.9)' : `0 0 8px ${accent}60`
              }}
            >
              {/* Leading spark dot at current heat level */}
              {gameState.heat > 2 && (
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]"
                  style={{
                    backgroundColor: gameState.heat >= 85 ? '#ffffff' : '#e0faff'
                  }}
                />
              )}
            </div>
            {/* Segment dividers */}
            {[25, 50, 75, 85].map(pct => (
              <div key={pct} className="absolute top-0 bottom-0 w-px" style={{ left: `${pct}%`, background: 'rgba(255,255,255,0.2)' }} />
            ))}
            {/* 85% to 100% Meltdown Danger Zone */}
            <div className="absolute top-0 bottom-0 right-0 w-[15%] bg-red-600/25 border-l border-red-500/80" />
          </div>

          {/* Overdrive bar or Cryo button */}
          {gameState.isOverdrive ? (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg border font-bold text-sm" style={{ background: 'rgba(0,240,255,0.08)', borderColor: 'rgba(0,240,255,0.4)', boxShadow: '0 0 15px rgba(0,240,255,0.2)' }}>
              <span className="flex items-center gap-2 text-xs" style={{ color: '#88e5ff' }}>
                <Snowflake className="w-4 h-4 animate-spin" />
                SIÊU DẪN OVERDRIVE ACTIVE — x{OVERDRIVE_MULTIPLIER} SẢN LƯỢNG
              </span>
              <span className="font-orbitron font-black text-sm" style={{ color: '#00f0ff' }}>
                {gameState.overdriveTimeRemaining.toFixed(1)}s
              </span>
            </div>
          ) : (
            <button
              onClick={onCryoVent}
              disabled={!isOverheatReady}
              className={`w-full py-2.5 rounded-lg font-orbitron font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                isOverheatReady
                  ? 'cursor-pointer hover:brightness-110 active:scale-95'
                  : 'cursor-not-allowed opacity-50'
              }`}
              style={isOverheatReady ? {
                background: 'linear-gradient(135deg, #7f1d1d, #dc2626, #0891b2)',
                boxShadow: '0 0 25px rgba(255,42,95,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,100,100,0.5)',
                color: 'white',
                animation: 'pulse 1.5s ease-in-out infinite'
              } : {
                background: 'rgba(15,23,42,0.6)',
                border: '1px solid rgba(71,85,105,0.4)',
                color: '#475569'
              }}
            >
              {isOverheatReady ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-yellow-300 animate-spin" />
                  ⚡ XẢ TẢN NHIỆT KHẨN CẤP (TRÁNH NỔ 100%) → OVERDRIVE ×3
                </>
              ) : (
                <>
                  <Snowflake className="w-4 h-4 text-slate-600" />
                  XẢ TẢN NHIỆT (CẦN ≥ 85% — CẨN THẬN ĐỪNG ĐỂ 100% SẼ NỔ!)
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
