import React, { useState } from 'react';
import { GameState, GameSettings, ScreenShakeLevel, ParticleQualityLevel } from '../types/game';
import { EVOLUTION_PHASES } from '../data/gameConstants';
import { formatJoules, formatSeconds } from '../utils/formatters';
import { soundSynth } from '../engine/audio/SoundSynth';
import {
  X,
  Play,
  BookOpen,
  Settings,
  Info,
  Volume2,
  VolumeX,
  Music,
  Zap,
  Flame,
  Snowflake,
  ShieldAlert,
  Sparkles,
  RotateCcw,
  ExternalLink,
  Award,
  Cpu,
  Keyboard,
  Vibrate,
  Sliders
} from 'lucide-react';

interface MainMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetGame: () => void;
  initialTab?: 'overview' | 'manual' | 'settings' | 'credits';
}

type MenuTab = 'overview' | 'manual' | 'settings' | 'credits';

export const MainMenuModal: React.FC<MainMenuModalProps> = ({
  isOpen,
  onClose,
  gameState,
  settings,
  onUpdateSettings,
  onResetGame,
  initialTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState<MenuTab>(initialTab);
  const currentPhaseInfo = EVOLUTION_PHASES[gameState.currentPhase - 1];

  if (!isOpen) return null;

  const handleTabChange = (tab: MenuTab) => {
    soundSynth.playMenuTab();
    setActiveTab(tab);
  };

  const handleClose = () => {
    soundSynth.playMenuClose();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-xl animate-fade-in select-none">
      {/* Outer Sci-Fi Container */}
      <div
        className="relative w-full max-w-4xl h-[90vh] max-h-[720px] rounded-2xl border flex flex-col overflow-hidden shadow-[0_0_80px_rgba(0,240,255,0.25)]"
        style={{
          background: 'linear-gradient(145deg, rgba(8,14,28,0.98) 0%, rgba(3,7,18,0.99) 100%)',
          borderColor: `${currentPhaseInfo.accentHex}60`
        }}
      >
        {/* Top glowing accent line */}
        <div
          className="w-full h-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${currentPhaseInfo.accentHex}, transparent)`,
            boxShadow: `0 0 12px ${currentPhaseInfo.accentHex}`
          }}
        />

        {/* ── MODAL HEADER ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-black/40">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg"
              style={{
                borderColor: `${currentPhaseInfo.accentHex}80`,
                background: `${currentPhaseInfo.accentHex}18`,
                boxShadow: `0 0 15px ${currentPhaseInfo.accentHex}40`
              }}
            >
              <Zap className="w-5 h-5 animate-pulse" style={{ color: currentPhaseInfo.accentHex }} />
            </div>
            <div>
              <h2 className="font-orbitron font-black text-base md:text-lg tracking-wider text-slate-100 flex items-center gap-2">
                NEON REACTOR
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/40 bg-cyan-950/60 text-cyan-300">
                  SYSTEM HUB
                </span>
              </h2>
              <p className="text-[10px] font-mono text-slate-400">
                Thiết kế & Phát triển bởi <span className="text-amber-400 font-bold">Seki and Kiva</span> • Pawfolio Studio ✨
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs font-mono group cursor-pointer"
          >
            <span>ĐÓNG</span>
            <span className="text-[9px] text-slate-500 group-hover:text-slate-400">[ESC]</span>
            <X className="w-4 h-4 ml-0.5 text-slate-400 group-hover:text-red-400" />
          </button>
        </div>

        {/* ── TAB NAVIGATION BAR ── */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-black/60 border-b border-slate-800/80 overflow-x-auto">
          {[
            { id: 'overview', label: 'TỔNG QUAN', icon: Play },
            { id: 'manual', label: 'HƯỚNG DẪN CHƠI', icon: BookOpen },
            { id: 'settings', label: 'CÀI ĐẶT HỆ THỐNG', icon: Settings },
            { id: 'credits', label: 'ĐỘI THI & CREDITS', icon: Info }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as MenuTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron font-bold text-xs tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
                style={
                  isActive
                    ? {
                        borderColor: currentPhaseInfo.accentHex,
                        background: `${currentPhaseInfo.accentHex}20`,
                        color: currentPhaseInfo.accentHex,
                        boxShadow: `0 0 15px ${currentPhaseInfo.accentHex}30`
                      }
                    : {}
                }
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── MAIN MODAL CONTENT BODY ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200">
          {/* ════════ TAB 1: TỔNG QUAN (OVERVIEW) ════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Core Status Hero Card */}
              <div
                className="relative rounded-2xl border p-5 flex flex-col md:flex-row items-center gap-6 overflow-hidden"
                style={{
                  background: 'radial-gradient(ellipse at top left, rgba(0,240,255,0.08) 0%, rgba(2,6,18,0.85) 100%)',
                  borderColor: `${currentPhaseInfo.accentHex}50`
                }}
              >
                {/* Thumbnail Lõi tròn xoe */}
                <div
                  className="relative w-28 h-28 rounded-full flex-shrink-0 flex items-center justify-center border-2 overflow-hidden shadow-2xl"
                  style={{
                    borderColor: currentPhaseInfo.accentHex,
                    boxShadow: `0 0 30px ${currentPhaseInfo.accentHex}60`
                  }}
                >
                  <img
                    src={currentPhaseInfo.image}
                    alt={currentPhaseInfo.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Core Status Info */}
                <div className="flex-1 text-center md:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-purple-500/50 bg-purple-950/50 text-purple-300">
                      CẤP ĐỘ {gameState.currentPhase} / 5
                    </span>
                    <span
                      className="font-orbitron font-black text-xs tracking-wider"
                      style={{ color: currentPhaseInfo.accentHex }}
                    >
                      {currentPhaseInfo.name.toUpperCase()}
                    </span>
                    {gameState.joules < 0 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950 border border-red-500 text-red-300 animate-pulse">
                        ĐANG NỢ NĂNG LƯỢNG
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    {currentPhaseInfo.description}
                  </p>

                  {/* 3 Live Mini Telemetry Blocks */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="p-2.5 rounded-xl border border-slate-800 bg-black/60">
                      <span className="text-[9px] text-slate-500 font-mono uppercase block">Năng Lượng</span>
                      <strong
                        className="font-orbitron text-sm"
                        style={{ color: gameState.joules < 0 ? '#ff2a5f' : currentPhaseInfo.accentHex }}
                      >
                        {formatJoules(gameState.joules)}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl border border-slate-800 bg-black/60">
                      <span className="text-[9px] text-slate-500 font-mono uppercase block">Thời Gian Chạy</span>
                      <strong className="font-orbitron text-sm text-amber-400">
                        {formatSeconds(gameState.speedrunSeconds)}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl border border-slate-800 bg-black/60">
                      <span className="text-[9px] text-slate-500 font-mono uppercase block">Số Lần Nổ Lõi</span>
                      <strong className="font-orbitron text-sm text-red-400">
                        {gameState.meltdownCount || 0} LẦN
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phím tắt bàn phím (Keyboard Shortcuts Reference) */}
              <div className="rounded-xl border border-slate-800 bg-black/50 p-4 space-y-3">
                <h4 className="font-orbitron font-bold text-xs text-slate-300 flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-cyan-400" />
                  BẢNG PHÍM TẮT ĐIỀU KHIỂN NHANH (HOTKEYS)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Nhấp Lõi:</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">Space</kbd>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Sạc Mega-Beam:</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold border border-slate-700">Hold Mouse</kbd>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Xả Tản Nhiệt:</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-bold border border-slate-700">X / C</kbd>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Mua Nâng Cấp:</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-bold border border-slate-700">1, 2, 3, 4</kbd>
                  </div>
                </div>
              </div>

              {/* Big Resume Play Button */}
              <button
                onClick={handleClose}
                className="w-full py-3.5 rounded-xl font-orbitron font-black text-sm tracking-widest flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer hover:brightness-110 active:scale-98 shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${currentPhaseInfo.accentHex}, #0077b6)`,
                  boxShadow: `0 0 25px ${currentPhaseInfo.accentHex}50`,
                  color: '#ffffff'
                }}
              >
                <Play className="w-4 h-4 fill-white" />
                TIẾP TỤC VẬN HÀNH TRẠM (RESUME)
              </button>
            </div>
          )}

          {/* ════════ TAB 2: HƯỚNG DẪN CHƠI (VISUAL FIELD MANUAL) ════════ */}
          {activeTab === 'manual' && (
            <div className="space-y-4 animate-fade-in font-mono text-xs">
              {/* Header Banner */}
              <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-black border border-cyan-500/30 flex items-center justify-between">
                <span className="font-orbitron font-bold text-cyan-300 text-xs flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  CẨM NANG VẬN HÀNH TRẠM • 5 CƠ CHẾ CỐT LÕI (VISUAL CODEX)
                </span>
                <span className="text-[10px] text-slate-400">Hình ảnh chụp thực tế in-game</span>
              </div>

              {/* Card 1: Khai thác năng lượng & Nhịp sóng hài */}
              <div className="p-3.5 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-black/70 to-black/90 flex flex-col md:flex-row items-center gap-4 shadow-lg group">
                <div className="relative w-full md:w-52 h-32 rounded-xl overflow-hidden border border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.2)] flex-shrink-0 bg-black">
                  <img
                    src="/assets/manual/manual_1_core_click.png"
                    alt="Khai thác Lõi & Nhịp sóng hài"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/85 border border-cyan-400/60 text-[8px] font-orbitron font-bold text-cyan-300">
                    IN-GAME TELEMETRY
                  </div>
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 font-orbitron font-bold text-cyan-300 text-sm">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    1. KHAI THÁC JOULES & NHỊP SÓNG HÀI (RESONANCE)
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px] leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-bold shrink-0">▸ Thao tác:</span>
                      <span>Nhấp chuột vào Lõi hoặc gõ phím <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">Space</kbd> để tạo Joules điện tích.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold shrink-0">▸ Canh nhịp:</span>
                      <span>Click đúng nhịp thở Lõi (Resonance Pulse) để nhận <strong>CRIT ×3</strong> & cộng dồn chuỗi <strong>COMBO Streak</strong>!</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold shrink-0">▸ Drones:</span>
                      <span>Nâng cấp Subatomic Drones để tự động cày Joules/giây (JPS) ngay cả khi treo máy.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 2: Hold-to-Charge Mega-Beam */}
              <div className="p-3.5 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-black/70 to-black/90 flex flex-col md:flex-row items-center gap-4 shadow-lg group">
                <div className="relative w-full md:w-52 h-32 rounded-xl overflow-hidden border border-amber-500/50 shadow-[0_0_15px_rgba(255,183,3,0.2)] flex-shrink-0 bg-black">
                  <img
                    src="/assets/manual/manual_2_megabeam.png"
                    alt="Sạc tụ Arc Gauge Sweetspot"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/85 border border-amber-400/60 text-[8px] font-orbitron font-bold text-amber-300">
                    SWEETSPOT GAUGE
                  </div>
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 font-orbitron font-bold text-amber-300 text-sm">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    2. ẤN & GIỮ SẠC (HOLD-TO-CHARGE) → MEGA-BEAM ×10
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px] leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold shrink-0">▸ Sạc tụ:</span>
                      <span>Ấn & giữ chuột trên Lõi (&gt;180ms). Vòng tròn Arc Gauge sẽ nạp từ 0% đến 100%.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-300 font-bold shrink-0">🔥 Vạch Vàng (75% - 92%):</span>
                      <span>Nhả chuột đúng vạch vàng để bắn <strong>MEGA-BEAM ×10 JOULES</strong> và <strong>hạ -15% nhiệt</strong>!</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold shrink-0">⚠️ Đoản mạch:</span>
                      <span>Giữ quá 100% (&gt;1.75s) sẽ nổ tụ điện nội bộ, bị phạt <strong>+22% nhiệt độ</strong>!</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 3: Bẫy quá nhiệt & Overdrive */}
              <div className="p-3.5 rounded-2xl border border-red-500/40 bg-gradient-to-br from-red-950/20 via-black/70 to-black/90 flex flex-col md:flex-row items-center gap-4 shadow-lg group">
                <div className="relative w-full md:w-52 h-32 rounded-xl overflow-hidden border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] flex-shrink-0 bg-black">
                  <img
                    src="/assets/manual/manual_3_heat_overdrive.png"
                    alt="Bẫy quá nhiệt 85% và nút xả tản nhiệt"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/85 border border-red-400/60 text-[8px] font-orbitron font-bold text-red-300">
                    CRITICAL HEAT ≥85%
                  </div>
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 font-orbitron font-bold text-red-400 text-sm">
                    <Flame className="w-4 h-4 text-red-400" />
                    3. BẪY QUÁ NHIỆT & SIÊU DẪN OVERDRIVE ×3
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px] leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-sky-300 font-bold shrink-0">⚡ Xả Tản Nhiệt:</span>
                      <span>Khi nhiệt đạt <strong>≥ 85%</strong>, bấm nút Xả để đưa nhiệt về 0% và nhận <strong>OVERDRIVE ×3 SẢN LƯỢNG</strong>!</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-400 font-bold shrink-0">💥 Thảm Họa Nổ 100%:</span>
                      <span>Chạm 100% Lõi sẽ nổ tung, <strong>tụt cấp về Phase 1</strong> và <strong>bị phạt âm tiền (nợ năng lượng)</strong>!</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold shrink-0">🔒 Khóa Tiến Hóa:</span>
                      <span>Bắt buộc cày trả hết nợ (ví ≥ 0) mới được mở khóa tiếp tục tiến hóa!</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 4: 3 Loại bóng dị thường */}
              <div className="p-3.5 rounded-2xl border border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-black/70 to-black/90 flex flex-col md:flex-row items-center gap-4 shadow-lg group">
                <div className="relative w-full md:w-52 h-32 rounded-xl overflow-hidden border border-purple-500/50 shadow-[0_0_15px_rgba(192,132,252,0.2)] flex-shrink-0 bg-black">
                  <img
                    src="/assets/manual/manual_4_quantum_anomaly.png"
                    alt="3 loại bóng dị thường lượng tử"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/85 border border-purple-400/60 text-[8px] font-orbitron font-bold text-purple-300">
                    ANOMALY ORBS
                  </div>
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 font-orbitron font-bold text-purple-300 text-sm">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    4. BÓNG DỊ THƯỜNG LƯỢNG TỬ (QUANTUM ANOMALIES)
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px] leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-300 font-bold shrink-0">🟡 Kho Báu J:</span>
                      <span>Bóng vàng bay bồng bềnh $\to$ Nhấp để nhận ngay khoản Joules kho báu khổng lồ.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-sky-300 font-bold shrink-0">🔵 Đóng Băng Tuyệt Đối:</span>
                      <span>Bóng xanh $\to$ Khóa nhiệt độ <strong>0% trong 8.5s</strong> (thoải mái spam click không sợ nóng).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-purple-300 font-bold shrink-0">🟣 Cuồng Nộ Frenzy:</span>
                      <span>Bóng tím $\to$ <strong>Nhân ×5</strong> toàn bộ sản lượng Click & Drones trong 10 giây!</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 5: Anti-Autoclick Heuristics */}
              <div className="p-3.5 rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-950/20 via-black/70 to-black/90 flex flex-col md:flex-row items-center gap-4 shadow-lg group">
                <div className="relative w-full md:w-52 h-32 rounded-xl overflow-hidden border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)] flex-shrink-0 bg-black">
                  <img
                    src="/assets/manual/manual_5_anti_autoclick.png"
                    alt="Lồng ngắt mạch Anti-Autoclick"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/85 border border-rose-400/60 text-[8px] font-orbitron font-bold text-rose-300">
                    ANTI-BOT LOCKOUT
                  </div>
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 font-orbitron font-bold text-rose-400 text-sm">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    5. AN NINH BẢO VỆ CHỐNG BOT (ANTI-AUTOCLICK)
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px] leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold shrink-0">🛡️ Cảm biến Heuristics:</span>
                      <span>Phát hiện nhấp chuột &gt;16 CPS hoặc nhịp bấm quá đều đặn như máy móc.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-300 font-bold shrink-0">🔒 Ngắt Mạch 3.5s:</span>
                      <span>Lõi chuyển sang lồng EMP đỏ cam, ngắt cảm ứng 3.5 giây để bảo vệ tụ điện.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 font-bold shrink-0">💡 Lời khuyên:</span>
                      <span>Hãy chơi bằng kỹ năng và nhịp điệu của một kỹ sư chân chính!</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ════════ TAB 3: CÀI ĐẶT HỆ THỐNG (SETTINGS) ════════ */}
          {activeTab === 'settings' && (
            <div className="space-y-5 animate-fade-in font-mono text-xs">
              {/* Audio Settings Group */}
              <div className="p-4 rounded-xl border border-slate-800 bg-black/60 space-y-4">
                <h4 className="font-orbitron font-bold text-xs text-slate-300 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  ÂM THANH & HIỆU ỨNG (AUDIO ENGINE)
                </h4>

                {/* BGM Volume Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-300">
                      <Music className="w-4 h-4 text-cyan-400" />
                      Nhạc Nền Retro Synthwave (BGM)
                    </span>
                    <button
                      onClick={() => {
                        soundSynth.playSettingToggle();
                        onUpdateSettings({ isBgmMuted: !settings.isBgmMuted });
                      }}
                      className="px-2.5 py-1 rounded border border-slate-700 bg-slate-800 text-[11px] font-bold cursor-pointer"
                    >
                      {settings.isBgmMuted ? 'ĐANG TẮT' : 'ĐANG BẬT'}
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.isBgmMuted ? 0 : settings.bgmVolume}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        onUpdateSettings({ bgmVolume: val, isBgmMuted: val === 0 });
                      }}
                      className="flex-1 accent-cyan-400 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                    />
                    <span className="font-orbitron w-12 text-right text-cyan-300 font-bold">
                      {settings.isBgmMuted ? '0%' : `${settings.bgmVolume}%`}
                    </span>
                  </div>
                </div>

                {/* SFX Volume Slider */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-300">
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      Hiệu Ứng Âm Thanh SFX (Click, Laser, Sạc, Còi)
                    </span>
                    <button
                      onClick={() => {
                        soundSynth.playSettingToggle();
                        onUpdateSettings({ isSfxMuted: !settings.isSfxMuted });
                      }}
                      className="px-2.5 py-1 rounded border border-slate-700 bg-slate-800 text-[11px] font-bold cursor-pointer"
                    >
                      {settings.isSfxMuted ? 'ĐANG TẮT' : 'ĐANG BẬT'}
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.isSfxMuted ? 0 : settings.sfxVolume}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        onUpdateSettings({ sfxVolume: val, isSfxMuted: val === 0 });
                      }}
                      className="flex-1 accent-amber-400 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                    />
                    <span className="font-orbitron w-12 text-right text-amber-300 font-bold">
                      {settings.isSfxMuted ? '0%' : `${settings.sfxVolume}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual & Haptic Settings Group */}
              <div className="p-4 rounded-xl border border-slate-800 bg-black/60 space-y-4">
                <h4 className="font-orbitron font-bold text-xs text-slate-300 flex items-center gap-2">
                  <Vibrate className="w-4 h-4 text-purple-400" />
                  ĐỒ HỌA & RUNG MÀN HÌNH (VISUAL & HAPTIC)
                </h4>

                {/* Screen Shake Setting */}
                <div className="space-y-2">
                  <span className="text-slate-300 block">Cường Độ Rung Màn Hình (Screen Shake)</span>
                  <div className="grid grid-cols-4 gap-2">
                    {(['off', 'low', 'normal', 'high'] as ScreenShakeLevel[]).map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => {
                          soundSynth.playSettingToggle();
                          onUpdateSettings({ screenShake: lvl });
                        }}
                        className={`py-1.5 rounded border text-[11px] font-orbitron font-bold uppercase transition-all cursor-pointer ${
                          settings.screenShake === lvl
                            ? 'border-purple-500 bg-purple-950/70 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {lvl === 'off' ? 'Tắt' : lvl === 'low' ? 'Nhẹ' : lvl === 'normal' ? 'Chuẩn' : 'Mạnh'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Particle Quality */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-slate-300 block">Chất Lượng Hiệu Ứng Hạt (Particle Quality)</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['low', 'high'] as ParticleQualityLevel[]).map(qual => (
                      <button
                        key={qual}
                        onClick={() => {
                          soundSynth.playSettingToggle();
                          onUpdateSettings({ particleQuality: qual });
                        }}
                        className={`py-1.5 rounded border text-[11px] font-orbitron font-bold uppercase transition-all cursor-pointer ${
                          settings.particleQuality === qual
                            ? 'border-cyan-500 bg-cyan-950/70 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {qual === 'low' ? 'Tiết Kiệm Pin' : 'Tối Đa 60FPS'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Danger Zone: Reset Data */}
              <div className="p-4 rounded-xl border border-red-900/60 bg-red-950/20 space-y-3">
                <h4 className="font-orbitron font-bold text-xs text-red-400 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-red-400" />
                  VÙNG NGUY HIỂM (DANGER ZONE)
                </h4>
                <p className="text-slate-400 text-[11px]">
                  Thiết lập lại toàn bộ tiến trình Lõi về mốc ban đầu (Xóa sạch Joules, Cấp độ và Nâng cấp).
                </p>
                <button
                  onClick={() => {
                    handleClose();
                    onResetGame();
                  }}
                  className="px-4 py-2 rounded-lg border border-red-500/80 bg-red-950 hover:bg-red-900 text-red-200 font-bold transition-all text-xs cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  KHỞI TẠO LẠI TIẾN TRÌNH TRẠM
                </button>
              </div>
            </div>
          )}

          {/* ════════ TAB 4: ĐỘI THI & CREDITS ════════ */}
          {activeTab === 'credits' && (
            <div className="space-y-5 animate-fade-in font-mono text-xs">
              {/* Studio & Team Card */}
              <div
                className="p-5 rounded-2xl border space-y-4 text-center md:text-left"
                style={{
                  background: 'radial-gradient(ellipse at top right, rgba(255,183,3,0.08) 0%, rgba(2,6,18,0.9) 100%)',
                  borderColor: 'rgba(255,183,3,0.4)'
                }}
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <div>
                    <h3 className="font-orbitron font-black text-lg text-amber-300 tracking-wider">
                      NEON REACTOR: QUANTUM OVERDRIVE
                    </h3>
                    <p className="text-slate-400 text-xs">
                      Sản phẩm tham dự cuộc thi <strong>FPT Polytechnic Game Sprint 2026</strong>
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full border border-amber-400/50 bg-amber-950/60 text-amber-300 font-bold text-[11px]">
                    BUILD v1.2.0
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-black/60 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">Trưởng Nhóm / Game Designer</span>
                    <strong className="text-slate-100 font-bold text-sm block">Seki (Nhật Tùng - PH58350)</strong>
                    <p className="text-[11px] text-slate-400">Kiến trúc Gameplay, Cân bằng Game Balance, UI/UX Neon Cyberpunk.</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-black/60 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">AI Co-Pilot / Trợ Lý Kỹ Thuật</span>
                    <strong className="text-cyan-300 font-bold text-sm block">Cu Em Kiva (KIVA-OS)</strong>
                    <p className="text-[11px] text-slate-400">Thuật toán Web Audio Synth, Heuristic Anti-Autoclick, 60FPS Canvas Engine.</p>
                  </div>
                </div>

                {/* Studio Credit Badge trỏ về link Pawfolio Studio chính thức */}
                <div className="p-4 rounded-xl border border-amber-400/40 bg-amber-950/20 flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                    <div>
                      <span className="text-xs text-slate-300 block">Dự án trực thuộc & bảo trợ bởi:</span>
                      <strong className="text-sm font-orbitron font-bold text-amber-300">Pawfolio Studio ✨</strong>
                    </div>
                  </div>
                  <a
                    href="https://pawfoliostudio.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-amber-400/60 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-bold transition-all text-xs cursor-pointer group"
                  >
                    <span>Website Studio</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Tech Stack Info */}
              <div className="p-4 rounded-xl border border-slate-800 bg-black/50 space-y-2">
                <h4 className="font-orbitron font-bold text-xs text-slate-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  CÔNG NGHỆ SỬ DỤNG
                </h4>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  {['React 19', 'TypeScript', 'Tailwind CSS v4', 'Web Audio API Synth', 'HTML5 Canvas 2D 60FPS', 'Vite', 'Lucide Icons'].map(t => (
                    <span key={t} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── MODAL FOOTER ── */}
        <div className="px-6 py-3 border-t border-slate-800/80 bg-black/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>NEON REACTOR © 2026 • SEKI & KIVA</span>
          <span className="flex items-center gap-1 text-slate-400">
            Trực thuộc <a href="https://pawfoliostudio.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Pawfolio Studio ✨</a>
          </span>
        </div>
      </div>
    </div>
  );
};
