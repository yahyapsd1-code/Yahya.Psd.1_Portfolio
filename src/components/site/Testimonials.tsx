"use client";

import { SectionBackground } from "./SectionBackground";
import { SectionHeading, Stars } from "@/components/ui/primitives";
import { QuoteIcon } from "@/components/ui/icons";
import type { Testimonial, SectionBg } from "@/lib/types";

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="flex w-[300px] shrink-0 flex-col rounded-3xl glass p-7 transition-colors duration-500 hover:border-primary/40 sm:w-[380px]">
      <QuoteIcon className="size-8 text-primary/40" />
      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/90">
        “{t.review}”
      </p>
      <div className="mt-6 flex items-center gap-3">
        {t.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.avatar}
            alt={t.name}
            className="size-11 rounded-full object-cover ring-1 ring-white/10"
          />
        ) : (
          <div className="grid size-11 place-items-center rounded-full bg-primary/15 font-display font-bold text-primary ring-1 ring-primary/20">
            {t.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{t.name}</div>
          <div className="truncate text-xs text-muted">{t.role}</div>
        </div>
        <div className="ml-auto shrink-0">
          <Stars count={t.rating} size="size-3.5" />
        </div>
      </div>
    </article>
  );
}

export function Testimonials({
  items,
  bg,
}: {
  items: Testimonial[];
  bg?: SectionBg;
}) {
  const doubled = [...items, ...items, ...items];
  return (
    <SectionBackground id="reviews" bg={bg} className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Reviews"
          title="Loved by creators worldwide"
          subtitle="Real results from creators who trust their thumbnails to me."
        />
      </div>

      <div className="group mt-14 w-full overflow-hidden mask-fade-x">
        <div
          className="marquee-left flex w-max gap-6 pr-6 group-hover:[animation-play-state:paused]"
          style={{ ["--marquee-duration" as string]: "60s" }}
        >
          {doubled.map((t, i) => (
            <TestimonialCard key={`${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </SectionBackground>
  );
}
