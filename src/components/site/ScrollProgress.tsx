"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_12px_var(--c-primary-glow)]"
    />
  );
}
