"use client";

import { motion } from "framer-motion";
import { SectionBackground } from "./SectionBackground";
import { SectionHeading, Reveal } from "@/components/ui/primitives";
import { workflowIcons, SparklesIcon } from "@/components/ui/icons";
import type { WorkflowData, WorkflowStep, SectionBg } from "@/lib/types";

function WorkflowCard({
  step,
  index,
}: {
  step: WorkflowStep;
  index: number;
}) {
  const Icon = workflowIcons[step.icon as keyof typeof workflowIcons] ?? SparklesIcon;
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative h-full overflow-hidden rounded-3xl glass p-7 transition-colors duration-500 hover:border-primary/40 hover:shadow-[0_30px_70px_-35px_var(--c-primary-glow)]"
    >
      <div className="absolute -right-5 -top-7 select-none font-display text-8xl font-extrabold text-white/[0.04] transition-colors duration-500 group-hover:text-primary/10">
        {step.number}
      </div>
      <div className="relative">
        <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-500 group-hover:scale-110">
          <Icon className="size-7" />
        </div>
        <div className="mb-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Step {step.number}
        </div>
        <h3 className="font-display text-xl font-bold">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {step.description}
        </p>
      </div>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-primary to-transparent transition-transform duration-500 group-hover:scale-x-100" />
    </motion.div>
  );
}

export function Workflow({
  data,
  bg,
}: {
  data: WorkflowData;
  bg?: SectionBg;
}) {
  return (
    <SectionBackground id="workflow" bg={bg} className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={data.eyebrow}
          title={data.title}
          subtitle={data.subtitle}
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1}>
              <WorkflowCard step={step} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </SectionBackground>
  );
}
