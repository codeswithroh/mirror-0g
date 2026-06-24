"use client";

import { useEffect, useRef } from "react";

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isDesktop = () => window.innerWidth >= 1024;

    function onMouseMove(e: MouseEvent) {
      if (!video || !isDesktop() || !video.duration) return;
      // Map mouse X directly to video time — no lerp, no lag
      targetRef.current = (e.clientX / window.innerWidth) * video.duration;
    }

    function tick() {
      // Only seek when browser has finished the last seek.
      // This prevents queueing seeks faster than the decoder can process,
      // which is what causes the choppy/laggy feeling.
      if (video && isDesktop() && video.duration > 0 && !video.seeking) {
        const diff = Math.abs(targetRef.current - video.currentTime);
        if (diff > 0.005) {
          video.currentTime = targetRef.current;
        }
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
