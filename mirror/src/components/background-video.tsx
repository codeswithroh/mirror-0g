"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4";

// How many frames to extract. More = smoother transitions, longer initial load.
const TOTAL_FRAMES = 90;

export function BackgroundVideo() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);   // shown during load + mobile
  const canvasRef  = useRef<HTMLCanvasElement>(null);  // shown after extraction
  const framesRef  = useRef<ImageBitmap[]>([]);
  const mouseXRef  = useRef(0.5);
  const rafRef     = useRef<number>(0);
  const readyRef   = useRef(false);

  useEffect(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const isDesktop = () => window.innerWidth >= 1024;

    // Mobile: autoplay loop on the regular video element
    if (!isDesktop()) {
      video.loop = true;
      video.play().catch(() => {});
    }

    // Track mouse X as a 0-1 ratio
    const onMouseMove = (e: MouseEvent) => {
      if (isDesktop()) mouseXRef.current = e.clientX / window.innerWidth;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // RAF painting loop — once frames are ready, just index into the array
    const paint = () => {
      if (readyRef.current) {
        const ctx    = canvas.getContext("2d");
        const frames = framesRef.current;
        if (ctx && frames.length) {
          const idx = Math.min(
            Math.floor(mouseXRef.current * frames.length),
            frames.length - 1,
          );
          ctx.drawImage(frames[idx], 0, 0, canvas.width, canvas.height);
        }
      }
      rafRef.current = requestAnimationFrame(paint);
    };
    rafRef.current = requestAnimationFrame(paint);

    // Background frame extraction — uses a hidden video + offscreen canvas
    const extractFrames = async () => {
      if (!isDesktop()) return;

      // Size canvas to fill the container once
      const wrap = wrapRef.current;
      const w = wrap?.offsetWidth  ?? 1280;
      const h = wrap?.offsetHeight ?? 800;
      canvas.width  = w;
      canvas.height = h;

      // Offscreen drawing surface (never displayed)
      const off    = document.createElement("canvas");
      off.width    = w;
      off.height   = h;
      const offCtx = off.getContext("2d")!;

      // Hidden extractor video with CORS headers requested
      const ext = document.createElement("video");
      ext.src          = VIDEO_SRC;
      ext.muted        = true;
      ext.playsInline  = true;
      ext.preload      = "auto";
      ext.crossOrigin  = "anonymous";

      await new Promise<void>((res, rej) => {
        ext.addEventListener("loadedmetadata", () => res(), { once: true });
        ext.addEventListener("error", rej, { once: true });
        ext.load();
      });

      const duration = ext.duration;
      if (!duration || isNaN(duration)) return;

      const frames: ImageBitmap[] = [];

      for (let i = 0; i < TOTAL_FRAMES; i++) {
        ext.currentTime = (i / (TOTAL_FRAMES - 1)) * duration;
        await new Promise<void>(r =>
          ext.addEventListener("seeked", () => r(), { once: true }),
        );
        try {
          offCtx.drawImage(ext, 0, 0, w, h);
          frames.push(await createImageBitmap(off));
        } catch {
          // CORS blocked — bail out and keep video scrubbing
          ext.remove();
          return;
        }
      }

      framesRef.current = frames;
      readyRef.current  = true;

      // Swap: hide video, reveal canvas
      video.pause();
      video.style.display  = "none";
      canvas.style.display = "block";
      ext.remove();
    };

    extractFrames().catch(() => {
      // Extraction failed — fall back to direct seek (current behaviour)
      setupFallback(video);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent"
    >
      {/* Shown during extraction and on mobile */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-right lg:object-right-bottom"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Canvas replaces video once frames are ready — instant frame switching */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "none", objectFit: "cover" }}
      />
    </div>
  );
}

/** Fallback when CORS blocks canvas access — fastest possible seek path */
function setupFallback(video: HTMLVideoElement) {
  const onMove = (e: MouseEvent) => {
    if (window.innerWidth < 1024 || !video.duration || video.seeking) return;
    const t = (e.clientX / window.innerWidth) * video.duration;
    const v = video as HTMLVideoElement & { fastSeek?: (n: number) => void };
    if (v.fastSeek) { v.fastSeek(t); } else { video.currentTime = t; }
  };
  window.addEventListener("mousemove", onMove, { passive: true });
}
