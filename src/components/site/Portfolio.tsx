"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SectionBackground } from "./SectionBackground";
import { SectionHeading, Reveal } from "@/components/ui/primitives";
import { ArrowUpRightIcon, ArrowRightIcon, CloseIcon } from "@/components/ui/icons";
import type { PortfolioItem, SectionBg } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tile = { item: PortfolioItem; index: number };

function Thumb({
  tile,
  onOpen,
}: {
  tile: Tile;
  onOpen: (index: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(tile.index)}
      aria-label={`View ${tile.item.title}`}
      className="group/thumb relative aspect-video h-full shrink-0 cursor-pointer overflow-hidden transition-transform duration-500 ease-out hover:z-10 hover:scale-[1.04] will-change-transform"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.item.imageUrl}
        alt={tile.item.title}
        loading="lazy"
        className="size-full object-cover"
      />
      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />

      {/* hover overlay */}
      <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/35 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover/thumb:opacity-100">
        <span className="translate-y-3 transition-transform duration-300 group-hover/thumb:translate-y-0">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            {tile.item.category}
          </span>
          <span className="mt-1 block font-display text-lg font-bold leading-tight text-white">
            {tile.item.title}
          </span>
          <span className="mt-1 line-clamp-2 text-xs text-white/70">
            {tile.item.description}
          </span>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white">
            View Project <ArrowUpRightIcon className="size-3.5" />
          </span>
        </span>
      </span>

      {/* hover glow */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 ring-2 ring-inset ring-primary transition-opacity duration-300 group-hover/thumb:opacity-100"
        style={{ boxShadow: "inset 0 0 50px var(--c-primary-glow)" }}
      />
    </button>
  );
}

function MarqueeRow({
  tiles,
  direction,
  duration,
  onOpen,
}: {
  tiles: Tile[];
  direction: "left" | "right";
  duration: number;
  onOpen: (index: number) => void;
}) {
  const [paused, setPaused] = useState(false);
  const looped = [...tiles, ...tiles];

  return (
    <div
      className="group/row relative w-full overflow-hidden mask-fade-x"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={cn(
          "flex h-[150px] w-max gap-0 sm:h-[200px] lg:h-[230px]",
          direction === "left" ? "marquee-left" : "marquee-right",
          paused && "paused",
        )}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {looped.map((tile, i) => (
          <Thumb key={`${tile.item.id}-${i}`} tile={tile} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: PortfolioItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const open = index !== null && index >= 0 && index < items.length;

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      const next = (index + dir + items.length) % items.length;
      onNavigate(next);
    },
    [index, items.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go, onClose]);

  const item = open && index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8"
        >
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 grid w-full max-w-5xl items-center gap-6 lg:grid-cols-5"
          >
            <div className="relative overflow-hidden rounded-2xl glow-red ring-1 ring-white/10 lg:col-span-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="aspect-video w-full object-cover"
              />
            </div>

            <div className="lg:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {item.category}
              </span>
              <h3 className="mt-2 font-display text-3xl font-bold">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{item.description}</p>

              {item.tags && item.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-7 flex items-center gap-3">
                <button
                  onClick={() => go(-1)}
                  className="group/nav inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold transition-colors hover:border-primary/60 hover:text-primary"
                >
                  <ArrowRightIcon className="size-3.5 rotate-180" />
                  Prev
                </button>
                <button
                  onClick={() => go(1)}
                  className="group/nav inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold transition-colors hover:border-primary/60 hover:text-primary"
                >
                  Next
                  <ArrowRightIcon className="size-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close preview"
              className="absolute -top-3 right-0 grid size-10 place-items-center rounded-full glass-strong text-white transition-colors hover:text-primary sm:-right-3"
            >
              <CloseIcon className="size-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Portfolio({
  items,
  bg,
}: {
  items: PortfolioItem[];
  bg?: SectionBg;
}) {
  const [active, setActive] = useState<number | null>(null);

  const rows = useMemo<Tile[][]>(() => {
    if (items.length === 0) return [];
    const tileList: Tile[] = items.map((item, index) => ({ item, index }));
    const count = Math.min(4, Math.max(2, Math.ceil(items.length / 2)));
    return Array.from({ length: count }).map((_, r) => {
      const offset = (r * 2) % tileList.length;
      return [...tileList.slice(offset), ...tileList.slice(0, offset)];
    });
  }, [items]);

  return (
    <SectionBackground id="portfolio" bg={bg} className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Portfolio"
          title={
            <>
              The <span className="text-gradient-red">Thumbnail Wall</span>
            </>
          }
          subtitle="A seamless collection of high-performing YouTube thumbnails — designed to stop the scroll and earn the click."
        />
      </div>

      {rows.length > 0 ? (
        <div className="mt-14 space-y-3 sm:space-y-4">
          {rows.map((row, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <MarqueeRow
                tiles={row}
                direction={i % 2 === 0 ? "left" : "right"}
                duration={48 + i * 12}
                onOpen={setActive}
              />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-14 max-w-md rounded-3xl glass p-10 text-center text-muted">
          No projects published yet.
        </div>
      )}

      <Lightbox
        items={items}
        index={active}
        onClose={() => setActive(null)}
        onNavigate={setActive}
      />
    </SectionBackground>
  );
}
