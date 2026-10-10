import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Particle, FloatingText } from '../../types/game';
import { RESONANCE_PERIOD_SEC } from '../../data/gameConstants';

export interface ParticleCanvasHandle {
  emitClick: (
    clientX: number,
    clientY: number,
    text: string,
    isCrit: boolean,
    isOverdrive: boolean,
    colorHex: string
  ) => void;
  triggerScreenShake: (intensity: number) => void;
  emitMeltdown: (originX?: number, originY?: number) => void;
}

interface ParticleCanvasProps {
  isOverdrive: boolean;
  phaseAccentHex: string;
  droneCount: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface LaserBolt {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  life: number;
  color: string;
}

export const ParticleCanvas = forwardRef<ParticleCanvasHandle, ParticleCanvasProps>(
  ({ isOverdrive, phaseAccentHex, droneCount }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const floatingTextsRef = useRef<FloatingText[]>([]);
    const shockwavesRef = useRef<Shockwave[]>([]);
    const lasersRef = useRef<LaserBolt[]>([]);
    const shakeRef = useRef<number>(0);

    useImperativeHandle(ref, () => ({
      emitClick: (clientX, clientY, text, isCrit, overdriveActive, colorHex) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const originX = clientX - rect.left;
        const originY = clientY - rect.top;

        // 1. Spawn floating number text
        floatingTextsRef.current.push({
          id: Date.now() + Math.random(),
          x: originX + (Math.random() * 24 - 12),
          y: originY - 15,
          text,
          color: isCrit ? '#ffd700' : overdriveActive ? '#ff2a5f' : colorHex,
          size: isCrit ? 24 : overdriveActive ? 20 : 16,
          opacity: 1.0,
          vy: isCrit ? -2.6 : -1.8
        });

        // 2. Spawn spark particles
        const particleCount = isCrit ? 40 : overdriveActive ? 28 : 18;
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * (isCrit ? 6.5 : 4.5) + 1.8;
          particlesRef.current.push({
            x: originX,
            y: originY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * (isCrit ? 4 : 2.5) + 1,
            color: isCrit
              ? (Math.random() > 0.5 ? '#ffe066' : '#ffffff')
              : overdriveActive
              ? (Math.random() > 0.5 ? '#ff2a5f' : '#00f0ff')
              : colorHex,
            alpha: 1.0,
            decay: Math.random() * 0.02 + 0.015
          });
        }

        // 3. Shockwave ripple
        shockwavesRef.current.push({
          x: originX,
          y: originY,
          radius: 10,
          maxRadius: isCrit ? 120 : 70,
          alpha: 0.8,
          color: isCrit ? '#ffe066' : colorHex
        });

        // 4. Laser bolts shooting from flanks
        const turretLeft = { x: 30, y: originY };
        const turretRight = { x: (canvas.width || 800) * 0.58 - 30, y: originY };
        lasersRef.current.push({
          startX: turretLeft.x,
          startY: turretLeft.y,
          targetX: originX,
          targetY: originY,
          life: 1.0,
          color: colorHex
        });
        lasersRef.current.push({
          startX: turretRight.x,
          startY: turretRight.y,
          targetX: originX,
          targetY: originY,
          life: 1.0,
          color: colorHex
        });

        // 5. Screen shake
        shakeRef.current = isCrit ? 7 : overdriveActive ? 4.5 : 2;
      },
      triggerScreenShake: (intensity: number) => {
        shakeRef.current = intensity;
      },
      emitMeltdown: (optX?: number, optY?: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const centerX = optX ?? ((canvas.width || 800) * 0.3);
        const centerY = optY ?? ((canvas.height || 600) * 0.42);

        // 1. Khói lửa mảnh vỡ hạt nổ (140 hạt)
        for (let i = 0; i < 140; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 9 + 3;
          const colors = ['#ff0033', '#ff3300', '#ffaa00', '#ffffff', '#ff0055'];
          particlesRef.current.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1.0,
            decay: Math.random() * 0.015 + 0.008
          });
        }

        // 2. 3 Shockwaves đỏ khổng lồ nở dần
        [180, 280, 380].forEach((maxR, idx) => {
          shockwavesRef.current.push({
            x: centerX,
            y: centerY,
            radius: 15 + idx * 25,
            maxRadius: maxR,
            alpha: 0.95,
            color: idx === 0 ? '#ffffff' : '#ff0033'
          });
        });

        // 3. Floating text cảnh báo nổ
        floatingTextsRef.current.push({
          id: Date.now() + Math.random(),
          x: centerX,
          y: centerY - 40,
          text: '💥 MELTDOWN! LÕI PHÁT NỔ!',
          color: '#ff2a5f',
          size: 28,
          opacity: 1.0,
          vy: -3.5
        });

        // 4. Rung chuyển màn hình rung chấn cấp 28
        shakeRef.current = 28;
      }
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationFrameId: number;

      const handleResize = () => {
        if (!canvas) return;
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);

      // Ambient quantum dust
      const ambientDust: { x: number; y: number; vy: number; radius: number; alpha: number }[] = [];
      for (let i = 0; i < 45; i++) {
        ambientDust.push({
          x: Math.random() * (canvas.width || 800),
          y: Math.random() * (canvas.height || 600),
          vy: -(Math.random() * 0.4 + 0.1),
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.4 + 0.1
        });
      }

      // Procedural lightning arcs generator
      const drawLightning = (x1: number, y1: number, x2: number, y2: number, displace: number) => {
        if (displace < 7) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          return;
        }
        const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displace;
        const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displace;
        drawLightning(x1, y1, midX, midY, displace / 2);
        drawLightning(midX, midY, x2, y2, displace / 2);
      };

