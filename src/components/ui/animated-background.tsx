
"use client";

import React, { useEffect, useRef, useCallback } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback((ctx: CanvasRenderingContext2D, frameCount: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'hsl(var(--background))';
    ctx.fillRect(0, 0, width, height);

    const particleCount = 40;
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.sin(i * 0.5 + frameCount * 0.001) * 0.4 + 0.5) * width + Math.cos(i * 0.1) * 50;
        const y = (Math.cos(i * 0.3 + frameCount * 0.001) * 0.4 + 0.5) * height + Math.sin(i * 0.1) * 50;
        const radius = Math.sin(i * 0.2 + frameCount * 0.005) * 1.5 + 1.5;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

        // Alternate between primary and accent colors
        const color = i % 3 === 0 ? `hsla(${accentColor}, 0.6)` : `hsla(${primaryColor}, 0.6)`;
        ctx.fillStyle = color;
        ctx.fill();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let frameCount = 0;
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Run resize once on mount
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const render = () => {
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    // Start animation
    render();

    // Cleanup function
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [draw]); // draw is memoized with useCallback

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}
