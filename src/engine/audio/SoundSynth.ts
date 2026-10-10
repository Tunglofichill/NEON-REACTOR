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
}

export const soundSynth = new SoundSynthEngine();
