class SoundSynthEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    } else if (!muted && this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    }
  }

  public startAmbient() {
    if (this.ambientOsc || this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A hum (55Hz)

      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.03, this.ctx.currentTime);

      this.ambientOsc.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);
      this.ambientOsc.start();
    } catch {
      // Audio autoplay policy may block until click
    }
  }

  public playClick(pitchMultiplier: number = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const baseFreq = 440 * pitchMultiplier;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.08);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  public playCrit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Harmonic bell chime: two frequencies
    [880, 1320, 1760].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.02);

      gain.gain.setValueAtTime(0.18, t + i * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28 + i * 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + i * 0.02);
      osc.stop(t + 0.35);
    });
  }

  public playCryoVent() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // White noise whoosh
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(200, t + 0.8);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.8);

    // Rising power synth
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.6);

    oscGain.gain.setValueAtTime(0.2, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.7);
  }

  public playUpgrade() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [330, 440, 660]; // Upward triad
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.04);

      gain.gain.setValueAtTime(0.12, t + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.04);
      osc.stop(t + idx * 0.04 + 0.13);
    });
  }

  public playOverheatWarning() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.setValueAtTime(440, t + 0.07);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playAscension() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const chord = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Grand C Major arpeggio
    chord.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.08);

      gain.gain.setValueAtTime(0.15, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + i * 0.08);
      osc.stop(t + 2.6);
    });
  }

  // Tiếng nổ hủy diệt khi Lõi quá nhiệt chạm 100%
  public playMeltdown() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Deep Sub-Bass Impact Boom
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'sawtooth';
    boomOsc.frequency.setValueAtTime(140, t);
    boomOsc.frequency.exponentialRampToValueAtTime(28, t + 1.2);
    boomGain.gain.setValueAtTime(0.6, t);
    boomGain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
    boomOsc.connect(boomGain);
    boomGain.connect(this.ctx.destination);
    boomOsc.start(t);
    boomOsc.stop(t + 1.4);

    // 2. White noise explosion blast
    const bufferSize = Math.floor(this.ctx.sampleRate * 1.5);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.exponentialRampToValueAtTime(80, t + 1.3);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);
    noise.stop(t + 1.4);

    // 3. Siren alarm wavering
    const sirenOsc = this.ctx.createOscillator();
    const sirenGain = this.ctx.createGain();
    sirenOsc.type = 'triangle';
    sirenOsc.frequency.setValueAtTime(600, t + 0.3);
    sirenOsc.frequency.linearRampToValueAtTime(900, t + 0.6);
    sirenOsc.frequency.linearRampToValueAtTime(550, t + 0.9);
    sirenOsc.frequency.linearRampToValueAtTime(950, t + 1.2);
    sirenGain.gain.setValueAtTime(0.18, t + 0.3);
    sirenGain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
    sirenOsc.connect(sirenGain);
    sirenGain.connect(this.ctx.destination);
    sirenOsc.start(t + 0.3);
    sirenOsc.stop(t + 1.5);
  }

  // Âm thanh khi đã cày cuốc trả hết sạch nợ âm Joules
  public playDebtCleared() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5 to E6 victory chime
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);
      gain.gain.setValueAtTime(0.2, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.35);
    });
  }

  // Cảnh báo cực độ khi nhiệt độ > 92% sắp nổ
  public playOverheatCritical() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1100, t);
    osc.frequency.setValueAtTime(750, t + 0.04);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Âm thanh khi Dị Thường Lượng Tử xuất hiện
  public playAnomalySpawn() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.4);
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.65);
  }

  // Âm thanh khi bắt trúng Dị Thường
  public playAnomalyCollect(type: 'surge' | 'freeze' | 'frenzy') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    if (type === 'surge') {
      // Golden Arpeggio Chime
      const freqs = [587.33, 739.99, 880.00, 1174.66, 1479.98];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.05);
        gain.gain.setValueAtTime(0.22, t + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.05);
        osc.stop(t + idx * 0.05 + 0.45);
      });
    } else if (type === 'freeze') {
      // Crystal Frost Shatter & Freeze
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.5);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.6);
    } else {
      // Hyper Frenzy Laser Siren Pulse
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.linearRampToValueAtTime(1500, t + 0.3);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
    }
  }

  private chargeOsc: OscillatorNode | null = null;
  private chargeGain: GainNode | null = null;

  // Bắt đầu tiếng rền tụ điện khi ấn giữ sạc
  public startChargeHum() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    this.stopChargeHum();

    try {
      const t = this.ctx.currentTime;
      this.chargeOsc = this.ctx.createOscillator();
      this.chargeGain = this.ctx.createGain();
      this.chargeOsc.type = 'sawtooth';
      this.chargeOsc.frequency.setValueAtTime(140, t);
      this.chargeOsc.frequency.linearRampToValueAtTime(750, t + 1.6);
      this.chargeGain.gain.setValueAtTime(0.02, t);
      this.chargeGain.gain.linearRampToValueAtTime(0.18, t + 1.4);
      this.chargeOsc.connect(this.chargeGain);
      this.chargeGain.connect(this.ctx.destination);
      this.chargeOsc.start(t);
    } catch {
      // ignore
    }
  }

  // Dừng tiếng tụ điện
  public stopChargeHum() {
    if (this.chargeOsc) {
      try {
        this.chargeOsc.stop();
        this.chargeOsc.disconnect();
      } catch {
        // ignore
      }
      this.chargeOsc = null;
      this.chargeGain = null;
    }
  }

  // Tiếng phóng chùm Mega Beam cực đại
  public playMegaBeamFire() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    this.stopChargeHum();
    const t = this.ctx.currentTime;

    // Sub-bass heavy laser impact
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(160, t);
    subOsc.frequency.exponentialRampToValueAtTime(35, t + 0.6);
    subGain.gain.setValueAtTime(0.4, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.7);

    // High laser screech
    const beamOsc = this.ctx.createOscillator();
    const beamGain = this.ctx.createGain();
    beamOsc.type = 'triangle';
    beamOsc.frequency.setValueAtTime(1800, t);
    beamOsc.frequency.exponentialRampToValueAtTime(400, t + 0.5);
    beamGain.gain.setValueAtTime(0.3, t);
    beamGain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    beamOsc.connect(beamGain);
    beamGain.connect(this.ctx.destination);
    beamOsc.start(t);
    beamOsc.stop(t + 0.6);
  }

  // Tiếng nổ đoản mạch khi giữ sạc quá đà >100%
  public playOverchargeFault() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    this.stopChargeHum();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.setValueAtTime(110, t + 0.08);
    osc.frequency.setValueAtTime(60, t + 0.18);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  // Cảnh báo kích hoạt ngắt mạch chống Auto-click
  public playAntiAutoclick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.setValueAtTime(400, t + 0.1);
    osc.frequency.setValueAtTime(800, t + 0.2);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  }
}

export const soundSynth = new SoundSynthEngine();
