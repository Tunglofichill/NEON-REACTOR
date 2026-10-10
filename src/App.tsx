import { useRef, useState, useEffect } from 'react';
import { useIdleGame } from './hooks/useIdleGame';
import { HeaderHUD } from './components/HeaderHUD';
import { ReactorView } from './components/ReactorView';
import { UpgradePanel } from './components/UpgradePanel';
import { NotificationTicker } from './components/NotificationTicker';
import { VictoryModal } from './components/VictoryModal';
import { MainMenuModal } from './components/MainMenuModal';
import { ParticleCanvas, ParticleCanvasHandle } from './engine/renderers/ParticleCanvas';
import { EVOLUTION_PHASES, UPGRADE_CONFIGS } from './data/gameConstants';
import { GameSettings } from './types/game';
import { soundSynth } from './engine/audio/SoundSynth';
import { retroBGM } from './engine/audio/RetroSynthwaveBGM';

const SETTINGS_KEY = 'neon_reactor_settings_v1';
const DEFAULT_SETTINGS: GameSettings = {
  bgmVolume: 60,
  sfxVolume: 80,
  isBgmMuted: false,
  isSfxMuted: false,
  screenShake: 'normal',
  particleQuality: 'high'
};

export function App() {
  const particleCanvasRef = useRef<ParticleCanvasHandle>(null);

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuInitialTab, setMenuInitialTab] = useState<'overview' | 'manual' | 'settings' | 'credits'>('overview');

  const {
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
  } = useIdleGame(particleCanvasRef);

  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [hasShownVictory, setHasShownVictory] = useState(false);

  // Mở Menu
  const handleOpenMenu = (tab: 'overview' | 'manual' | 'settings' | 'credits' = 'overview') => {
    soundSynth.playMenuOpen();
    setMenuInitialTab(tab);
    setIsMenuOpen(true);
  };

  // Cập nhật Cài đặt
  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      if (newSettings.bgmVolume !== undefined || newSettings.isBgmMuted !== undefined) {
        retroBGM.setVolume(updated.isBgmMuted ? 0 : updated.bgmVolume / 100);
        retroBGM.setMuted(updated.isBgmMuted);
      }
      if (newSettings.sfxVolume !== undefined || newSettings.isSfxMuted !== undefined) {
        soundSynth.setVolume(updated.isSfxMuted ? 0 : updated.sfxVolume / 100);
        soundSynth.setMuted(updated.isSfxMuted);
      }
      return updated;
    });
  };

  // Trigger Victory Modal on first win
  useEffect(() => {
    if (gameState.hasWon && !hasShownVictory) {
      setShowVictoryModal(true);
      setHasShownVictory(true);
    }
  }, [gameState.hasWon, hasShownVictory]);

  // Keyboard shortcut listener (Space = click core, X = Cryo Vent, 1-4 = buy upgrades, ESC/M = menu)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Escape' || e.code === 'KeyM') {
        e.preventDefault();
        setIsMenuOpen(prev => {
          if (!prev) soundSynth.playMenuOpen();
          else soundSynth.playMenuClose();
          return !prev;
        });
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        const centerX = window.innerWidth * 0.25;
        const centerY = window.innerHeight * 0.5;
        handleCoreClick(centerX, centerY);
      } else if (e.code === 'KeyX' || e.code === 'KeyC') {
        handleCryoVent();
      } else if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
        const index = parseInt(e.code.replace('Digit', '')) - 1;
        const targetUpgrade = UPGRADE_CONFIGS[index];
        if (targetUpgrade) {
          buyUpgrade(targetUpgrade.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCoreClick, handleCryoVent, buyUpgrade]);

  const currentPhaseInfo = EVOLUTION_PHASES[gameState.currentPhase - 1];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none"
      style={{ backgroundColor: '#040711' }}
    >
      {/* Background: Space Lab image with gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
        style={{ backgroundImage: `url('/assets/bg/bg_space_laboratory.jpg')` }}
      />

      {/* Animated ambient glow — phase-synced radial light blob */}
      <div
        className="absolute pointer-events-none transition-all duration-1000"
        style={{
          width: '70vw', height: '70vh',
          left: '5%', top: '10%',
          background: `radial-gradient(ellipse at center, ${currentPhaseInfo.accentHex}12 0%, transparent 65%)`,
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute pointer-events-none transition-all duration-1000"
        style={{
          width: '40vw', height: '50vh',
          right: '2%', bottom: '5%',
          background: `radial-gradient(ellipse at center, ${currentPhaseInfo.accentHex}08 0%, transparent 60%)`,
          filter: 'blur(30px)',
        }}
      />

      {/* Animated starfield dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.8 ? '2px' : '1px',
              height: Math.random() > 0.8 ? '2px' : '1px',
              left: `${(i * 1.7 + 3) % 100}%`,
              top: `${(i * 1.3 + 7) % 100}%`,
              opacity: 0.3 + (i % 5) * 0.12,
              animation: `pulse ${2 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.17) % 3}s`,
            }}
          />
        ))}
      </div>

      {/* Horizontal grid lines (subtle) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(transparent calc(100% - 1px), ${currentPhaseInfo.accentHex} 1px)`,
          backgroundSize: '100% 80px'
        }}
      />

      {/* Scanline CRT overlay effect */}
      <div className="absolute inset-0 scanlines pointer-events-none z-30" />

      {/* High-Performance 60FPS Particle, Drones & Lightning Canvas Layer */}
      <ParticleCanvas
        ref={particleCanvasRef}
        isOverdrive={gameState.isOverdrive}
        phaseAccentHex={currentPhaseInfo.accentHex}
        droneCount={gameState.upgrades.subatomicDrones || 0}
      />

      {/* 1. Header HUD */}
      <HeaderHUD
        gameState={gameState}
        onToggleMute={toggleMute}
        onReset={resetGame}
        onOpenMenu={handleOpenMenu}
      />

      {/* 2. Main Single-Screen Body (Dual Column Layout) */}
      <main className="relative flex-1 w-full grid grid-cols-1 md:grid-cols-12 overflow-hidden z-20">
        {/* Left Column (Core Interactive Zone) */}
        <div className="md:col-span-7 h-full flex flex-col justify-center">
          <ReactorView
            gameState={gameState}
            comboCount={comboCount}
            isAntiBotLocked={isAntiBotLocked}
            antiBotTimeLeft={antiBotTimeLeft}
            chargeProgress={chargeProgress}
            isCharging={isCharging}
            isMegaBeamFiring={isMegaBeamFiring}
            onCoreClick={handleCoreClick}
            onCorePointerDown={handleCorePointerDown}
            onCorePointerUp={handleCorePointerUp}
            onCorePointerLeave={handleCorePointerLeave}
            onCryoVent={handleCryoVent}
            onAnomalyClick={handleAnomalyClick}
          />
        </div>

        {/* Right Column (Upgrade Console) */}
        <div className="md:col-span-5 h-full overflow-hidden">
          <UpgradePanel
            gameState={gameState}
            onBuyUpgrade={buyUpgrade}
          />
        </div>
      </main>

      {/* 3. Bottom Notification Terminal Ticker */}
      <NotificationTicker message={systemLog} />

      {/* 4. Victory Screen Modal */}
      {showVictoryModal && (
        <VictoryModal
          gameState={gameState}
          onClose={() => setShowVictoryModal(false)}
          onRestart={() => {
            setShowVictoryModal(false);
            setHasShownVictory(false);
            resetGame();
          }}
        />
      )}

      {/* 5. Main Menu & Settings & Manual Modal */}
      <MainMenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        gameState={gameState}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetGame={resetGame}
        initialTab={menuInitialTab}
      />
    </div>
  );
}

export default App;
