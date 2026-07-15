"use client";

import dynamic from "next/dynamic";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { SectionBackground } from "./SectionBackground";
import { MagneticButton, Stars } from "@/components/ui/primitives";
import type { HeroData, HeroStat, SectionBg } from "@/lib/types";
import { cn } from "@/lib/utils";

const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => m.HeroScene),
  { ssr: false },
);

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

function FloatingCard({
  stat,
  index,
  mx,
  my,
  className,
}: {
  stat: HeroStat;
  index: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  className?: string;
}) {
  const factor = 16 + index * 10;
  const x = useSpring(useTransform(mx, [-0.5, 0.5], [-factor, factor]), {
    stiffness: 120,
    damping: 14,
  });
  const y = useSpring(useTransform(my, [-0.5, 0.5], [-factor, factor]), {
    stiffness: 120,
    damping: 14,
  });
  return (
    <motion.div
      style={{ x, y, translateZ: 70 }}
      className={cn("absolute pointer-events-none", className)}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
        className="glass-strong glow-red rounded-2xl px-4 py-3 text-center shadow-2xl"
      >
        <div className="font-display text-lg font-bold text-gradient-red">
          {stat.value}
        </div>
        <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">
          {stat.label}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProfileCard({
  image,
  alt,
  stats,
}: {
  image: string;
  alt: string;
  stats: HeroStat[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), {
    stiffness: 150,
    damping: 16,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), {
    stiffness: 150,
    damping: 16,
  });

  function move(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) / r.width);
    my.set((e.clientY - (r.top + r.height / 2)) / r.height);
  }
  function leave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className="perspective relative mx-auto w-full max-w-[22rem]"
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="preserve-3d relative"
      >
        <div className="glow-red relative overflow-hidden rounded-[2rem] border border-white/10 p-2 glass-strong">
          <div className="absolute -inset-px -z-10 rounded-[2rem] bg-gradient-to-b from-primary/40 via-transparent to-transparent" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={alt}
            className="relative aspect-[4/5] w-full rounded-[1.6rem] object-cover"
          />
          <div className="absolute inset-2.5 rounded-[1.6rem] ring-1 ring-inset ring-white/10" />
        </div>

        {stats[0] && (
          <FloatingCard stat={stats[0]} index={0} mx={mx} my={my} className="-left-6 top-8 sm:-left-10" />
        )}
        {stats[1] && (
          <FloatingCard stat={stats[1]} index={1} mx={mx} my={my} className="-right-5 top-1/3 sm:-right-12" />
        )}
        {stats[2] && (
          <FloatingCard stat={stats[2]} index={2} mx={mx} my={my} className="bottom-6 left-6" />
        )}
      </motion.div>
    </div>
  );
}

function ScrollIndicator() {
  return (
    <motion.a
      href="#about"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3, duration: 0.6 }}
      className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
    >
      <span className="text-[10px] uppercase tracking-[0.3em] text-muted">Scroll</span>
      <span className="relative flex h-9 w-5 items-start justify-center rounded-full border border-white/15 p-1">
        <span
          className="size-1 rounded-full bg-primary"
          style={{
            animation: "scroll-dot 1.8s ease-in-out infinite",
            boxShadow: "0 0 8px var(--c-primary-glow)",
          }}
        />
      </span>
    </motion.a>
  );
}

function Line({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero({
  data,
  bg,
}: {
  data: HeroData;
  bg?: SectionBg;
}) {
  return (
    <SectionBackground
      id="home"
      bg={bg}
      className="relative min-h-[100svh] w-full"
    >
      <HeroScene />

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(900px 520px at 28% 42%, transparent 0%, rgba(8,8,10,0.55) 78%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-12 px-5 pb-24 pt-32 sm:px-8 lg:grid-cols-12 lg:pt-28"
      >
        {/* Left */}
        <div className="lg:col-span-7">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              {data.badge}
            </span>
          </motion.div>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-6xl md:text-7xl xl:text-8xl">
            <Line delay={0.25}>{data.line1}</Line>
            <Line delay={0.4}>{data.line2}</Line>
            <Line delay={0.55}>
              <span className="text-gradient-red">{data.highlight}</span>
            </Line>
          </h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {data.description}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton href="#portfolio" variant="primary">
              {data.primaryCta}
            </MagneticButton>
            <MagneticButton href="#contact" variant="outline" strength={0.3}>
              {data.secondaryCta}
            </MagneticButton>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex items-center gap-4"
          >
            <Stars count={data.rating} size="size-4" />
            <span className="text-sm text-muted">{data.ratingText}</span>
          </motion.div>
        </div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <ProfileCard image={data.profileImage} alt={data.profileAlt} stats={data.stats} />
        </motion.div>
      </motion.div>

      <ScrollIndicator />
    </SectionBackground>
  );
}
