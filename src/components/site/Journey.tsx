"use client";

import { SectionBackground } from "./SectionBackground";
import { SectionHeading, Reveal, GlassCard } from "@/components/ui/primitives";
import type { JourneyData, JourneyItem, SectionBg } from "@/lib/types";
import { cn } from "@/lib/utils";

function JourneyItemCard({
  item,
  index,
}: {
  item: JourneyItem;
  index: number;
}) {
  const left = index % 2 === 0;
  return (
    <div className="relative md:grid md:grid-cols-2 md:gap-10">
      <span
        className="absolute left-4 top-6 size-3.5 -translate-x-1/2 rounded-full bg-primary ring-4 ring-primary/15 md:left-1/2"
        style={{ boxShadow: "0 0 18px var(--c-primary-glow)" }}
      />
      <div
        className={cn(
          "pl-12 md:pl-0",
          left
            ? "md:col-start-1 md:pr-12 md:text-right"
            : "md:col-start-2 md:pl-12",
        )}
      >
        <GlassCard hover={false} className="p-6">
          <div className="font-display text-3xl font-extrabold text-gradient-red">
            {item.year}
          </div>
          <h3 className="mt-1 font-display text-lg font-bold">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {item.description}
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

export function Journey({
  data,
  bg,
}: {
  data: JourneyData;
  bg?: SectionBg;
}) {
  return (
    <SectionBackground id="journey" bg={bg} className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={data.eyebrow}
          title={data.title}
          subtitle={data.subtitle}
        />
        <div className="relative mt-16">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary/60 via-white/10 to-transparent md:left-1/2 md:-translate-x-1/2" />
          <div className="space-y-8">
            {data.items.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.08}>
                <JourneyItemCard item={item} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionBackground>
  );
}
