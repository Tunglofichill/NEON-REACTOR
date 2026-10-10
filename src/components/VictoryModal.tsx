import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameState } from '../types/game';
import { formatSeconds, formatJoules } from '../utils/formatters';
import { Trophy, Clock, MousePointer, Zap, RotateCcw, X } from 'lucide-react';

interface VictoryModalProps {
  gameState: GameState;
  onClose: () => void;
  onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  gameState,
  onClose,
  onRestart
}) => {
  useEffect(() => {
    // Launch celebratory confetti burst
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#00f0ff', '#ffaa00', '#b026ff', '#ffffff', '#ff2a55'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
      <div className="relative w-full max-w-lg cyber-panel p-6 md:p-8 rounded-2xl border-2 border-cyber-cyan shadow-[0_0_50px_rgba(0,240,255,0.4)] flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Victory Trophy Icon */}
        <div className="w-16 h-16 rounded-full bg-cyber-cyan/20 border-2 border-cyber-cyan flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,240,255,0.6)] animate-bounce">
          <Trophy className="w-8 h-8 text-cyber-cyan" />
        </div>

        {/* Title */}
        <h2 className="font-orbitron font-black text-xl md:text-2xl text-slate-100 tracking-wider">
          THỨC TỈNH LÕI LƯỢNG TỬ!
        </h2>
        <p className="text-xs md:text-sm text-cyber-cyan font-mono mt-1">
          Cổng Siêu Không Gian Đã Mở - Nhiệm Vụ Hoàn Thành Xuất Sắc
        </p>

        {/* Singularity Core Visual */}
        <div className="my-5 w-32 h-32 rounded-full overflow-hidden border-2 border-white shadow-[0_0_25px_rgba(255,255,255,0.8)] animate-[spin_30s_linear_infinite]">
          <img
            src="/assets/cores/core_phase5_singularity.jpg"
            alt="Singularity Void"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Metrics Grid */}
        <div className="w-full grid grid-cols-3 gap-2.5 my-3">
          <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 flex flex-col items-center">
            <Clock className="w-4 h-4 text-cyber-amber mb-1" />
            <span className="text-[10px] text-slate-400">Thời Gian</span>
            <span className="font-orbitron font-bold text-sm text-amber-400">
              {formatSeconds(gameState.speedrunSeconds)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 flex flex-col items-center">
            <MousePointer className="w-4 h-4 text-cyber-cyan mb-1" />
            <span className="text-[10px] text-slate-400">Tổng Cú Click</span>
            <span className="font-orbitron font-bold text-sm text-cyber-cyan">
              {gameState.totalClicks.toLocaleString()}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 flex flex-col items-center">
            <Zap className="w-4 h-4 text-purple-400 mb-1" />
            <span className="text-[10px] text-slate-400">Tổng Joules</span>
            <span className="font-orbitron font-bold text-sm text-purple-400">
              {formatJoules(gameState.totalJoulesEarned)}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 font-sans my-3 leading-relaxed">
          Chúc mừng bạn đã hoàn thành trọn vẹn thử thách của <strong>Game Sprint 2026</strong>! Bạn có thể tiếp tục chơi để overclock vô tận hoặc thử thách lại thành tích speedrun!
        </p>

        {/* Action Buttons */}
        <div className="w-full flex items-center gap-3 mt-2">
          <button
            onClick={onRestart}
            className="flex-1 py-2.5 px-4 rounded-xl font-orbitron font-bold text-xs bg-slate-900 border border-slate-700 hover:border-red-400 text-slate-300 hover:text-red-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            CHƠI LẠI TỪ ĐẦU
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl font-orbitron font-bold text-xs bg-cyber-cyan text-black hover:bg-white shadow-[0_0_15px_rgba(0,240,255,0.6)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            TIẾP TỤC CHƠI VÔ TẬN
          </button>
        </div>

        {/* Pawfolio Studio Credit */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 w-full flex items-center justify-center">
          <a
            href="https://pawfoliostudio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-slate-500 hover:text-cyan-400 transition-colors font-mono"
          >
            ✨ Thiết kế & Phát triển bởi Pawfolio Studio
          </a>
        </div>
      </div>
    </div>
  );
};
