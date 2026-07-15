"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/primitives";
import { MenuIcon, CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];
const SECTIONS = ["home", "about", "services", "portfolio", "reviews", "contact"];

export function Navbar({
  brand,
  initials,
  ctaLabel = "Let's Talk",
}: {
  brand: string;
  initials: string;
  ctaLabel?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[80] flex justify-center px-4 pt-4">
      <motion.nav
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "flex w-full max-w-6xl items-center justify-between rounded-full px-3 transition-all duration-500 sm:px-4",
          scrolled
            ? "glass-strong py-2 shadow-[0_18px_60px_-30px_var(--c-primary-glow)]"
            : "border border-transparent py-3.5",
        )}
      >
        <a href="#home" className="group flex items-center gap-2.5 pl-1.5">
          <span className="grid size-9 place-items-center rounded-xl glass font-display text-sm font-extrabold text-primary transition-transform duration-300 group-hover:scale-110">
            {initials}
          </span>
          <span className="hidden font-display text-sm font-bold tracking-wide sm:block">
            {brand}
          </span>
        </a>

        <div className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-white/[0.07] ring-1 ring-white/5"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={cn(isActive && "text-ink")}>{link.label}</span>
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <MagneticButton
              href="#contact"
              variant="primary"
              className="!px-5 !py-2.5 !text-xs"
              strength={0.4}
            >
              {ctaLabel}
            </MagneticButton>
          </div>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="grid size-10 place-items-center rounded-full glass text-ink lg:hidden"
          >
            <MenuIcon className="size-5" />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] lg:hidden"
          >
            <div className="absolute inset-0 glass-strong" />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative flex h-full flex-col items-center justify-center gap-3"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="absolute right-6 top-6 grid size-11 place-items-center rounded-full glass text-ink"
              >
                <CloseIcon className="size-5" />
              </button>
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i + 0.1 }}
                  className="font-display text-4xl font-bold text-ink"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                <MagneticButton
                  href="#contact"
                  onClick={() => setOpen(false)}
                  variant="primary"
                >
                  {ctaLabel}
                </MagneticButton>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
