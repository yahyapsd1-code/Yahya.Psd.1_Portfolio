"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Loader({ brand, initials }: { brand: string; initials: string }) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (typeof document !== "undefined") document.body.style.overflow = "hidden";
    let raf = 0;
    const start = performance.now();
    const duration = 1700;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setShow(false);
          if (typeof document !== "undefined") document.body.style.overflow = "";
        }, 350);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (typeof document !== "undefined") document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-bg"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(600px 400px at 50% 50%, rgba(193,18,31,0.18), transparent 70%)",
            }}
          />
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 -z-10 rounded-full bg-primary/30 blur-3xl" />
            <div className="glow-red grid size-24 place-items-center rounded-3xl glass-strong">
              <motion.span
                initial={{ letterSpacing: "0.5em", opacity: 0 }}
                animate={{ letterSpacing: "0.05em", opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="font-display text-3xl font-extrabold text-gradient-red"
              >
                {initials}
              </motion.span>
            </div>
          </motion.div>

          <div className="font-display text-xs font-semibold uppercase tracking-[0.4em] text-muted">
            {brand}
          </div>

          <div className="mt-8 h-px w-56 overflow-hidden bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 font-display text-xs tabular-nums text-muted">
            {progress}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
