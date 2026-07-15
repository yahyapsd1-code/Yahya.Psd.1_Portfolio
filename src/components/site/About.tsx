"use client";

import { motion } from "framer-motion";
import { SectionBackground } from "./SectionBackground";
import { SectionHeading, Reveal, GlassCard } from "@/components/ui/primitives";
import type { AboutData, SectionBg, Skill } from "@/lib/types";

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-ink">{skill.name}</span>
        <span className="font-display text-xs font-semibold text-primary">
          {skill.level}%
        </span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 1.1,
            delay: 0.1 * index,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_12px_var(--c-primary-glow)]"
        />
      </div>
    </div>
  );
}

export function About({
  data,
  bg,
}: {
  data: AboutData;
  bg?: SectionBg;
}) {
  return (
    <SectionBackground id="about" bg={bg} className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading align="left" eyebrow={data.eyebrow} title={data.title} />
            <Reveal delay={0.1}>
              <div className="mt-6 space-y-4 leading-relaxed text-muted">
                {data.paragraphs.map((p, i) => (
                  <p key={i} className="text-base sm:text-lg">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex items-center gap-4">
                <span className="font-display text-3xl font-bold italic text-gradient-red">
                  {data.signature}
                </span>
                <span className="h-px w-16 bg-gradient-to-r from-primary to-transparent" />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <GlassCard hover={false} className="p-7 sm:p-9">
              <div className="mb-7 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Core Skills</h3>
                <span className="text-xs uppercase tracking-[0.2em] text-muted">
                  Mastery
                </span>
              </div>
              <div className="space-y-5">
                {data.skills.map((skill, i) => (
                  <SkillBar key={skill.name} skill={skill} index={i} />
                ))}
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </SectionBackground>
  );
}
