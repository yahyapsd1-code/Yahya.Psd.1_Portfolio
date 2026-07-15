import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function SearchIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
export function ConceptIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.2 1 2.5h6c0-1.3.4-1.9 1-2.5A6 6 0 0 0 12 3Z" />
    </svg>
  );
}
export function DesignIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M14.5 4.5 19.5 9.5" />
      <path d="M3 21l3.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11Z" />
    </svg>
  );
}
export function RocketIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 .2Z" />
      <path d="M9 13c5-1 8-5 10-9-4 2-8 5-9 10" />
      <path d="M14 6a8 8 0 0 1 4 4" />
    </svg>
  );
}
export function SparklesIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6Z" />
      <path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8Z" />
    </svg>
  );
}
export function ArrowRightIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
export function ArrowUpRightIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
export function StarIcon({ filled = true, ...p }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" {...p}>
      <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9Z" />
    </svg>
  );
}
export function MenuIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}
export function CloseIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}
export function CheckIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="m5 12 5 5 9-11" />
    </svg>
  );
}
export function MailIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
export function InstagramIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
export function XIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M17.5 3h3l-7 8 8.2 10h-6.4l-5-6.1L8 21H5l7.4-8.5L4.5 3h6.5l4.5 5.6Zm-1.1 16h1.7L8 4.8H6.2Z" />
    </svg>
  );
}
export function DiscordIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M19.3 5.3A16 16 0 0 0 15.4 4l-.2.4a12 12 0 0 1 3.4 1.6 11 11 0 0 0-9.3-.5 12 12 0 0 1 3.3-1.6L12.4 4a16 16 0 0 0-3.9 1.3C6 9.2 5.2 13 5.6 16.7a16 16 0 0 0 4.9 2.5l.6-1a10 10 0 0 1-1.7-.8l.4-.3a11 11 0 0 0 9.4 0l.4.3a10 10 0 0 1-1.7.8l.6 1a16 16 0 0 0 4.9-2.5c.5-4.3-.8-8-3.1-11.4ZM9.7 14.6c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.5.7 1.4 1.6c0 .9-.6 1.6-1.4 1.6Zm4.6 0c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.5.7 1.4 1.6c0 .9-.6 1.6-1.4 1.6Z" />
    </svg>
  );
}
export function PlayIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M8 5v14l11-7Z" />
    </svg>
  );
}
export function QuoteIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M9 6c-3 .9-5 3.6-5 7v5h6v-6H6.5C6.7 9.7 7.8 8.3 10 7.6Zm10 0c-3 .9-5 3.6-5 7v5h6v-6h-3.5C16.7 9.7 17.8 8.3 20 7.6Z" />
    </svg>
  );
}
export function ShieldIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export const workflowIcons = {
  search: SearchIcon,
  concept: ConceptIcon,
  design: DesignIcon,
  rocket: RocketIcon,
  sparkles: SparklesIcon,
} as const;
