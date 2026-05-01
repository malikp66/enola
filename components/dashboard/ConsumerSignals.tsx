"use client";

import {
  CalendarClock,
  MessageCircleWarning,
  ShieldAlert,
  ShoppingBag,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/ui/ChartCard";
import { SectionHeading, SoftTooltip } from "@/components/dashboard/DashboardPrimitives";
import type { DistributionDatum, SurveyAnalytics } from "@/types/survey";

const ACTIVITY_RING_COLORS = ["#212529", "#343a40", "#495057", "#adb5bd"];

export function ConsumerSignals({ analytics }: { analytics: SurveyAnalytics }) {
  const { consumerSignals } = analytics;

  return (
    <section id="consumer-signals" className="space-y-6">
      <SectionHeading
        eyebrow="Consumer Signals"
        title="Pertanyaan survei pendukung yang memperkaya narasi"
        description="Section ini menampung pertanyaan survei lain yang penting untuk positioning Enola: apa yang paling dicari saat membeli kerudung, seberapa sering pengguna merasa kurang segar, dan kekhawatiran apa yang muncul terhadap ide kerudung wangi."
      />

      <div className="grid auto-rows-fr items-stretch gap-5 xl:grid-cols-2">
        <ChartCard
          id="buying-priority-chart"
          title="Buying Priority"
          description="Hal yang paling penting saat responden memilih kerudung."
          icon={ShoppingBag}
          className="h-full min-h-[31rem]"
        >
          <HorizontalSignalChart
            data={consumerSignals.buyingPriorityChart}
            gradientId="priority-gradient"
            minHeightClass="h-[19rem]"
          />
        </ChartCard>
        <ChartCard
          id="freshness-discomfort-chart"
          title="Freshness Discomfort"
          description="Frekuensi responden merasa kurang nyaman karena kerudung terasa bau atau tidak segar."
          icon={MessageCircleWarning}
          className="h-full min-h-[31rem]"
        >
          <ActivityRingChart data={consumerSignals.freshnessDiscomfortChart} />
        </ChartCard>
        <ChartCard
          id="main-concern-chart"
          title="Main Concern"
          description="Kekhawatiran terbesar responden terhadap konsep kerudung wangi."
          icon={ShieldAlert}
          className="h-full min-h-[31rem]"
        >
          <HorizontalSignalChart
            data={consumerSignals.mainConcernChart}
            gradientId="concern-gradient"
            minHeightClass="h-[19rem]"
          />
        </ChartCard>
        <ChartCard
          id="buying-frequency-chart"
          title="Buying Frequency"
          description="Seberapa sering responden membeli kerudung baru."
          icon={CalendarClock}
          className="h-full min-h-[31rem]"
        >
          <VerticalSignalChart
            data={analytics.marketOverview.buyingFrequency}
            gradientId="buying-frequency-gradient"
            minHeightClass="h-[19rem]"
          />
        </ChartCard>
      </div>
    </section>
  );
}

function HorizontalSignalChart({
  data,
  gradientId,
  minHeightClass,
}: {
  data: DistributionDatum[];
  gradientId: string;
  minHeightClass: string;
}) {
  return (
    <div className={minHeightClass}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#212529" />
              <stop offset="56%" stopColor="#495057" />
              <stop offset="100%" stopColor="#adb5bd" />
            </linearGradient>
          </defs>
          <CartesianGrid horizontal stroke="rgba(206,212,218,0.88)" strokeDasharray="4 7" />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6c757d", fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#495057", fontSize: 12 }}
            width={120}
          />
          <Tooltip content={<SoftTooltip />} />
          <Bar dataKey="value" radius={[0, 18, 18, 0]} fill={`url(#${gradientId})`} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function VerticalSignalChart({
  data,
  gradientId,
  minHeightClass,
}: {
  data: DistributionDatum[];
  gradientId: string;
  minHeightClass: string;
}) {
  return (
    <div className={minHeightClass}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={16}>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#212529" />
              <stop offset="56%" stopColor="#495057" />
              <stop offset="100%" stopColor="#adb5bd" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(206,212,218,0.88)" vertical={false} strokeDasharray="4 7" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#495057", fontSize: 12 }}
            interval={0}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6c757d", fontSize: 12 }}
          />
          <Tooltip content={<SoftTooltip />} cursor={{ fill: "rgba(233, 236, 239, 0.76)" }} />
          <Bar dataKey="value" radius={[18, 18, 8, 8]} fill={`url(#${gradientId})`} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ActivityRingChart({ data }: { data: DistributionDatum[] }) {
  const ordered = [...data].sort((left, right) => right.value - left.value);
  const radii = [84, 63, 42, 21];
  const circumference = radii.map((radius) => 2 * Math.PI * radius);
  const leadSignal = ordered[0];

  return (
    <div className="grid h-[19rem] items-center gap-6 md:grid-cols-[0.94fr_1.06fr]">
      <div className="group relative mx-auto flex h-[15rem] w-[15rem] items-center justify-center">
        <svg
          viewBox="0 0 220 220"
          className="h-full w-full -rotate-90"
          aria-label="Freshness discomfort activity rings"
        >
          {ordered.map((item, index) => (
            <g key={item.label}>
              <circle
                cx="110"
                cy="110"
                r={radii[index]}
                fill="none"
                stroke="rgba(233,236,239,0.92)"
                strokeWidth="14"
              />
              <circle
                cx="110"
                cy="110"
                r={radii[index]}
                fill="none"
                stroke={ACTIVITY_RING_COLORS[index % ACTIVITY_RING_COLORS.length]}
                strokeDasharray={`${circumference[index] * (item.percentage / 100)} ${circumference[index]}`}
                strokeLinecap="round"
                strokeWidth="14"
              />
            </g>
          ))}
        </svg>
        <div className="glass-panel absolute inset-[31%] rounded-full" />
        <div className="absolute text-center">
          <div className="relative inline-flex flex-col items-center">
            <button
              type="button"
              className="cursor-help rounded-full px-2 py-1"
              aria-label={`Lihat detail sinyal tertinggi: ${leadSignal?.label ?? "Belum ada data"}`}
            >
              <p className="font-heading text-[2.3rem] leading-none text-[#111215]">
                {Math.round(leadSignal?.percentage ?? 0)}%
              </p>
            </button>
            {leadSignal ? (
              <div className="glass-panel pointer-events-none absolute left-1/2 top-full z-10 mt-3 w-max min-w-[11rem] -translate-x-1/2 rounded-[1.1rem] px-3 py-2 text-left opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-royal)]">
                  Top signal
                </p>
                <p className="mt-1 text-sm font-medium text-[#17191d]">{leadSignal.label}</p>
                <p className="mt-1 text-xs text-[var(--brand-muted)]">
                  {leadSignal.value} jawaban • {Math.round(leadSignal.percentage)}%
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {ordered.map((item, index) => (
          <div
            key={item.label}
            className="glass-panel rounded-[1.2rem] px-3.5 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="block h-3 w-3 rounded-full"
                  style={{ backgroundColor: ACTIVITY_RING_COLORS[index % ACTIVITY_RING_COLORS.length] }}
                />
                <div>
                  <p className="text-sm font-medium text-[#17191d]">{item.label}</p>
                  <p className="text-xs text-[var(--brand-muted)]">{item.value} jawaban</p>
                </div>
              </div>
              <span className="font-heading text-[1.45rem] leading-none text-[#17191d]">
                {Math.round(item.percentage)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
