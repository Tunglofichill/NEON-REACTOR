import React, { useEffect, useState, useRef } from 'react';
import { GameState } from '../types/game';
import { Bot, Radio, Sparkles } from 'lucide-react';

interface AIAssistantCompanionProps {
  gameState: GameState;
  comboCount: number;
}

const DIALOGUES = {
  welcome: [
    'Chào sếp! KIVA-OS đã sẵn sàng đồng hành cùng sếp giật Top 1 Game Sprint 2026!',
    'Hệ thống lượng tử trực tuyến. Nhấp chuột vào Lõi để bắt đầu giải phóng Joules!'
  ],
  danger100: [
    'Á á sếp ơiiii! Nhiệt độ sắp 100% rồi, dừng tay hoặc bấm XẢ TẢN NHIỆT ngay kẻo NỔ BANH LÕI!',
    'BÁO ĐỘNG ĐỎ! Đừng cố ấn lên 100% sếp ơi, nổ là bị phạt ÂM TIỀN cày ốm đòn đấy!',
    'NGUY HIỂM CỰC ĐỘ! Lõi đang đỏ rực như than hồng, xả Cryo-Vent cứu trạm mau!'
  ],
  debt: [
    'Đã can rồi mà sếp vẫn cố bấm cho nổ! Giờ trạm ôm nợ ngập đầu, mau cày trả nợ đi sếp!',
    'Ví đang bị ÂM Joules kìa sếp ơi! Mỗi cú click của sếp giờ là tia hy vọng trả nợ đấy!',
    'Không sao sếp ơi! Em với đàn Drone sẽ cày cùng sếp, trả hết nợ là hệ thống lại mở bung lụa ngay!'
  ],
  meltdownJustHappened: [
    'BÙM CHÍU! Nổ banh xác pháo luôn sếp ơiii! May mà vỏ trạm còn nguyên!',
    'Thảm họa hạt nhân cấp 5! Tiền phạt bay màu thẳng vào nợ xấu luôn rồi!',
  ],
  combo: [
    'Căn nhịp chuẩn đét! Nhịp sóng hài đang đồng điệu cực đỉnh!',
    'Combo x{N}! Đôi tay vàng trong làng kích nổ plasma!',
    'FEVER MODE! Giữ vững nhịp điệu này là năng lượng bùng nổ cấp số nhân!'
  ],
  overheat: [
    'Cảnh báo nhiệt độ (≥85%)! Lõi đang nóng, bấm ngay nút XẢ TẢN NHIỆT để lấy Overdrive x3!',
    'Nhiệt độ chạm ngưỡng đỏ rồi sếp ơi! Cơ hội vàng kích hoạt Siêu Dẫn x3 đấy!'
  ],
  overdrive: [
    'SIÊU DẪN OVERDRIVE ĐANG CHẠY! Click liên hoàn cước đi sếp ơi, x3 sản lượng!',
    'Năng lượng đang phi mã! Tranh thủ thời gian buff mà bứt phá mốc tiếp theo!'
  ],
  idle: [
    'Bầy Drone đang cày ngày cày đêm, sản lượng tự động vẫn tăng đều đều nha sếp!',
    'Cứ thong thả sếp ơi, cơ chế Idle của KIVA vận hành chuẩn chỉ từng mili-giây!'
  ],
  phaseEvolved: [
    'CHÚC MỪNG SẾP! Lõi đã tiến hóa lên cấp độ mới, hào quang rực rỡ luôn!',
    'Tiến trình đã sang trang mới! Chạm tới Lỗ Đen Lượng Tử không còn xa nữa!'
  ]
};

