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
        "flex gap-3 rounded-[1.6rem] border border-[#ecdccf] bg-[linear-gradient(180deg,#fffdfb_0%,#fcf6f2_100%)] px-4 py-4 shadow-[0_14px_35px_rgba(145,104,79,0.06)]",
        className
      )}
    >
      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#f4e1d4,#f9f4ef)] text-[#be7d61]">
        <Sparkles aria-hidden="true" className="h-4 w-4" />
      </div>
      <p className="text-sm leading-6 text-[#6b594f]">{children}</p>
    </motion.div>
  );
}
