"use client";

import { useEffect, useRef } from "react";

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const currentRef = useRef(0);   // where the video actually is
  const targetRef = useRef(0);    // where the mouse wants it

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isDesktop = () => window.innerWidth >= 1024;

    function onMouseMove(e: MouseEvent) {
      if (!video || !isDesktop() || !video.duration) return;
      targetRef.current = (e.clientX / window.innerWidth) * video.duration;
    }

    function tick() {
      if (video && isDesktop() && video.duration > 0) {
        const diff = targetRef.current - currentRef.current;
        // Only actually seek when there's a meaningful distance to cover.
        // Factor 0.18 = fast enough to feel responsive, slow enough to glide.
        if (Math.abs(diff) > 0.008) {
          currentRef.current += diff * 0.18;
          video.currentTime = currentRef.current;
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
