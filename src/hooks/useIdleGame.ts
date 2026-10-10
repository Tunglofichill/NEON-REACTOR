import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, UpgradeId } from '../types/game';
import {
  calculateUpgradeCost,
  calculateJPC,
  calculateJPS,
  calculateCoolingRate,
  calculateOverdriveDuration,
  calculateCritStats
} from '../utils/gameCalculations';
import {
  EVOLUTION_PHASES,
  RESONANCE_PERIOD_SEC
} from '../data/gameConstants';
import { formatJoules } from '../utils/formatters';
import { soundSynth } from '../engine/audio/SoundSynth';
import { retroBGM } from '../engine/audio/RetroSynthwaveBGM';
import { ParticleCanvasHandle } from '../engine/renderers/ParticleCanvas';

const SAVE_KEY = 'neon_reactor_quantum_save_v1';

const INITIAL_STATE: GameState = {
  joules: 0,
  totalJoulesEarned: 0,
  totalClicks: 0,
  heat: 0,
  isOverdrive: false,
  overdriveTimeRemaining: 0,
  upgrades: {
    plasmaLaser: 0,
    cryoJets: 0,
    subatomicDrones: 0,
    harmonicStabilizer: 0
  },
  currentPhase: 1,
  hasWon: false,
  speedrunSeconds: 0,
  isMuted: false,
  meltdownCount: 0,
  lastMeltdownPenalty: 0
};

