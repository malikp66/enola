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
  description,
  children,
}: {
  eyebrow: string;
  title: string;
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
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[#b47c60]">
        {eyebrow}
      </p>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="space-y-3">
          <h2 className="font-heading text-[2.4rem] leading-none text-[#241915] md:text-[3.2rem]">
            {title}
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-[#735f54] md:text-[0.98rem]">
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
    <div className="rounded-[1.4rem] border border-[#ead8cc] bg-white/95 px-4 py-3 shadow-[0_20px_40px_rgba(146,104,79,0.12)] backdrop-blur">
      <p className="text-sm font-medium text-[#2c2018]">{data.label}</p>
      <p className="mt-1 text-sm text-[#7b6458]">
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
    <div className="inline-flex items-center gap-2 rounded-full border border-[#ecdfd6] bg-white/90 px-3 py-1.5 text-xs text-[#7d6759]">
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
          className="rounded-[1.45rem] border border-[#ecddd2] bg-white/90 px-4 py-3 text-sm leading-6 text-[#715d52]"
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
