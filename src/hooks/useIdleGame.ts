import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, UpgradeId, QuantumAnomaly, AnomalyType } from '../types/game';
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
  cryoFreezeRemaining: 0,
  frenzyRemaining: 0,
  activeAnomaly: null,
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
  const comboCountRef = useRef<number>(0);
  comboCountRef.current = comboCount;
  const lastClickTimeRef = useRef<number>(0);

  const lastAnomalySpawnTimeRef = useRef<number>(performance.now() - 13000);
  const nextAnomalyDelayRef = useRef<number>(16000);

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

        // Buff 1: Cryo Freeze countdown (khóa nhiệt 0%)
        if (state.cryoFreezeRemaining > 0) {
          state.cryoFreezeRemaining = Math.max(0, state.cryoFreezeRemaining - delta);
          state.heat = 0;
          stateChanged = true;
        }

        // Buff 2: Frenzy countdown (x5 Joules)
        if (state.frenzyRemaining > 0) {
          state.frenzyRemaining = Math.max(0, state.frenzyRemaining - delta);
          stateChanged = true;
        }

        // 1. Passive Auto Generation (JPS)
        let jps = calculateJPS(state.upgrades, state.isOverdrive);
        if (state.frenzyRemaining > 0) {
          jps *= 5; // X5 JPS khi đang Frenzy
        }
        if (jps > 0) {
          const earned = jps * delta;
          const wasInDebt = state.joules < 0;
          state.joules += earned;
          
          // Chỉ tích lũy năng lượng tiến hóa khi đã sạch nợ
          let addedToTotal = 0;
          if (wasInDebt) {
            if (state.joules > 0) {
              addedToTotal = state.joules;
            }
          } else {
            addedToTotal = earned;
          }
          state.totalJoulesEarned += addedToTotal;
          stateChanged = true;

          // Nếu Drone cày trả hết sạch nợ
          if (wasInDebt && state.joules >= 0) {
            soundSynth.playDebtCleared();
            setSystemLog('✨ TUYỆT VỜI! Drones đã cày trả sạch nợ năng lượng! Hệ thống mở khóa hoàn toàn!');
          }
        }

        // 2. Cooling heat decay
        if (state.heat > 0 && !state.isOverdrive && state.cryoFreezeRemaining <= 0) {
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

        // 5. Check Phase Evolutions (TUYỆT ĐỐI KHÔNG LÊN CẤP KHI ĐANG NỢ - PHẢI SẠCH NỢ VÍ >= 0)
        const currentThreshold = EVOLUTION_PHASES[state.currentPhase - 1]?.threshold || 1000;
        if (state.joules >= 0 && state.currentPhase < 5 && state.totalJoulesEarned >= currentThreshold) {
          state.currentPhase += 1;
          stateChanged = true;
          const newPhase = EVOLUTION_PHASES[state.currentPhase - 1];
          soundSynth.playAscension();
          setSystemLog(`TIẾN HÓA LÕI THÀNH CÔNG: Chào mừng tới Cấp ${state.currentPhase} - ${newPhase.name}!`);

          if (state.currentPhase === 5) {
            state.hasWon = true;
          }
        }

        // 6. Dị Thường Lượng Tử (Quantum Anomaly Movement & Spawning)
        if (state.activeAnomaly) {
          const anom = { ...state.activeAnomaly };
          anom.timeLeft -= delta;
          anom.x += anom.vx * delta;
          anom.y += anom.vy * delta;

          // Phản xạ bật nảy trong buồng phản ứng
          if (anom.x <= 8) {
            anom.x = 8;
            anom.vx = Math.abs(anom.vx);
          } else if (anom.x >= 88) {
            anom.x = 88;
            anom.vx = -Math.abs(anom.vx);
          }

          if (anom.y <= 14) {
            anom.y = 14;
            anom.vy = Math.abs(anom.vy);
          } else if (anom.y >= 78) {
            anom.y = 78;
            anom.vy = -Math.abs(anom.vy);
          }

          if (anom.timeLeft <= 0) {
            state.activeAnomaly = null;
            lastAnomalySpawnTimeRef.current = now;
            nextAnomalyDelayRef.current = 16000 + Math.random() * 9000;
          } else {
            state.activeAnomaly = anom;
          }
          stateChanged = true;
        } else {
          if (now - lastAnomalySpawnTimeRef.current > nextAnomalyDelayRef.current) {
            lastAnomalySpawnTimeRef.current = now;
            nextAnomalyDelayRef.current = 18000 + Math.random() * 8000;

            const rand = Math.random();
            const type: AnomalyType = rand < 0.45 ? 'surge' : rand < 0.75 ? 'freeze' : 'frenzy';
            const startFromLeft = Math.random() < 0.5;
            const startX = startFromLeft ? 10 : 85;
            const startY = 20 + Math.random() * 50;
            const speedX = (startFromLeft ? 1 : -1) * (6 + Math.random() * 5);
            const speedY = (Math.random() < 0.5 ? 1 : -1) * (4 + Math.random() * 5);

            state.activeAnomaly = {
              id: `anomaly_${Date.now()}`,
              type,
              x: startX,
              y: startY,
              vx: speedX,
              vy: speedY,
              timeLeft: 9.0,
              totalDuration: 9.0
            };
            soundSynth.playAnomalySpawn();
            stateChanged = true;
          }
        }

        return stateChanged ? state : prev;
      });

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, []);

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
      let finalMultiplier = (isCrit ? critStats.multiplier : 1.0) * comboBonusMultiplier;
      if (state.frenzyRemaining > 0) {
        finalMultiplier *= 5; // Frenzy x5!
      }
      const earned = Math.round(baseJPC * finalMultiplier);

      // ── CHECK XEM CÓ BỊ PHÁT NỔ 100% NHIỆT ĐỘ KHÔNG ──
      const nextPotentialHeat = state.cryoFreezeRemaining > 0
        ? 0
        : state.heat + (state.isOverdrive ? 0 : 6.5);
      const isMeltdownTriggered = !state.isOverdrive && state.cryoFreezeRemaining <= 0 && nextPotentialHeat >= 100;

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
      } else if (state.frenzyRemaining > 0) {
        textToDisplay = `FRENZY x5! +${earned}`;
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
        state.isOverdrive || state.frenzyRemaining > 0,
        state.joules < 0 ? '#ff2a5f' : state.frenzyRemaining > 0 ? '#c084fc' : currentPhaseInfo.accentHex
      );

      // Update state
      setGameState(prev => {
        const nextHeat = prev.cryoFreezeRemaining > 0
          ? 0
          : Math.min(100, prev.heat + (prev.isOverdrive ? 0 : 6.5));
        const wasInDebt = prev.joules < 0;
        const newJoules = prev.joules + earned;

        // Chỉ tích lũy năng lượng tiến hóa vào totalJoulesEarned khi đã sạch nợ
        let addedToTotal = 0;
        if (wasInDebt) {
          if (newJoules > 0) {
            addedToTotal = newJoules; // Phần thặng dư vượt mốc 0
          }
        } else {
          addedToTotal = earned;
        }

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
          totalJoulesEarned: prev.totalJoulesEarned + addedToTotal,
          totalClicks: prev.totalClicks + 1,
          heat: nextHeat
        };
      });
    },
    [canvasRef, comboCount]
  );

  // Handle Anomaly Click (Bắt quả cầu Dị Thường)
  const handleAnomalyClick = useCallback(
    (id: string, clientX?: number, clientY?: number) => {
      const state = stateRef.current;
      if (!state.activeAnomaly || state.activeAnomaly.id !== id) return;

      const anom = state.activeAnomaly;
      soundSynth.playAnomalyCollect(anom.type);

      if (clientX && clientY) {
        canvasRef.current?.emitClick(
          clientX,
          clientY,
          anom.type === 'surge'
            ? 'KHO BÁU LƯỢNG TỬ!'
            : anom.type === 'freeze'
            ? 'ĐÓNG BĂNG TUYỆT ĐỐI!'
            : 'FRENZY x5!',
          true,
          true,
          anom.type === 'surge' ? '#ffd700' : anom.type === 'freeze' ? '#38bdf8' : '#c084fc'
        );
      }

      setGameState(prev => {
        const next = { ...prev, activeAnomaly: null };
        if (anom.type === 'surge') {
          const baseJPC = calculateJPC(prev.upgrades, prev.isOverdrive);
          const jps = calculateJPS(prev.upgrades, prev.isOverdrive);
          const surgeBonus = Math.max(120, Math.round((jps * 25 + baseJPC * 35) * Math.max(1, prev.currentPhase)));
          next.joules += surgeBonus;
          if (prev.joules >= 0) {
            next.totalJoulesEarned += surgeBonus;
          } else if (next.joules > 0) {
            next.totalJoulesEarned += next.joules;
          }
          setSystemLog(`🌟 BẮT ĐƯỢC DỊ THƯỜNG! Nhận ngay kho báu +${formatJoules(surgeBonus)} Joules!`);
        } else if (anom.type === 'freeze') {
          next.cryoFreezeRemaining = 8.5;
          next.heat = 0;
          setSystemLog('❄️ BẮT ĐƯỢC DỊ THƯỜNG BĂNG TUYẾT! Đóng băng nhiệt độ 0% trong 8.5s! Spam click tẹt ga!');
        } else if (anom.type === 'frenzy') {
          next.frenzyRemaining = 10.0;
          setSystemLog('⚡ BẮT ĐƯỢC DỊ THƯỜNG CUỒNG PHỘ! X5 toàn bộ năng lượng Click & Drones trong 10s!');
        }
        return next;
      });
    },
    [canvasRef]
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
    handleAnomalyClick,
    buyUpgrade,
    toggleMute,
    resetGame
  };
}
