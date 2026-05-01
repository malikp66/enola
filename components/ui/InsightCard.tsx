"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export function InsightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "glass-panel flex gap-3 rounded-[1.6rem] px-4 py-4",
        className
      )}
    >
      <div className="glass-icon mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--brand-royal)]">
        <Sparkles aria-hidden="true" className="h-4 w-4" />
      </div>
      <p className="text-sm leading-6 text-[var(--brand-muted)]">{children}</p>
    </motion.div>
  );
}
