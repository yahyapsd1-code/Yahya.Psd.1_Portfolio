"use client";

import { SectionBackground } from "./SectionBackground";
import { Reveal } from "@/components/ui/primitives";
import {
  InstagramIcon,
  XIcon,
  DiscordIcon,
  MailIcon,
} from "@/components/ui/icons";
import type { FooterData, SocialData, SectionBg } from "@/lib/types";

const SOCIAL = [
  { Icon: InstagramIcon, key: "instagram" },
  { Icon: XIcon, key: "x" },
  { Icon: DiscordIcon, key: "discord" },
] as const;

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export function Footer({
  data,
  social,
  brand,
  initials,
  email,
  bg,
}: {
  data: FooterData;
  social: SocialData;
  brand: string;
  initials: string;
  email: string;
  bg?: SectionBg;
}) {
  return (
    <SectionBackground id="footer" bg={bg} className="pt-16">
      <footer className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        <div className="grid gap-10 rounded-[2rem] glass-strong p-8 sm:p-12 lg:grid-cols-3">
          <Reveal>
            <div>
              <a href="#home" className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl glass font-display text-sm font-extrabold text-primary">
                  {initials}
                </span>
                <span className="font-display text-base font-bold">{brand}</span>
              </a>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                {data.tagline}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="lg:justify-self-center">
              <h4 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                Quick Links
              </h4>
              <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2.5">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group relative text-sm text-white/80 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="lg:justify-self-end">
              <h4 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                Connect
              </h4>
              <a
                href={`mailto:${email}`}
                className="mt-4 inline-block text-sm text-white/80 transition-colors hover:text-primary"
              >
                {email}
              </a>
              <div className="mt-4 flex gap-3">
                {SOCIAL.map(({ Icon, key }) => (
                  <a
                    key={key}
                    href={social[key]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={key}
                    className="grid size-11 place-items-center rounded-xl glass text-white/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:text-primary hover:shadow-[0_12px_30px_-12px_var(--c-primary-glow)]"
                  >
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {data.copyright}. All rights reserved.
          </p>
          <p className="text-xs text-muted">{data.signature}</p>
          <a
            href="/admin"
            className="text-xs text-muted transition-colors hover:text-primary"
          >
            Studio Login
          </a>
        </div>
      </footer>
    </SectionBackground>
  );
}