      // Animation Loop (60 FPS)
      const render = (timeMs: number) => {
        const timeSec = timeMs / 1000;
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        // Apply shake
        if (shakeRef.current > 0.1) {
          const offsetX = (Math.random() - 0.5) * shakeRef.current;
          const offsetY = (Math.random() - 0.5) * shakeRef.current;
          ctx.save();
          ctx.translate(offsetX, offsetY);
          shakeRef.current *= 0.88;
        }

        const centerX = width >= 768 ? width * (7 / 12) * 0.5 : width * 0.5;
        const centerY = height * 0.44;

        // 1. Ambient quantum dust
        ctx.fillStyle = phaseAccentHex;
        ambientDust.forEach(dust => {
          dust.y += dust.vy;
          if (dust.y < 0) {
            dust.y = height;
            dust.x = Math.random() * width;
          }
          ctx.globalAlpha = dust.alpha;
          ctx.beginPath();
          ctx.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // 2. Render Concentric Resonance Pulse Wave
        const cycle = (timeSec % RESONANCE_PERIOD_SEC) / RESONANCE_PERIOD_SEC;
        const ringRadius = 120 + Math.sin(cycle * Math.PI) * 45;
        const ringAlpha = 0.25 + Math.sin(cycle * Math.PI) * 0.45;

        ctx.save();
        ctx.strokeStyle = phaseAccentHex;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = phaseAccentHex;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = ringAlpha;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Pulsing tick marks
        ctx.setLineDash([4, 12]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // 3. Render Orbiting Quantum Drones
        const visibleDrones = Math.min(8, droneCount);
        if (visibleDrones > 0) {
          ctx.save();
          for (let i = 0; i < visibleDrones; i++) {
            const droneSpeed = 0.8 + i * 0.2;
            const orbitRadius = 160 + (i % 3) * 22;
            const droneAngle = timeSec * droneSpeed + (i * (Math.PI * 2)) / visibleDrones;
            const dx = centerX + Math.cos(droneAngle) * orbitRadius;
            const dy = centerY + Math.sin(droneAngle) * (orbitRadius * 0.55); // elliptical 3D orbit

            // Drone body
            ctx.fillStyle = '#00f0ff';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
            ctx.fill();

            // Periodic laser beam from drone into core
            if (Math.sin(timeSec * 3 + i) > 0.85) {
              ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(dx, dy);
              ctx.lineTo(centerX, centerY);
              ctx.stroke();
            }
          }
          ctx.restore();
        }

        // 4. Render Laser Bolts from Turrets
        for (let i = lasersRef.current.length - 1; i >= 0; i--) {
          const l = lasersRef.current[i];
          ctx.save();
          ctx.strokeStyle = l.color;
          ctx.lineWidth = 3 * l.life;
          ctx.shadowColor = l.color;
          ctx.shadowBlur = 15;
          ctx.globalAlpha = l.life;
          ctx.beginPath();
          ctx.moveTo(l.startX, l.startY);
          ctx.lineTo(l.targetX, l.targetY);
          ctx.stroke();
          ctx.restore();

          l.life -= 0.14;
          if (l.life <= 0) {
            lasersRef.current.splice(i, 1);
          }
        }

        // 5. Render Shockwave Ripples
        for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
          const sw = shockwavesRef.current[i];
          ctx.save();
          ctx.strokeStyle = sw.color;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = sw.color;
          ctx.shadowBlur = 10;
          ctx.globalAlpha = sw.alpha;
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          sw.radius += 5;
          sw.alpha -= 0.04;
          if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
            shockwavesRef.current.splice(i, 1);
          }
        }

        // 6. Overdrive Lightning Arcs
        if (isOverdrive) {
          ctx.save();
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2.0;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 15;

          for (let i = 0; i < 5; i++) {
            const angle1 = Math.random() * Math.PI * 2;
            const angle2 = angle1 + (Math.random() * 0.8 + 0.4);
            const r = 110 + Math.random() * 45;
            const x1 = centerX + Math.cos(angle1) * r;
            const y1 = centerY + Math.sin(angle1) * r;
            const x2 = centerX + Math.cos(angle2) * (r + 35);
            const y2 = centerY + Math.sin(angle2) * (r + 35);
            drawLightning(x1, y1, x2, y2, 30);
          }
          ctx.restore();
        }

        // 7. Render Spark Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 8. Render Floating Dynamic Text
        for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
          const ft = floatingTextsRef.current[i];
          ft.y += ft.vy;
          ft.opacity -= 0.016;

          if (ft.opacity <= 0) {
            floatingTextsRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, ft.opacity);
          ctx.font = `bold ${ft.size}px "JetBrains Mono", monospace`;
          ctx.fillStyle = ft.color;
          ctx.shadowColor = ft.color;
          ctx.shadowBlur = 12;
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.restore();
        }

        if (shakeRef.current > 0.1) {
          ctx.restore();
        }

        animationFrameId = requestAnimationFrame(render);
      };

      animationFrameId = requestAnimationFrame(render);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
      };
    }, [isOverdrive, phaseAccentHex, droneCount]);

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      />
    );
  }
);
