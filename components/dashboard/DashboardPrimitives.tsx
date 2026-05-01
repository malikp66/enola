"use client";

import { motion } from "motion/react";
import {
  Flower2,
  MessageCircle,
  MonitorSmartphone,
  ShoppingBag,
  Sparkles,
  Store,
  Video,
  Wallet,
} from "lucide-react";

import type { DistributionDatum } from "@/types/survey";

export function SectionHeading({
  eyebrow,
  title,
  titleNode,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  titleNode?: React.ReactNode;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55 }}
      className="space-y-3"
    >
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[var(--brand-royal)]">
        {eyebrow}
      </p>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="space-y-3">
          <h2 className="font-heading text-[2.4rem] leading-none text-[#111215] md:text-[3.2rem]">
            {titleNode ?? title}
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-[var(--brand-muted)] md:text-[0.98rem]">
            {description}
          </p>
        </div>
        {children && <div className="shrink-0 pb-1">{children}</div>}
      </div>
    </motion.div>
  );
}

export function SoftTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: DistributionDatum }>;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="glass-panel rounded-[1.4rem] px-4 py-3">
      <p className="text-sm font-medium text-[#17191d]">{data.label}</p>
      <p className="mt-1 text-sm text-[var(--brand-muted)]">
        {data.value} jawaban • {Math.round(data.percentage)}%
      </p>
    </div>
  );
}

export function LegendPill({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <div className="glass-pill inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-[var(--brand-muted)]">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </div>
  );
}

export function InsightList({
  lines,
}: {
  lines: string[];
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {lines.map((line) => (
        <div
          key={line}
          className="glass-panel rounded-[1.45rem] px-4 py-3 text-sm leading-6 text-[var(--brand-muted)]"
        >
          {line}
        </div>
      ))}
    </div>
  );
}

export function PurchaseChannelIcon({ label }: { label: string }) {
  const normalized = label.toLowerCase();

  if (normalized.includes("marketplace")) {
    return <ShoppingBag aria-hidden="true" className="h-4 w-4" />;
  }

  if (normalized.includes("online")) {
    return <MonitorSmartphone aria-hidden="true" className="h-4 w-4" />;
  }

  if (normalized.includes("instagram")) {
    return <Sparkles aria-hidden="true" className="h-4 w-4" />;
  }

  if (normalized.includes("tiktok")) {
    return <Video aria-hidden="true" className="h-4 w-4" />;
  }

  if (normalized.includes("reseller") || normalized.includes("whatsapp")) {
    return <MessageCircle aria-hidden="true" className="h-4 w-4" />;
  }

  if (normalized.includes("offline") || normalized.includes("toko")) {
    return <Store aria-hidden="true" className="h-4 w-4" />;
  }

  return <ShoppingBag aria-hidden="true" className="h-4 w-4" />;
}

export function TopicIcon({ label }: { label: string }) {
  const normalized = label.toLowerCase();

  if (normalized.includes("aroma") || normalized.includes("bunga")) {
    return <Flower2 aria-hidden="true" className="h-4 w-4" />;
  }

  if (normalized.includes("harga")) {
    return <Wallet aria-hidden="true" className="h-4 w-4" />;
  }

  if (normalized.includes("beli") || normalized.includes("buy")) {
    return <ShoppingBag aria-hidden="true" className="h-4 w-4" />;
  }

  return <Sparkles aria-hidden="true" className="h-4 w-4" />;
}
