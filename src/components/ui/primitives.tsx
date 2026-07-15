"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type MouseEvent,
} from "react";
import { cn, formatNumber } from "@/lib/utils";
import { ArrowRightIcon, StarIcon } from "@/components/ui/icons";

/* -------------------------------------------------------------------------- */
/*  Magnetic wrapper                                                          */
/* -------------------------------------------------------------------------- */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Animated arrow                                                            */
/* -------------------------------------------------------------------------- */
export function AnimatedArrow({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-block size-4 overflow-hidden", className)}>
      <ArrowRightIcon className="absolute inset-0 size-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-5" />
      <ArrowRightIcon className="absolute inset-0 size-4 -translate-x-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-0" />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Premium button                                                            */
/* -------------------------------------------------------------------------- */
type Variant = "primary" | "outline" | "glass";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-white shadow-[0_10px_40px_-12px_var(--c-primary-glow)] hover:shadow-[0_16px_50px_-10px_var(--c-primary-glow)] hover:brightness-110",
  outline:
    "border border-white/15 text-white hover:border-primary/60 hover:text-primary",
  glass: "glass text-white hover:border-primary/50",
};

export function MagneticButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className,
  strength = 0.3,
  showArrow = true,
  target,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  className?: string;
  strength?: number;
  showArrow?: boolean;
  target?: string;
}) {
  const classes = cn(
    "group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300",
    variantClasses[variant],
    className,
  );

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {showArrow && <AnimatedArrow className="relative z-10" />}
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
      )}
    </>
  );

  return (
    <Magnetic strength={strength}>
      {href ? (
        <a href={href} onClick={onClick} className={classes} target={target} rel={target === "_blank" ? "noreferrer" : undefined}>
          {inner}
        </a>
      ) : (
        <button type={type} onClick={onClick} className={classes}>
          {inner}
        </button>
      )}
    </Magnetic>
  );
}

/* -------------------------------------------------------------------------- */
/*  Glass card                                                                */
/* -------------------------------------------------------------------------- */
export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass rounded-3xl",
        hover &&
          "transition-all duration-500 hover:border-primary/40 hover:shadow-[0_30px_80px_-30px_var(--c-primary-glow)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reveal on scroll                                                          */
/* -------------------------------------------------------------------------- */
const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section heading                                                           */
/* -------------------------------------------------------------------------- */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed text-muted sm:text-lg",
              align === "center" && "mx-auto",
            )}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Count up                                                                  */
/* -------------------------------------------------------------------------- */
export function CountUp({
  to,
  suffix = "",
  duration = 2,
  className,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {formatNumber(value)}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stars                                                                     */
/* -------------------------------------------------------------------------- */
export function Stars({
  count = 5,
  className,
  size = "size-4",
}: {
  count?: number;
  className?: string;
  size?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, type: "spring", stiffness: 260, damping: 14 }}
        >
          <StarIcon className={cn(size, "text-primary drop-shadow-[0_0_6px_var(--c-primary-glow)]")} />
        </motion.span>
      ))}
    </div>
  );
}