export function useIdleGame(canvasRef: React.RefObject<ParticleCanvasHandle>) {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          upgrades: { ...INITIAL_STATE.upgrades, ...(parsed.upgrades || {}) }
        };
      }
    } catch {
      // fallback
    }
    return INITIAL_STATE;
  });

  const [comboCount, setComboCount] = useState<number>(0);
  const lastClickTimeRef = useRef<number>(0);

  const [systemLog, setSystemLog] = useState<string>(
    'Trạm Phản Ứng Lượng Tử đã kích hoạt. Hãy nhấp chuột vào Lõi để bắt đầu khai thác Joules!'
  );

  const stateRef = useRef<GameState>(gameState);
  stateRef.current = gameState;

  // Auto-save to LocalStorage
  useEffect(() => {
    const saveTimer = setInterval(() => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(stateRef.current));
      } catch {
        // silent
      }
    }, 3000);
    return () => clearInterval(saveTimer);
  }, []);

  // Main Delta-Time Game Loop (60 FPS requestAnimationFrame)
  useEffect(() => {
    let lastTime = performance.now();
    let animationId: number;

    const tick = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.25);
      lastTime = now;

      // Reset combo if player paused clicking for > 1.8 seconds
      if (now - lastClickTimeRef.current > 1800 && comboCount > 0) {
        setComboCount(0);
      }

      setGameState(prev => {
        const state = { ...prev };
        let stateChanged = false;

        // 1. Passive Auto Generation (JPS)
        const jps = calculateJPS(state.upgrades, state.isOverdrive);
        if (jps > 0) {
          const earned = jps * delta;
          const wasInDebt = state.joules < 0;
          state.joules += earned;
          state.totalJoulesEarned += earned;
          stateChanged = true;

          // Nếu Drone cày trả hết sạch nợ
          if (wasInDebt && state.joules >= 0) {
            soundSynth.playDebtCleared();
            setSystemLog('✨ TUYỆT VỜI! Drones đã cày trả sạch nợ năng lượng! Hệ thống mở khóa hoàn toàn!');
          }
        }

        // 2. Cooling heat decay
        if (state.heat > 0 && !state.isOverdrive) {
          const coolingRate = calculateCoolingRate(state.upgrades);
          const effectiveCooling = state.heat >= 85 ? coolingRate * 0.35 : coolingRate;
          state.heat = Math.max(0, state.heat - effectiveCooling * delta);
          stateChanged = true;
        }

        // 3. Overdrive countdown
        if (state.isOverdrive) {
          state.overdriveTimeRemaining -= delta;
          stateChanged = true;
          if (state.overdriveTimeRemaining <= 0) {
            state.isOverdrive = false;
            state.overdriveTimeRemaining = 0;
            retroBGM.setOverdrive(false);
            setSystemLog('Chu kỳ Siêu Dẫn đã kết thúc. Lõi trở lại công suất danh định.');
          }
        }

        // 4. Speedrun timer
        if (!state.hasWon) {
          state.speedrunSeconds += delta;
        }

        // 5. Check Phase Evolutions
        const currentThreshold = EVOLUTION_PHASES[state.currentPhase - 1]?.threshold || 1000;
        if (state.currentPhase < 5 && state.totalJoulesEarned >= currentThreshold) {
          state.currentPhase += 1;
          stateChanged = true;
          const newPhase = EVOLUTION_PHASES[state.currentPhase - 1];
          soundSynth.playAscension();
          setSystemLog(`TIẾN HÓA LÕI THÀNH CÔNG: Chào mừng tới Cấp ${state.currentPhase} - ${newPhase.name}!`);

          if (state.currentPhase === 5) {
            state.hasWon = true;
          }
        }

        return stateChanged ? state : prev;
      });

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [comboCount]);

  // Handle Manual Click on Core
  const handleCoreClick = useCallback(
    (clientX: number, clientY: number) => {
      soundSynth.startAmbient();
      retroBGM.start();

      lastClickTimeRef.current = performance.now();

      const state = stateRef.current;
      const baseJPC = calculateJPC(state.upgrades, state.isOverdrive);
      const critStats = calculateCritStats(state.upgrades);

      // Check Resonance Timing
      const nowSec = performance.now() / 1000;
      const cyclePos = (nowSec % RESONANCE_PERIOD_SEC) / RESONANCE_PERIOD_SEC;
      const isTimingSweetspot = cyclePos < 0.14 || cyclePos > 0.86;
      const isRandomCrit = Math.random() < critStats.chance;
      const isCrit = isTimingSweetspot || isRandomCrit;

      // Update Combo Streak
      let nextCombo = comboCount;
      if (isTimingSweetspot) {
        nextCombo = Math.min(20, comboCount + 1);
        setComboCount(nextCombo);
      }

      const comboBonusMultiplier = 1 + nextCombo * 0.08;
      const finalMultiplier = (isCrit ? critStats.multiplier : 1.0) * comboBonusMultiplier;
      const earned = Math.round(baseJPC * finalMultiplier);

      // ── CHECK XEM CÓ BỊ PHÁT NỔ 100% NHIỆT ĐỘ KHÔNG ──
      const nextPotentialHeat = state.heat + (state.isOverdrive ? 0 : 6.5);
      const isMeltdownTriggered = !state.isOverdrive && nextPotentialHeat >= 100;

      if (isMeltdownTriggered) {
        // 💥 KÍCH HOẠT THẢM HỌA PHÁT NỔ LÕI
        soundSynth.playMeltdown();
        canvasRef.current?.emitMeltdown(clientX, clientY);
        retroBGM.setOverdrive(false);
        setComboCount(0);

        const nextMeltdownCount = (state.meltdownCount || 0) + 1;
        const phaseScale = Math.pow(3.0, state.currentPhase - 1);
        const basePenalty = Math.round((320 + nextMeltdownCount * 280) * phaseScale);
        const walletDamage = state.joules > 0 ? Math.round(state.joules * 0.85) : 0;
        const totalPenalty = basePenalty + walletDamage;
        const resultingJoules = state.joules - totalPenalty;

        setGameState(prev => ({
          ...prev,
          heat: 0,
          currentPhase: 1,
          totalJoulesEarned: 0,
          hasWon: false,
          isOverdrive: false,
          overdriveTimeRemaining: 0,
          meltdownCount: nextMeltdownCount,
          lastMeltdownPenalty: totalPenalty,
          joules: resultingJoules,
          totalClicks: prev.totalClicks + 1
        }));

        setSystemLog(
          `💥 THẢM HỌA CẤP 5: LÕI PHÁT NỔ 100%! TỤT CẤP VỀ PHASE 1 (PLASMA CORE)! Phạt ${formatJoules(totalPenalty)}. ${
            resultingJoules < 0 ? `VÍ BỊ ÂM ${formatJoules(resultingJoules)}! CÀY TRẢ NỢ VÀ TÍCH LŨY LẠI ĐỂ TIẾN HÓA!` : 'Đã ổn định lại trạm!'
          }`
        );
        return;
      }

      // Audio feedback
      if (isCrit) {
        soundSynth.playCrit();
      } else if (nextPotentialHeat >= 92) {
        soundSynth.playOverheatCritical();
      } else {
        const pitch = 0.9 + Math.min(0.6, (state.heat / 100) * 0.6);
        soundSynth.playClick(pitch);
      }

      // Visual particles & floating text
      const currentPhaseInfo = EVOLUTION_PHASES[state.currentPhase - 1];
      let textToDisplay = `+${earned}`;
      if (state.joules < 0) {
        textToDisplay = `TRẢ NỢ +${earned}`;
      } else if (nextCombo >= 3 && isCrit) {
        textToDisplay = `COMBO x${nextCombo}! +${earned}`;
      } else if (isCrit) {
        textToDisplay = `CRIT x${critStats.multiplier} +${earned}`;
      } else if (state.isOverdrive) {
        textToDisplay = `OVERDRIVE +${earned}`;
      }

      canvasRef.current?.emitClick(
        clientX,
        clientY,
        textToDisplay,
        isCrit,
        state.isOverdrive,
        state.joules < 0 ? '#ff2a5f' : currentPhaseInfo.accentHex
      );

      // Update state
      setGameState(prev => {
        const nextHeat = Math.min(100, prev.heat + (prev.isOverdrive ? 0 : 6.5));
        const wasInDebt = prev.joules < 0;
        const newJoules = prev.joules + earned;

        if (wasInDebt && newJoules >= 0) {
          soundSynth.playDebtCleared();
          setSystemLog('✨ TUYỆT VỜI! Đã cày trả hết sạch nợ năng lượng! Lõi trở lại trạng thái danh định!');
        } else if (nextHeat >= 92) {
          setSystemLog(`⚠️ CỰC KỲ NGUY CẤP (${Math.round(nextHeat)}%)! CỐ TÌNH CHẠM 100% SẼ NỔ LÕI VÀ ÂM TIỀN ĐẤY!`);
        } else if (nextHeat >= 85 && prev.heat < 85) {
          soundSynth.playOverheatWarning();
          setSystemLog('CẢNH BÁO QUÁ NHIỆT (>=85%)! Kích hoạt ngay XẢ TẢN NHIỆT kẻo NỔ LÕI!');
        }

        return {
          ...prev,
          joules: newJoules,
          totalJoulesEarned: prev.totalJoulesEarned + earned,
          totalClicks: prev.totalClicks + 1,
          heat: nextHeat
        };
      });
    },
    [canvasRef, comboCount]
  );

  // Handle Cryo Vent Overdrive activation
  const handleCryoVent = useCallback(() => {
    const state = stateRef.current;
    if (state.heat < 85 || state.isOverdrive) return;

    soundSynth.playCryoVent();
    retroBGM.setOverdrive(true);
    canvasRef.current?.triggerScreenShake(9);

    const duration = calculateOverdriveDuration(state.upgrades);
    setGameState(prev => ({
      ...prev,
      heat: 0,
      isOverdrive: true,
      overdriveTimeRemaining: duration
    }));

    setSystemLog(`SIÊU DẪN OVERDRIVE ĐÃ KÍCH HOẠT! Sản lượng tăng x3 trong ${duration.toFixed(1)} giây!`);
  }, [canvasRef]);

  // Handle Upgrade Purchase
  const buyUpgrade = useCallback((id: UpgradeId) => {
    const state = stateRef.current;
    const cost = calculateUpgradeCost(id, state.upgrades[id] || 0);

    if (state.joules < cost) return;

    soundSynth.playUpgrade();
    setGameState(prev => {
      const currentLvl = prev.upgrades[id] || 0;
      return {
        ...prev,
        joules: prev.joules - cost,
        upgrades: {
          ...prev.upgrades,
          [id]: currentLvl + 1
        }
      };
    });

    setSystemLog(`Đã nâng cấp ${id} lên Cấp ${(state.upgrades[id] || 0) + 1}!`);
  }, []);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    setGameState(prev => {
      const nextMuted = !prev.isMuted;
      soundSynth.setMuted(nextMuted);
      retroBGM.setMuted(nextMuted);
      return { ...prev, isMuted: nextMuted };
    });
  }, []);

  // Reset Game
  const resetGame = useCallback(() => {
    if (window.confirm('Bạn có chắc chắn muốn thiết lập lại toàn bộ tiến trình Lõi Lượng Tử không?')) {
      localStorage.removeItem(SAVE_KEY);
      setGameState(INITIAL_STATE);
      setComboCount(0);
      retroBGM.setOverdrive(false);
      setSystemLog('Hệ thống Lõi đã được khởi tạo lại về trạng thái xuất phát.');
    }
  }, []);

  return {
    gameState,
    comboCount,
    systemLog,
    handleCoreClick,
    handleCryoVent,
    buyUpgrade,
    toggleMute,
    resetGame
  };
}
