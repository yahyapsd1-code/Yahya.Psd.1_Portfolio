"use client";

import { SectionBackground } from "./SectionBackground";
import { SectionHeading, Reveal, CountUp } from "@/components/ui/primitives";
import type { StatisticsData, SectionBg, StatItem } from "@/lib/types";

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  return (
    <Reveal delay={index * 0.08}>
      <div className="group relative h-full overflow-hidden rounded-3xl glass p-7 text-center transition-all duration-500 hover:border-primary/40 hover:shadow-[0_30px_70px_-35px_var(--c-primary-glow)]">
        <div
          className="pointer-events-none absolute inset-x-0 -top-16 mx-auto h-32 w-32 rounded-full bg-primary/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ left: "50%", transform: "translateX(-50%)" }}
        />
        <div className="relative font-display text-4xl font-extrabold text-gradient-red sm:text-5xl">
          <CountUp to={stat.value} suffix={stat.suffix} />
        </div>
        <div className="relative mt-2 text-sm text-muted">{stat.label}</div>
      </div>
    </Reveal>
  );
}

export function Statistics({
  data,
  bg,
}: {
  data: StatisticsData;
  bg?: SectionBg;
}) {
  return (
    <SectionBackground id="stats" bg={bg} className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={data.eyebrow} title={data.title} />
        <div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {data.items.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </SectionBackground>
  );
}
