"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef, type ReactNode } from "react";
import type { SectionBg } from "@/lib/types";
import { cn } from "@/lib/utils";

function Particles({ speed = 1 }: { speed?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: 16 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 6,
        dur: (7 + Math.random() * 9) * speed,
      })),
    [speed],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary/40"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animation: `float-y ${d.dur}s ease-in-out ${d.delay}s infinite`,
            boxShadow: "0 0 12px var(--c-primary-glow)",
          }}
        />
      ))}
    </div>
  );
}

export function SectionBackground({
  bg,
  id,
  className,
  children,
}: {
  bg?: SectionBg;
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallaxAmount = (bg?.parallax ?? 0) * 70;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${parallaxAmount}px`, `${parallaxAmount}px`],
  );

  const filter = bg
    ? `blur(${bg.blur}px) brightness(${bg.brightness}%) contrast(${bg.contrast}%) saturate(${bg.saturation}%)`
    : undefined;

  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative overflow-hidden", className)}
    >
      <div className="absolute inset-0 z-0">
        {bg && (
          <motion.div style={{ y }} className="absolute inset-0">
            {bg.type === "image" && bg.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bg.imageUrl}
                alt=""
                className="size-full object-cover"
                style={{ filter }}
              />
            ) : bg.type === "video" && bg.videoUrl ? (
              <video
                src={bg.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="size-full object-cover"
                style={{ filter }}
              />
            ) : (
              <div
                className="size-full"
                style={{ background: bg.gradient || bg.solid || "#08080a" }}
              />
            )}
          </motion.div>
        )}

        {bg?.grid && (
          <div
            className="absolute inset-0 bg-grid bg-grid-fade"
            style={{ ["--grid-opacity" as string]: String(bg.gridOpacity) }}
          />
        )}

        {bg?.overlay && (
          <div
            className="absolute inset-0"
            style={{ background: bg.overlayColor, opacity: bg.overlayOpacity }}
          />
        )}

        {bg?.particles && <Particles speed={bg.animationSpeed || 1} />}
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  );
}
