"use client";

import { useEffect, useRef } from "react";

export function CursorOrb() {
  const orbRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -200, y: -200 });
  const targetRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      targetRef.current = { x: e.clientX, y: e.clientY };
    }

    function tick() {
      const orb = orbRef.current;
      if (orb) {
        const dx = targetRef.current.x - posRef.current.x;
        const dy = targetRef.current.y - posRef.current.y;
        posRef.current.x += dx * 0.07;
        posRef.current.y += dy * 0.07;
        orb.style.transform = `translate(${posRef.current.x - 32}px, ${posRef.current.y - 32}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={orbRef}
      className="pointer-events-none fixed top-0 left-0 z-40 hidden lg:flex w-16 h-16 items-center justify-center"
      aria-hidden="true"
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-[#4D6D47]/10 blur-md scale-150" />
      {/* Main orb */}
      <div className="relative w-16 h-16 rounded-full bg-white border border-[#C8D0C8] shadow-lg flex items-center justify-center">
        <span className="text-[#1C2E1E] text-lg font-medium select-none leading-none">✳</span>
      </div>
    </div>
  );
}
