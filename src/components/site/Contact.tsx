"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionBackground } from "./SectionBackground";
import { SectionHeading, Reveal, MagneticButton } from "@/components/ui/primitives";
import {
  MailIcon,
  InstagramIcon,
  XIcon,
  DiscordIcon,
  CheckIcon,
} from "@/components/ui/icons";
import type { ContactData, SectionBg } from "@/lib/types";
import type { SVGProps } from "react";

function Field({
  id,
  label,
  type = "text",
  textarea = false,
}: {
  id: string;
  label: string;
  type?: string;
  textarea?: boolean;
}) {
  const shared =
    "peer w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 pb-2 pt-6 text-sm text-ink outline-none transition-colors duration-300 placeholder:text-transparent focus:border-primary focus:bg-white/[0.04] resize-none";
  return (
    <div className="relative">
      {textarea ? (
        <textarea id={id} name={id} rows={4} placeholder=" " className={shared} required />
      ) : (
        <input id={id} name={id} type={type} placeholder=" " className={shared} required />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-4 text-sm text-muted transition-all duration-200 peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]"
      >
        {label}
      </label>
    </div>
  );
}

function InfoLink({
  Icon,
  label,
  href,
}: {
  Icon: (p: SVGProps<SVGSVGElement>) => ReactNode;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 transition-colors hover:border-primary/40"
    >
      <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
        <Icon className="size-5" />
      </span>
      <span className="text-sm text-white/90">{label}</span>
    </a>
  );
}

export function Contact({
  data,
  bg,
}: {
  data: ContactData;
  bg?: SectionBg;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        setError(json.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <SectionBackground id="contact" bg={bg} className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={data.eyebrow}
          title={data.title}
          subtitle={data.subtitle}
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {/* info */}
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col justify-between gap-6 rounded-3xl glass-strong p-7 sm:p-8">
              <div>
                <h3 className="font-display text-xl font-bold">Let's talk</h3>
                <p className="mt-2 text-sm text-muted">
                  Reach out on any platform — or send a message directly.
                </p>
              </div>
              <div className="grid gap-3">
                <InfoLink Icon={MailIcon} label={data.email} href={`mailto:${data.email}`} />
                <InfoLink Icon={DiscordIcon} label="Discord" href={data.discord} />
                <InfoLink Icon={InstagramIcon} label="Instagram" href={data.instagram} />
                <InfoLink Icon={XIcon} label="X (Twitter)" href={data.x} />
              </div>
            </div>
          </Reveal>

          {/* form */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="relative h-full rounded-3xl glass-strong p-7 sm:p-8">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-full min-h-[340px] flex-col items-center justify-center text-center"
                  >
                    <div className="grid size-16 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/20">
                      <CheckIcon className="size-8" />
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-bold">
                      {data.successTitle}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-muted">
                      {data.successText}
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-6 text-sm font-semibold text-primary hover:underline"
                    >
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid gap-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id="name" label="Name" />
                      <Field id="email" label="Email" type="email" />
                    </div>
                    <Field id="subject" label="Subject" />
                    <Field id="message" label="Message" textarea />

                    {status === "error" && (
                      <p className="text-sm text-primary">{error}</p>
                    )}

                    <div className="mt-2">
                      <MagneticButton
                        type="submit"
                        variant="primary"
                        strength={0.25}
                      >
                        {status === "loading" ? "Sending…" : "Send Message"}
                      </MagneticButton>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionBackground>
  );
}
