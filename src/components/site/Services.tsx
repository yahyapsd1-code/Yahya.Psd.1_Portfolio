"use client";

import { SectionBackground } from "./SectionBackground";
import { SectionHeading, Reveal, MagneticButton } from "@/components/ui/primitives";
import { DesignIcon, CheckIcon } from "@/components/ui/icons";
import type { ServicesData, SectionBg } from "@/lib/types";

function FeatureChip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.04]">
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
        <CheckIcon className="size-3.5" />
      </span>
      <span className="text-sm text-white/90">{text}</span>
    </div>
  );
}

export function Services({
  data,
  bg,
}: {
  data: ServicesData;
  bg?: SectionBg;
}) {
  return (
    <SectionBackground id="services" bg={bg} className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={data.eyebrow}
          title={data.title}
          subtitle={data.subtitle}
        />

        <Reveal delay={0.1}>
          <div className="glow-red mt-14 overflow-hidden rounded-[2rem] glass-strong p-8 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="flex flex-col">
                <div className="mb-6 grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <DesignIcon className="size-8" />
                </div>
                <h3 className="font-display text-2xl font-bold sm:text-3xl">
                  {data.name}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">
                  {data.description}
                </p>
                <div className="mt-8">
                  <MagneticButton href="#contact" variant="primary" strength={0.3}>
                    {data.cta}
                  </MagneticButton>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {data.features.map((feature, i) => (
                  <FeatureChip key={i} text={feature} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionBackground>
  );
}
