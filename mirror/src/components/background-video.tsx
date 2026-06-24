"use client";

import { useEffect, useRef } from "react";

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const currentTimeRef = useRef(0);   // lerped current (what video is at)
  const targetTimeRef = useRef(0);    // where mouse wants it

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isDesktop = () => window.innerWidth >= 1024;

    // RAF loop — lerps currentTime toward targetTime every frame
    function tick() {
      if (video && isDesktop() && video.duration > 0) {
        const diff = targetTimeRef.current - currentTimeRef.current;
        if (Math.abs(diff) > 0.001) {
          currentTimeRef.current += diff * 0.08; // lerp factor — lower = smoother
          video.currentTime = currentTimeRef.current;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    // Mouse move → update target time only (no direct seek here)
    function onMouseMove(e: MouseEvent) {
      if (!video || !isDesktop() || video.duration === 0) return;
      const ratio = e.clientX / window.innerWidth;
      targetTimeRef.current = ratio * video.duration;
    }

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Mobile: autoplay loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.innerWidth >= 1024) return;
    video.loop = true;
    video.play().catch(() => {});
  }, []);

  return (
    <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-right lg:object-right-bottom"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}
