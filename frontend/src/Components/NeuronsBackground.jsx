import { useEffect, useRef } from 'react';

export default function NeuronsBackground({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrameId;
    let width, height;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    const NEURON_COUNT = 80;
    const CONNECT_DIST = 130;
    const FIRE_DIST = 90;

    const neurons = Array.from({ length: NEURON_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.8,
      firing: 0,
      fireDelay: Math.random() * 100,
    }));

    let frame = 0;
    const mouse = { x: -9999, y: -9999 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      neurons.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < FIRE_DIST) {
          n.firing = Math.min(1, n.firing + 0.08);
        } else {
          n.firing = Math.max(0, n.firing - 0.015);
        }

        if (frame % 120 === Math.floor(n.fireDelay)) {
          n.firing = Math.min(1, n.firing + 0.5);
        }
      });

      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dx = neurons[i].x - neurons[j].x;
          const dy = neurons[i].y - neurons[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const base = (1 - dist / CONNECT_DIST) * 0.2;
            const firingBoost = (neurons[i].firing + neurons[j].firing) * 0.25;
            const opacity = base + firingBoost;

            ctx.beginPath();
            ctx.moveTo(neurons[i].x, neurons[i].y);
            ctx.lineTo(neurons[j].x, neurons[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();

            if (neurons[i].firing > 0.5 || neurons[j].firing > 0.5) {
              ctx.beginPath();
              ctx.moveTo(neurons[i].x, neurons[i].y);
              ctx.lineTo(neurons[j].x, neurons[j].y);
              ctx.strokeStyle = `rgba(168, 85, 247, ${firingBoost * 0.5})`;
              ctx.lineWidth = 1.2;
              ctx.stroke();
            }
          }
        }
      }

      neurons.forEach((n) => {
        const baseOpacity = 0.35 + n.firing * 0.65;
        const radius = n.r + n.firing * 2.5;

        if (n.firing > 0.1) {
          const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 6);
          gradient.addColorStop(0, `rgba(99, 102, 241, ${n.firing * 0.15})`);
          gradient.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius * 6, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${baseOpacity})`;
        ctx.fill();

        if (n.firing > 0.4) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 210, 255, ${n.firing * 0.8})`;
          ctx.fill();
        }
      });

      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ opacity: 0.7 }}
    />
  );
}
