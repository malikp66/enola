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
}) {
  const isNumeric = typeof value === "number";

  return (
    <Card
      id={id}
      data-tour={id}
      className={cn(
        "group relative h-full overflow-hidden rounded-[2rem] border border-[#ebddd4] py-0 shadow-[0_18px_55px_rgba(145,104,79,0.08)] transition-transform duration-300 hover:-translate-y-1",
        accent
          ? "gap-0 bg-[linear-gradient(145deg,#c57a58_0%,#d79573_28%,#e7b59a_58%,#f4ddd0_82%,#fbf1eb_100%)] text-white"
          : "bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f3_100%)]",
        className
      )}
    >
      {accent ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_38%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_45%,rgba(120,71,48,0.08)_100%)]" />
        </>
      ) : null}
      <CardContent className="relative flex min-h-[14rem] flex-1 flex-col justify-between gap-6 p-6">
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "font-medium tracking-[0.02em]",
                accent
                  ? "text-base leading-7 text-white/92 md:text-[1.15rem]"
                  : "text-sm text-[#7e675a]"
              )}
            >
              {title}
            </p>
          </div>
          <div
            className={cn(
              "grid h-12 w-12 place-items-center rounded-full border",
              accent
                ? "border-white/25 bg-white/15 text-white"
                : "border-[#ecd9ce] bg-white/90 text-[#bb7f61]"
            )}
          >
            <Icon aria-hidden="true" className="h-5 w-5" />
          </div>
        </div>
        <div className="relative space-y-3">
          <div
            className={cn(
              "font-heading leading-none",
              accent ? "text-[3.35rem] text-white md:text-[4.2rem]" : "text-4xl text-[#231814] md:text-[3.1rem]"
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
                ? "w-full max-w-none text-base leading-7 text-white/92 md:text-[1.02rem]"
                : "text-sm leading-6 text-[#7a6558]"
            )}
          >
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
