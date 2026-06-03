import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function initParticles(width: number, height: number): Particle[] {
  const area = width * height;
  const count = clamp(Math.floor(area / 16500), 38, 88);
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.425,
      vy: (Math.random() - 0.5) * 0.425
    });
  }
  return particles;
}

export function ParticleNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const connectDistance = 118;
    const connectDistSq = connectDistance * connectDistance;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const prev = sizeRef.current;
      sizeRef.current = { w, h };

      if (prev.w !== w || prev.h !== h || particlesRef.current.length === 0) {
        particlesRef.current = initParticles(w, h);
      }
    };

    const step = () => {
      const { w, h } = sizeRef.current;
      if (!w || !h) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      const particles = particlesRef.current;
      const maxSpeed = 0.675;

      for (const p of particles) {
        p.vx += (Math.random() - 0.5) * 0.0225;
        p.vy += (Math.random() - 0.5) * 0.0225;
        p.vx = clamp(p.vx, -maxSpeed, maxSpeed);
        p.vy = clamp(p.vy, -maxSpeed, maxSpeed);
        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= 0) {
          p.x = 0;
          p.vx = Math.abs(p.vx) + 0.04;
        } else if (p.x >= w) {
          p.x = w;
          p.vx = -Math.abs(p.vx) - 0.04;
        }
        if (p.y <= 0) {
          p.y = 0;
          p.vy = Math.abs(p.vy) + 0.04;
        } else if (p.y >= h) {
          p.y = h;
          p.vy = -Math.abs(p.vy) - 0.04;
        }
      }

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= connectDistSq) {
            continue;
          }
          const d = Math.sqrt(d2);
          const t = 1 - d / connectDistance;
          const alpha = t * t * 0.42;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(130, 138, 158, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(145, 152, 168, 0.65)";
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-network-canvas" aria-hidden />;
}
