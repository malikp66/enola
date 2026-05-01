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
  hideIcon = false,
  descriptionClassName,
}: {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  hideIcon?: boolean;
  descriptionClassName?: string;
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
          "glass-panel overflow-hidden rounded-[2rem]",
          className
        )}
      >
        <CardHeader className="relative gap-3 px-6 pt-6">
          <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(173,181,189,0.42),rgba(206,212,218,0.7),transparent)]" />
          <div className={cn("flex items-start gap-4", hideIcon ? "justify-start" : "justify-between")}>
            <div className={cn("space-y-1.5", hideIcon && "w-full")}>
              <CardTitle className="font-heading text-[2rem] leading-none text-[#111215]">
                {title}
              </CardTitle>
              <p className={cn("max-w-xl text-sm leading-6 text-[var(--brand-muted)]", descriptionClassName)}>
                {description}
              </p>
            </div>
            {!hideIcon ? (
              <div className="glass-icon grid h-11 w-11 place-items-center rounded-full text-[var(--brand-royal)]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </div>
            ) : null}
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