export const AIAssistantCompanion: React.FC<AIAssistantCompanionProps> = ({
  gameState,
  comboCount
}) => {
  const [currentLine, setCurrentLine] = useState<string>(
    'Chào sếp! KIVA-OS v2.6 đã online. Chúc anh em mình giật Top 1 Game Sprint!'
  );

  const lastMeltdownCountRef = useRef<number>(gameState.meltdownCount || 0);
  const lastPhaseRef = useRef<number>(gameState.currentPhase);
  const wasInDebtRef = useRef<boolean>(gameState.joules < 0);
  const wasDanger100Ref = useRef<boolean>(gameState.heat >= 90 && !gameState.isOverdrive);
  const wasOverdriveRef = useRef<boolean>(gameState.isOverdrive);
  const lastMilestoneComboRef = useRef<number>(0);
  const lastSpokenTimeRef = useRef<number>(Date.now());

  const speak = (line: string, force: boolean = false) => {
    const now = Date.now();
    // Bắt buộc cách nhau ít nhất 6.5s trừ khi là sự kiện khẩn cấp đặc biệt (force = true)
    if (!force && now - lastSpokenTimeRef.current < 6500) {
      return;
    }
    lastSpokenTimeRef.current = now;
    setCurrentLine(line);
  };

  // 1. Phản ứng với các sự kiện chuyển đổi trạng thái tức thời (State Transitions)
  useEffect(() => {
    const currentMeltdown = gameState.meltdownCount || 0;
    const isNowInDebt = gameState.joules < 0;
    const isNowDanger100 = gameState.heat >= 90 && !gameState.isOverdrive;
    const isNowOverdrive = gameState.isOverdrive;
    const currentPhase = gameState.currentPhase;

    // Sự kiện 1: Vừa nổ Meltdown xong (Ưu tiên số 1)
    if (currentMeltdown > lastMeltdownCountRef.current) {
      lastMeltdownCountRef.current = currentMeltdown;
      const line = DIALOGUES.meltdownJustHappened[Math.floor(Math.random() * DIALOGUES.meltdownJustHappened.length)];
      speak(line, true);
      return;
    }

    // Sự kiện 2: Vừa rơi vào trạng thái nợ âm tiền
    if (isNowInDebt && !wasInDebtRef.current) {
      wasInDebtRef.current = true;
      const line = DIALOGUES.debt[Math.floor(Math.random() * DIALOGUES.debt.length)];
      speak(line, true);
      return;
    }
    if (!isNowInDebt) {
      wasInDebtRef.current = false;
    }

    // Sự kiện 3: Vừa chạm ngưỡng nguy hiểm 90% (sắp nổ)
    if (isNowDanger100 && !wasDanger100Ref.current) {
      wasDanger100Ref.current = true;
      const line = DIALOGUES.danger100[Math.floor(Math.random() * DIALOGUES.danger100.length)];
      speak(line, true);
      return;
    }
    if (!isNowDanger100) {
      wasDanger100Ref.current = false;
    }

    // Sự kiện 4: Vừa kích hoạt Siêu Dẫn Overdrive
    if (isNowOverdrive && !wasOverdriveRef.current) {
      wasOverdriveRef.current = true;
      const line = DIALOGUES.overdrive[Math.floor(Math.random() * DIALOGUES.overdrive.length)];
      speak(line, true);
      return;
    }
    if (!isNowOverdrive) {
      wasOverdriveRef.current = false;
    }

    // Sự kiện 5: Lõi vừa tiến hóa sang Phase mới
    if (currentPhase > lastPhaseRef.current) {
      lastPhaseRef.current = currentPhase;
      const line = DIALOGUES.phaseEvolved[Math.floor(Math.random() * DIALOGUES.phaseEvolved.length)];
      speak(line, true);
      return;
    }
    if (currentPhase < lastPhaseRef.current) {
      // Khi bị nổ tụt về phase 1
      lastPhaseRef.current = currentPhase;
    }

    // Sự kiện 6: Combo đạt các mốc ấn tượng (5, 10, 15, 20)
    if (comboCount >= 5 && Math.floor(comboCount / 5) > Math.floor(lastMilestoneComboRef.current / 5)) {
      lastMilestoneComboRef.current = comboCount;
      const line = DIALOGUES.combo[Math.floor(Math.random() * DIALOGUES.combo.length)].replace('{N}', comboCount.toString());
      speak(line, false);
      return;
    }
    if (comboCount === 0) {
      lastMilestoneComboRef.current = 0;
    }
  }, [gameState.meltdownCount, gameState.currentPhase, gameState.isOverdrive, gameState.joules < 0, gameState.heat >= 90, comboCount]);

  // 2. Định kỳ nói câu trò chuyện mỗi 9 - 11 giây tùy theo bối cảnh thực tế (không spam)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastSpokenTimeRef.current < 8000) return;

      if (gameState.joules < 0) {
        // Đang cày trả nợ
        const line = DIALOGUES.debt[Math.floor(Math.random() * DIALOGUES.debt.length)];
        speak(line);
      } else if (gameState.heat >= 90 && !gameState.isOverdrive) {
        // Đang kẹt ở nhiệt cao
        const line = DIALOGUES.danger100[Math.floor(Math.random() * DIALOGUES.danger100.length)];
        speak(line);
      } else if (gameState.heat >= 85 && !gameState.isOverdrive) {
        // Sẵn sàng xả overdrive
        const line = DIALOGUES.overheat[Math.floor(Math.random() * DIALOGUES.overheat.length)];
        speak(line);
      } else if (gameState.isOverdrive) {
        // Đang trong chu kỳ siêu dẫn
        const line = DIALOGUES.overdrive[Math.floor(Math.random() * DIALOGUES.overdrive.length)];
        speak(line);
      } else if (comboCount < 2) {
        // Bình thường thảnh thơi
        const line = DIALOGUES.idle[Math.floor(Math.random() * DIALOGUES.idle.length)];
        speak(line);
      }
    }, 9000);

    return () => clearInterval(interval);
  }, [gameState.joules < 0, gameState.heat >= 90, gameState.heat >= 85, gameState.isOverdrive, comboCount]);

  return (
    <div className="w-full bg-black/70 border border-cyber-border rounded-xl p-2.5 flex items-center gap-3 backdrop-blur-md relative overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.1)]">
      {/* Background Subtle Scanner */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/5 via-transparent to-cyber-purple/5 pointer-events-none" />

      {/* Hologram AI Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-lg bg-cyber-panel border border-cyber-cyan flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.4)] relative">
          <Bot className="w-6 h-6 text-cyber-cyan animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
        </div>
      </div>

      {/* Speech Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-orbitron font-bold text-[10px] text-cyber-cyan tracking-wider flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 text-cyber-cyan animate-pulse" />
            KIVA-OS // KERNEL v2.6
          </span>
          <span className="text-[9px] px-1 py-0.2 rounded bg-cyber-purple/20 text-purple-300 border border-purple-500/30 flex items-center gap-0.5">
            <Sparkles className="w-2 h-2" /> AI CO-PILOT
          </span>
          {gameState.isOverdrive && (
            <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse font-bold">
              ⚡ OVERDRIVE
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-200 font-sans leading-tight tracking-wide transition-all duration-300 line-clamp-2">
          {currentLine}
        </p>
      </div>
    </div>
  );
};
