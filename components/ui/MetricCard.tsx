"use client";

import { animate } from "motion/react";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function AnimatedNumber({
  value,
  suffix,
  prefix,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

export function MetricCard({
  id,
  title,
  value,
  description,
  icon: Icon,
  accent = false,
  suffix,
  prefix,
  className,
  valueClassName,
}: {
  id: string;
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  accent?: boolean;
  suffix?: string;
  prefix?: string;
  className?: string;
  valueClassName?: string;
}) {
  const isNumeric = typeof value === "number";

  return (
    <Card
      id={id}
      data-tour={id}
      className={cn(
        "group relative h-full overflow-hidden rounded-[2rem] py-0 transition-transform duration-300 hover:-translate-y-1",
        accent
          ? "glass-panel-strong gap-0 text-[#111215]"
          : "glass-panel text-[#111215]",
        className
      )}
    >
      {accent ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#212529_0%,#343a40_46%,#495057_78%,#adb5bd_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(248,249,250,0.16),transparent_30%)]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[48%] bg-[linear-gradient(90deg,rgba(248,249,250,0.08),transparent)]" />
        </>
      ) : null}
      <CardContent className="relative flex min-h-[14rem] flex-1 flex-col justify-between gap-6 p-6">
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "font-medium tracking-[0.02em]",
                accent
                  ? "text-base leading-7 text-[#e9ecef] md:text-[1.15rem]"
                  : "text-sm text-[var(--brand-muted)]"
              )}
            >
              {title}
            </p>
          </div>
          <div
            className={cn(
              "grid h-12 w-12 place-items-center rounded-full border",
              accent
                ? "border-[rgba(248,249,250,0.22)] bg-[rgba(248,249,250,0.1)] text-[#f8f9fa] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                : "glass-icon text-[var(--brand-royal)]"
            )}
          >
            <Icon aria-hidden="true" className="h-5 w-5" />
          </div>
        </div>
        <div className="relative space-y-3">
          <div
            className={cn(
              "font-heading leading-none",
              accent ? "text-[3.55rem] text-[#f8f9fa] md:text-[4.65rem]" : "text-4xl text-[#111215] md:text-[3.1rem]",
              valueClassName
            )}
          >
            {isNumeric ? (
              <AnimatedNumber value={value} suffix={suffix} prefix={prefix} />
            ) : (
              value
            )}
          </div>
          <p
            className={cn(
              accent
                ? "w-full max-w-none text-base leading-7 text-[#dee2e6] md:text-[1.02rem]"
                : "text-sm leading-6 text-[var(--brand-muted)]"
            )}
          >
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
