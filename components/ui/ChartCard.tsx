"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ChartCard({
  id,
  title,
  description,
  icon: Icon,
  children,
  footer,
  className,
}: {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card
        id={id}
        data-tour={id}
        className={cn(
          "overflow-hidden rounded-[2rem] border border-[#eadbd2] bg-[linear-gradient(180deg,#ffffff_0%,#fdf8f5_100%)] shadow-[0_22px_55px_rgba(148,104,79,0.08)]",
          className
        )}
      >
        <CardHeader className="relative gap-3 px-6 pt-6">
          <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(203,133,96,0.35),transparent)]" />
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle className="font-heading text-[2rem] leading-none text-[#241914]">
                {title}
              </CardTitle>
              <p className="max-w-xl text-sm leading-6 text-[#7a6558]">{description}</p>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-full border border-[#eddccf] bg-white/90 text-[#bc7a5e]">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 px-6 pb-6">
          {children}
          {footer}
        </CardContent>
      </Card>
    </motion.div>
  );
}
