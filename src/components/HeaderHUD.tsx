import React from 'react';
import { GameState } from '../types/game';
import { formatJoules, formatRate, formatSeconds } from '../utils/formatters';
import { calculateJPS } from '../utils/gameCalculations';
import { EVOLUTION_PHASES } from '../data/gameConstants';
import { Volume2, VolumeX, RotateCcw, Zap, TrendingUp, Clock, Award, ChevronRight } from 'lucide-react';

interface HeaderHUDProps {
  gameState: GameState;
  onToggleMute: () => void;
  onReset: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({ gameState, onToggleMute, onReset }) => {
  const currentPhaseInfo = EVOLUTION_PHASES[gameState.currentPhase - 1];
  const nextPhaseInfo = EVOLUTION_PHASES[gameState.currentPhase] || null;
  const currentJPS = calculateJPS(gameState.upgrades, gameState.isOverdrive);

  const prevThreshold = gameState.currentPhase > 1 ? EVOLUTION_PHASES[gameState.currentPhase - 2].threshold : 0;
  const targetThreshold = currentPhaseInfo.threshold;
  const progressRatio = nextPhaseInfo
    ? Math.min(1, Math.max(0, (gameState.totalJoulesEarned - prevThreshold) / (targetThreshold - prevThreshold)))
    : 1.0;
  const progressPercent = Math.floor(progressRatio * 100);

  return (
    <header className="relative w-full flex flex-col z-20 border-b" style={{ borderColor: `${currentPhaseInfo.accentHex}30` }}>
      {/* Dynamic color accent stripe at very top */}
      <div className="w-full h-0.5 transition-colors duration-700" style={{ backgroundColor: currentPhaseInfo.accentHex, boxShadow: `0 0 12px ${currentPhaseInfo.accentHex}` }} />

      {/* Main Header Row */}
      <div className="w-full flex items-center justify-between px-4 py-2 gap-2" style={{ background: 'rgba(3,7,18,0.95)', backdropFilter: 'blur(20px)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative w-9 h-9 rounded-lg flex items-center justify-center border" style={{ borderColor: `${currentPhaseInfo.accentHex}60`, background: `${currentPhaseInfo.accentHex}15`, boxShadow: `0 0 14px ${currentPhaseInfo.accentHex}40` }}>
            <Zap className="w-5 h-5 animate-pulse" style={{ color: currentPhaseInfo.accentHex }} />
          </div>
          <div>
            <h1 className="font-orbitron font-black text-sm tracking-[0.15em] text-slate-50 leading-none">
              NEON REACTOR
            </h1>
            <p className="text-[10px] tracking-widest uppercase font-mono mt-0.5" style={{ color: currentPhaseInfo.accentHex }}>
              ⬡ QUANTUM OVERDRIVE 2026
            </p>
          </div>
        </div>

        {/* Center: Live Energy Metrics */}
        <div className="flex items-stretch gap-0 rounded-xl overflow-hidden border border-slate-800 bg-black/60">
          {/* Joules (hoặc Nợ Âm) */}
          <div className="flex flex-col items-center px-5 py-2 border-r border-slate-800" style={gameState.joules < 0 ? { background: 'rgba(255,42,95,0.15)' } : {}}>
            <span className="text-[9px] uppercase tracking-widest font-mono flex items-center gap-1 mb-0.5" style={{ color: gameState.joules < 0 ? '#ff2a5f' : '#94a3b8' }}>
              <Zap className="w-2.5 h-2.5" style={{ color: gameState.joules < 0 ? '#ff2a5f' : currentPhaseInfo.accentHex }} />
              {gameState.joules < 0 ? 'NỢ NĂNG LƯỢNG' : 'NĂNG LƯỢNG'}
            </span>
            <span
              className={`font-orbitron font-black text-xl leading-none ${gameState.joules < 0 ? 'flicker' : ''}`}
              style={{
                color: gameState.joules < 0 ? '#ff2a5f' : currentPhaseInfo.accentHex,
                textShadow: gameState.joules < 0 ? '0 0 15px rgba(255,42,95,0.9)' : `0 0 15px ${currentPhaseInfo.accentHex}80`
              }}
            >
              {formatJoules(gameState.joules)}
            </span>
          </div>

          {/* JPS rate */}
          <div className="flex flex-col items-center px-4 py-2 border-r border-slate-800">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1 mb-0.5">
              <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
              AUTO/S
            </span>
            <span className={`font-orbitron font-bold text-base leading-none ${gameState.isOverdrive ? 'text-amber-400' : 'text-emerald-400'}`}>
              {formatRate(currentJPS)}
            </span>
          </div>

          {/* Phase badge */}
          <div className="flex flex-col items-center px-4 py-2 border-r border-slate-800">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1 mb-0.5">
              <Award className="w-2.5 h-2.5 text-purple-400" />
              CẤP ĐỘ
            </span>
            <span className="font-orbitron font-bold text-sm leading-none text-slate-100">
              {gameState.currentPhase}/5
              <span className="text-[10px] font-normal text-slate-400 ml-1.5">{currentPhaseInfo.name}</span>
            </span>
          </div>

          {/* Meltdown count or Clicks */}
          <div className="flex flex-col items-center px-4 py-2">
            <span className="text-[9px] uppercase tracking-widest font-mono mb-0.5" style={{ color: (gameState.meltdownCount || 0) > 0 ? '#ff2a5f' : '#94a3b8' }}>
              {(gameState.meltdownCount || 0) > 0 ? 'SỰ CỐ NỔ' : 'CLICKS'}
            </span>
            <span className="font-orbitron font-bold text-base leading-none" style={{ color: (gameState.meltdownCount || 0) > 0 ? '#ff2a5f' : '#e2e8f0' }}>
              {(gameState.meltdownCount || 0) > 0 ? `${gameState.meltdownCount} LẦN` : gameState.totalClicks.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right: Timer + Phase + Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Phase indicator with glow */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold font-orbitron" style={{ borderColor: `${currentPhaseInfo.accentHex}50`, backgroundColor: `${currentPhaseInfo.accentHex}12`, color: currentPhaseInfo.accentHex }}>
            {currentPhaseInfo.name.toUpperCase()}
            {nextPhaseInfo && <ChevronRight className="w-3 h-3 opacity-60" />}
          </div>

          {/* Speedrun timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-slate-800 text-slate-200">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-bold text-xs">{formatSeconds(gameState.speedrunSeconds)}</span>
          </div>

          {/* Sound + Reset */}
          <div className="flex items-center gap-1">
            <button onClick={onToggleMute} className="p-2 rounded-lg border border-slate-800 bg-black/40 hover:border-slate-600 transition-colors">
              {gameState.isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-400" />}
            </button>
            <button onClick={onReset} className="p-2 rounded-lg border border-slate-800 bg-black/40 hover:border-red-500/50 transition-colors">
              <RotateCcw className="w-4 h-4 text-slate-500 hover:text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar Row — Full-width milestone tracker */}
      <div className="flex items-center gap-3 px-4 py-1.5 bg-black/80 border-t border-slate-900">
        <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap tracking-wider uppercase">TIẾN TRÌNH</span>
        <div className="flex-1 relative h-2 rounded-full bg-slate-900 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%`, backgroundColor: currentPhaseInfo.accentHex, boxShadow: `0 0 10px ${currentPhaseInfo.accentHex}` }}
          />
          {/* Segment ticks */}
          {[25, 50, 75].map(pct => (
            <div key={pct} className="absolute top-0 bottom-0 w-px bg-slate-800" style={{ left: `${pct}%` }} />
          ))}
        </div>
        <span className="text-[11px] font-mono font-bold whitespace-nowrap" style={{ color: currentPhaseInfo.accentHex }}>
          {progressPercent}%
        </span>
        <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
          → {nextPhaseInfo ? formatJoules(targetThreshold) : 'MAX'}
        </span>

        {/* Overdrive indicator */}
        {gameState.isOverdrive && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/50 flicker">
            <span className="text-[10px] font-orbitron font-bold text-amber-400">⚡ OVERDRIVE x3</span>
            <span className="text-[10px] font-mono text-amber-300">{gameState.overdriveTimeRemaining.toFixed(1)}s</span>
          </div>
        )}
      </div>
    </header>
  );
};
