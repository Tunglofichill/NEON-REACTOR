import React from 'react';
import { Terminal, Activity } from 'lucide-react';

interface NotificationTickerProps {
  message: string;
}

export const NotificationTicker: React.FC<NotificationTickerProps> = ({ message }) => {
  return (
    <footer className="w-full h-9 flex items-center justify-between px-4 gap-3 z-20 border-t" style={{ background: 'rgba(0,0,0,0.92)', borderColor: 'rgba(0,240,255,0.12)', backdropFilter: 'blur(16px)' }}>
      {/* Left: System log */}
      <div className="flex items-center gap-2 overflow-hidden flex-1">
        <Terminal className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
        <span className="text-[10px] font-bold text-cyan-400 flex-shrink-0 font-orbitron tracking-wider">SYS:</span>
        <span className="text-[11px] text-slate-300 truncate font-mono tracking-wide">{message}</span>
        <span className="inline-block w-1.5 h-3 bg-cyan-400 animate-pulse ml-0.5 flex-shrink-0" />
      </div>

      {/* Right: Status indicators */}
      <div className="hidden md:flex items-center gap-4 text-[9px] font-mono flex-shrink-0">
        <span className="flex items-center gap-1 text-emerald-400">
          <Activity className="w-3 h-3" />
          60 FPS
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-500">STATUS: ONLINE</span>
        <a
          href="https://pawfoliostudio.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold"
        >
          ✨ PAWFOLIO STUDIO
        </a>
      </div>
    </footer>
  );
};
