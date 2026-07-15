"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    setEnabled(true);
    document.documentElement.style.cursor = "none";

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      setHovering(
        !!target?.closest(
          "a,button,[data-cursor],input,textarea,select,label,.cursor-hover",
        ),
      );
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        style={{ x: rx, y: ry }}
        className="pointer-events-none fixed left-0 top-0 z-[100]"
      >
        <motion.div
          animate={{
            scale: hovering ? 1.7 : down ? 0.85 : 1,
            opacity: hovering ? 1 : 0.55,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-primary"
          style={{ width: 34, height: 34, boxShadow: "0 0 18px var(--c-primary-glow)" }}
        />
      </motion.div>
      <motion.div
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[100]"
      >
        <div className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_var(--c-primary-glow)]" />
      </motion.div>
    </>
  );
}
