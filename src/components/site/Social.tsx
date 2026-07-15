"use client";

import { SectionBackground } from "./SectionBackground";
import { SectionHeading, Reveal, Magnetic } from "@/components/ui/primitives";
import {
  InstagramIcon,
  XIcon,
  DiscordIcon,
  ArrowUpRightIcon,
} from "@/components/ui/icons";
import type { SocialData, SectionBg } from "@/lib/types";
import type { SVGProps } from "react";

export function Social({
  data,
  bg,
}: {
  data: SocialData;
  bg?: SectionBg;
}) {
  const cards: {
    Icon: (p: SVGProps<SVGSVGElement>) => React.ReactNode;
    label: string;
    value: string;
    href: string;
  }[] = [
    { Icon: InstagramIcon, label: "Instagram", value: data.instagramLabel, href: data.instagram },
    { Icon: XIcon, label: "X", value: data.xLabel, href: data.x },
    { Icon: DiscordIcon, label: "Discord", value: data.discordLabel, href: data.discord },
  ];

  return (
    <SectionBackground id="social" bg={bg} className="py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Connect"
          title="Follow the studio"
          subtitle="Behind-the-scenes, fresh thumbnails and case studies — across the platforms below."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {cards.map((card, i) => (
            <Reveal key={card.label} delay={i * 0.08}>
              <Magnetic strength={0.18} className="block w-full">
                <a
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col items-center gap-3 rounded-3xl glass p-8 text-center transition-all duration-500 hover:border-primary/40 hover:shadow-[0_30px_70px_-35px_var(--c-primary-glow)]"
                >
                  <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-500 group-hover:scale-110">
                    <card.Icon className="size-7" />
                  </div>
                  <div className="font-display text-lg font-bold">{card.label}</div>
                  <div className="inline-flex items-center gap-1 text-sm text-muted">
                    {card.value}
                    <ArrowUpRightIcon className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </a>
              </Magnetic>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionBackground>
  );
}
