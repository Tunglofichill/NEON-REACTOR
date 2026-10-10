class RetroSynthwaveBGM {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.6;
  private timerId: number | null = null;
  private step: number = 0;
  private isOverdrive: boolean = false;

  // 110 BPM => 16th note = 60 / 110 / 4 = ~0.136s
  private tempo: number = 110;

  // Cyberpunk bassline notes (A minor / F / G / E)
  private bassline: number[] = [
    110, 110, 220, 110, 110, 164.81, 110, 220,
    87.31, 87.31, 174.61, 87.31, 98, 98, 196, 130.81
  ];

  // Arpeggio lead melody notes
  private arpLead: number[] = [
    440, 523.25, 659.25, 880, 659.25, 523.25, 440, 329.63,
    349.23, 440, 523.25, 698.46, 523.25, 440, 392, 493.88
  ];

  constructor() {}

  public init() {
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
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setOverdrive(overdrive: boolean) {
    this.isOverdrive = overdrive;
  }

  public start() {
    if (this.isPlaying) return;
    this.init();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.step = 0;
    this.scheduleNextStep();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleNextStep = () => {
    if (!this.isPlaying || !this.ctx) return;

    const intervalMs = (60 / this.tempo / 4) * 1000;

    if (!this.isMuted) {
      this.playStep(this.step);
    }

    this.step = (this.step + 1) % 16;
    this.timerId = window.setTimeout(this.scheduleNextStep, intervalMs);
  };

  private playStep(stepIndex: number) {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    // 1. Play Bass note
    const bassFreq = this.bassline[stepIndex] * (this.isOverdrive ? 1.5 : 1.0);
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    const bassFilter = this.ctx.createBiquadFilter();

    bassOsc.type = 'sawtooth';
    bassOsc.frequency.setValueAtTime(bassFreq, t);

    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(this.isOverdrive ? 1200 : 600, t);
    bassFilter.frequency.exponentialRampToValueAtTime(150, t + 0.12);

    const bassVol = (this.isOverdrive ? 0.08 : 0.05) * this.volume;
    bassGain.gain.setValueAtTime(bassVol, t);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(this.ctx.destination);

    bassOsc.start(t);
    bassOsc.stop(t + 0.13);

    // 2. Play Arp Lead note (every 2nd step)
    if (stepIndex % 2 === 0) {
      const leadFreq = this.arpLead[stepIndex] * (this.isOverdrive ? 1.25 : 1.0);
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();

      leadOsc.type = 'sine';
      leadOsc.frequency.setValueAtTime(leadFreq, t);

      const leadVol = (this.isOverdrive ? 0.05 : 0.025) * this.volume;
      leadGain.gain.setValueAtTime(leadVol, t);
      leadGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      leadOsc.connect(leadGain);
      leadGain.connect(this.ctx.destination);

      leadOsc.start(t);
      leadOsc.stop(t + 0.19);
    }

    // 3. Subtle Hi-hat tick on off-beats
    if (stepIndex % 4 === 2) {
      this.playHiHat(t);
    }
  }

  private playHiHat(t: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(8000, t);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, t);

    gain.gain.setValueAtTime(0.02 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.045);
  }
}

export const retroBGM = new RetroSynthwaveBGM();
