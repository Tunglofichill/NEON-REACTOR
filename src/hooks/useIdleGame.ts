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

  // ── ANTI-AUTOCLICK PROTECTION SYSTEM ──
  interface ClickRecord {
    time: number;
    x: number;
    y: number;
  }
  const clickHistoryRef = useRef<ClickRecord[]>([]);
  const antiBotLockedUntilRef = useRef<number>(0);
  const [isAntiBotLocked, setIsAntiBotLocked] = useState<boolean>(false);
  const [antiBotTimeLeft, setAntiBotTimeLeft] = useState<number>(0);

  // ── HOLD-TO-CHARGE MEGA-BEAM SYSTEM ──
  const [chargeProgress, setChargeProgress] = useState<number>(0); // 0 to 100
  const chargeProgressRef = useRef<number>(0);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isMegaBeamFiring, setIsMegaBeamFiring] = useState<boolean>(false);
  const chargeHoldStartRef = useRef<number | null>(null);
  const chargeHoldPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const chargeActiveRef = useRef<boolean>(false);

  const lastAnomalySpawnTimeRef = useRef<number>(performance.now() - 13000);
  const nextAnomalyDelayRef = useRef<number>(16000);

  const [systemLog, setSystemLog] = useState<string>(
    'Trạm Phản Ứng Lượng Tử đã kích hoạt. Nhấp chuột hoặc Giữ sạc tia Mega-Beam để khai thác Joules!'
  );

  const stateRef = useRef<GameState>(gameState);
  stateRef.current = gameState;

  // Thuật toán phát hiện Auto-clicker / Macro Bot
  const checkAntiAutoclick = useCallback((clientX: number, clientY: number, now: number): boolean => {
    if (now < antiBotLockedUntilRef.current) return true;

    // Lọc click trong 1200ms gần nhất
    const history = clickHistoryRef.current.filter(c => now - c.time <= 1200);
    history.push({ time: now, x: clientX, y: clientY });
    clickHistoryRef.current = history;

    let isBotDetected = false;
    let botReason = '';

    // 1. Tần số bất khả thi (Rate limit > 16 clicks/giây)
    if (history.length >= 17) {
      isBotDetected = true;
      botReason = `Tần số nhấp vượt ngưỡng con người (${history.length} CPS)`;
    }
    // 2. Robot Uniformity (Khoảng cách thời gian đều đặn bất thường, sigma < 3.2ms)
    else if (history.length >= 7) {
      const recent = history.slice(-7);
      const intervals: number[] = [];
      for (let i = 1; i < recent.length; i++) {
        intervals.push(recent[i].time - recent[i - 1].time);
      }
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);

      if (avg < 90 && stdDev < 3.2) {
        isBotDetected = true;
        botReason = `Nhịp click đều đặn bất thường (độ lệch chuẩn ${stdDev.toFixed(2)}ms)`;
      }
    }
    // 3. Synthetic Pixel Coordinates (Trùng tọa độ tuyệt đối liên tục ở tốc độ cao)
    if (!isBotDetected && history.length >= 8) {
      const recent = history.slice(-8);
      const first = recent[0];
      const allSameCoord = recent.every(
        c => Math.abs(c.x - first.x) < 0.5 && Math.abs(c.y - first.y) < 0.5
      );
      const intervals: number[] = [];
      for (let i = 1; i < recent.length; i++) {
        intervals.push(recent[i].time - recent[i - 1].time);
      }
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;

      if (allSameCoord && avg < 80) {
        isBotDetected = true;
        botReason = 'Tọa độ click trùng khớp tuyệt đối ở tần số cao';
      }
    }

    if (isBotDetected) {
      antiBotLockedUntilRef.current = now + 3500;
      setIsAntiBotLocked(true);
      setAntiBotTimeLeft(3.5);
      chargeHoldStartRef.current = null;
      chargeActiveRef.current = false;
      setIsCharging(false);
      setChargeProgress(0);
      chargeProgressRef.current = 0;

      soundSynth.stopChargeHum();
      soundSynth.playAntiAutoclick();
      canvasRef.current?.emitClick(clientX, clientY, '⚠️ NGẮT MẠCH ANTI-AUTOCLICK!', true, false, '#f43f5e');
      setSystemLog(`⚠️ BẢO MẬT HỆ THỐNG: ${botReason}! Khóa ngắt mạch Lõi trong 3.5 giây để bảo vệ tụ điện!`);
      return true;
    }

    return false;
  }, [canvasRef]);

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

      // Cập nhật trạng thái Anti-Autoclick Lockout
      if (antiBotLockedUntilRef.current > now) {
        setIsAntiBotLocked(true);
        setAntiBotTimeLeft(Math.max(0, (antiBotLockedUntilRef.current - now) / 1000));
      } else if (antiBotLockedUntilRef.current > 0) {
        antiBotLockedUntilRef.current = 0;
        setIsAntiBotLocked(false);
        setAntiBotTimeLeft(0);
      }

      // Cập nhật tiến trình Sạc tụ (Hold-to-Charge)
      if (chargeHoldStartRef.current !== null && antiBotLockedUntilRef.current <= now) {
        const holdDuration = now - chargeHoldStartRef.current;
        if (holdDuration >= 180) {
          if (!chargeActiveRef.current) {
            chargeActiveRef.current = true;
            setIsCharging(true);
            soundSynth.startChargeHum();
          }
          // Sạc từ 180ms đến 1500ms (1320ms để đạt 100%)
          const progress = Math.min(100, ((holdDuration - 180) / 1320) * 100);
          chargeProgressRef.current = progress;
          setChargeProgress(progress);

          // Xử lý nổ tụ đoản mạch do sạc quá thời gian (> 1750ms)
          if (holdDuration >= 1750) {
            const pos = { ...chargeHoldPosRef.current };
            chargeHoldStartRef.current = null;
            chargeActiveRef.current = false;
            setIsCharging(false);
            setChargeProgress(0);
            chargeProgressRef.current = 0;
            soundSynth.stopChargeHum();
            soundSynth.playOverchargeFault();
            canvasRef.current?.triggerScreenShake(10);
            canvasRef.current?.emitClick(pos.x, pos.y, '⚡ ĐOẢN MẠCH SẠC! +22% NHIỆT', true, false, '#f43f5e');

            setGameState(prev => {
              const nextHeat = prev.cryoFreezeRemaining > 0 ? 0 : Math.min(100, prev.heat + 22);
              if (nextHeat >= 100 && prev.cryoFreezeRemaining <= 0 && !prev.isOverdrive) {
                soundSynth.playMeltdown();
                canvasRef.current?.emitMeltdown(pos.x, pos.y);
                const nextMeltdownCount = (prev.meltdownCount || 0) + 1;
                const phaseScale = Math.pow(3.0, prev.currentPhase - 1);
                const basePenalty = Math.round((320 + nextMeltdownCount * 280) * phaseScale);
                const walletDamage = prev.joules > 0 ? Math.round(prev.joules * 0.85) : 0;
                const totalPenalty = basePenalty + walletDamage;
                const resultingJoules = prev.joules - totalPenalty;
                setSystemLog(`💥 ĐOẢN MẠCH GÂY NỔ 100%! Lõi sụp đổ về Phase 1! Phạt ${formatJoules(totalPenalty)}!`);
                return {
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
                };
              }
              return {
                ...prev,
                heat: nextHeat,
                totalClicks: prev.totalClicks + 1
              };
            });
            setSystemLog('⚡ ĐOẢN MẠCH SẠC TỤ! Giữ quá lâu làm phóng điện nội bộ, nhiệt độ tăng vọt +22%!');
          }
        }
      }

      // Reset combo if player paused clicking for > 1.8 seconds
      if (now - lastClickTimeRef.current > 1800 && comboCountRef.current > 0) {
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

  // Pointer Down trên Core (bắt đầu tính click / sạc tụ)
  const handleCorePointerDown = useCallback(
    (clientX: number, clientY: number) => {
      const now = performance.now();
      if (now < antiBotLockedUntilRef.current) return;
      if (checkAntiAutoclick(clientX, clientY, now)) return;

      soundSynth.startAmbient();
      retroBGM.start();

      chargeHoldStartRef.current = now;
      chargeHoldPosRef.current = { x: clientX, y: clientY };
      chargeActiveRef.current = false;
    },
    [checkAntiAutoclick]
  );

  // Pointer Up trên Core (xác định Click thường hay Bắn Mega-Beam)
  const handleCorePointerUp = useCallback(
    (clientX: number, clientY: number) => {
      const now = performance.now();
      if (now < antiBotLockedUntilRef.current) return;

      const start = chargeHoldStartRef.current;
      if (start === null) return;

      const holdDuration = now - start;
      const wasCharging = chargeActiveRef.current;
      const progress = chargeProgressRef.current;

      // Dọn dẹp trạng thái giữ chuột
      chargeHoldStartRef.current = null;
      chargeActiveRef.current = false;
      setIsCharging(false);
      setChargeProgress(0);
      chargeProgressRef.current = 0;
      soundSynth.stopChargeHum();

      // Trường hợp 1: Nhấp chuột nhanh (< 180ms) -> Thực hiện Click tay thông thường
      if (!wasCharging && holdDuration < 180) {
        handleCoreClick(clientX, clientY);
        return;
      }

      // Trường hợp 2: Đã vào trạng thái Sạc Tụ (Hold-to-Charge)
      const state = stateRef.current;
      const baseJPC = calculateJPC(state.upgrades, state.isOverdrive);
      const critStats = calculateCritStats(state.upgrades);
      const frenzyMult = state.frenzyRemaining > 0 ? 5 : 1;
      const comboMult = 1 + comboCountRef.current * 0.08;

      // 2A. SWEETSPOT (75% - 92%): BẮN MEGA-BEAM X10!
      if (progress >= 75 && progress <= 92) {
        soundSynth.playMegaBeamFire();
        canvasRef.current?.triggerScreenShake(14);

        const megaMultiplier = 10.0 * critStats.multiplier * comboMult * frenzyMult;
        const earned = Math.round(baseJPC * megaMultiplier);

        setIsMegaBeamFiring(true);
        setTimeout(() => setIsMegaBeamFiring(false), 450);

        canvasRef.current?.emitClick(
          clientX,
          clientY,
          `💥 MEGA-BEAM x10! +${formatJoules(earned)}`,
          true,
          true,
          '#00f0ff'
        );

        setGameState(prev => {
          const wasInDebt = prev.joules < 0;
          const newJoules = prev.joules + earned;
          const addedToTotal = wasInDebt ? (newJoules > 0 ? newJoules : 0) : earned;
          const nextHeat = Math.max(0, prev.heat - 15); // Giảm nhiệt 15%

          if (wasInDebt && newJoules >= 0) {
            soundSynth.playDebtCleared();
            setSystemLog('✨ TUYỆT VỜI! Mega-Beam đã thổi bay sạch nợ năng lượng! Trạm mở khóa hoàn toàn!');
          }

          return {
            ...prev,
            joules: newJoules,
            totalJoulesEarned: prev.totalJoulesEarned + addedToTotal,
            totalClicks: prev.totalClicks + 1,
            heat: nextHeat
          };
        });

        setSystemLog(`⚡ PHÓNG CHÙM TIA MEGA-BEAM THÀNH CÔNG! Năng lượng x10 (+${formatJoules(earned)} J), giải nhiệt hạ -15%!`);
        return;
      }

      // 2B. NHẢ NON (< 75%): XẢ XUNG ÁP THẤP
      if (progress < 75) {
        const ratio = Math.max(0.2, progress / 75);
        const earned = Math.round(baseJPC * (1 + ratio * 1.5) * frenzyMult);

        soundSynth.playClick(1.3);
        canvasRef.current?.emitClick(
          clientX,
          clientY,
          `XẢ XUNG +${formatJoules(earned)}`,
          false,
          false,
          '#38bdf8'
        );

        setGameState(prev => {
          const wasInDebt = prev.joules < 0;
          const newJoules = prev.joules + earned;
          const addedToTotal = wasInDebt ? (newJoules > 0 ? newJoules : 0) : earned;
          const nextHeat = prev.cryoFreezeRemaining > 0 ? 0 : Math.min(100, prev.heat + 3);

          return {
            ...prev,
            joules: newJoules,
            totalJoulesEarned: prev.totalJoulesEarned + addedToTotal,
            totalClicks: prev.totalClicks + 1,
            heat: nextHeat
          };
        });

        setSystemLog(`Xả xung áp non (${Math.round(progress)}%): Thu được +${formatJoules(earned)} Joules.`);
        return;
      }

      // 2C. NHẢ TRỄ (> 92% nhưng chưa quá 100%): XUNG ÁP QUÁ TẢI
      if (progress > 92) {
        const earned = Math.round(baseJPC * 3.5 * frenzyMult);

        soundSynth.playClick(0.6);
        canvasRef.current?.triggerScreenShake(6);
        canvasRef.current?.emitClick(
          clientX,
          clientY,
          `XUNG ÁP TRỄ +${formatJoules(earned)} (+10% NHIỆT)`,
          false,
          false,
          '#fbbf24'
        );

        setGameState(prev => {
          const wasInDebt = prev.joules < 0;
          const newJoules = prev.joules + earned;
          const addedToTotal = wasInDebt ? (newJoules > 0 ? newJoules : 0) : earned;
          const nextHeat = prev.cryoFreezeRemaining > 0 ? 0 : Math.min(100, prev.heat + 10);

          return {
            ...prev,
            joules: newJoules,
            totalJoulesEarned: prev.totalJoulesEarned + addedToTotal,
            totalClicks: prev.totalClicks + 1,
            heat: nextHeat
          };
        });

        setSystemLog(`Xung áp quá ngưỡng (${Math.round(progress)}%): Thu được +${formatJoules(earned)} Joules nhưng nhiệt tăng +10%!`);
      }
    },
    [canvasRef, handleCoreClick]
  );

  const handleCorePointerLeave = useCallback(() => {
    if (chargeHoldStartRef.current !== null) {
      handleCorePointerUp(chargeHoldPosRef.current.x, chargeHoldPosRef.current.y);
    }
  }, [handleCorePointerUp]);

  return {
    gameState,
    comboCount,
    systemLog,
    isAntiBotLocked,
    antiBotTimeLeft,
    chargeProgress,
    isCharging,
    isMegaBeamFiring,
    handleCoreClick,
    handleCorePointerDown,
    handleCorePointerUp,
    handleCorePointerLeave,
    handleCryoVent,
    handleAnomalyClick,
    buyUpgrade,
    toggleMute,
    resetGame
  };
}
