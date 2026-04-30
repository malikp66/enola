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

const ACTIVITY_RING_COLORS = ["#c77f5c", "#d99673", "#e7b39a", "#f1d9cc"];

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
              <stop offset="0%" stopColor="#cb8562" />
              <stop offset="58%" stopColor="#e8baa2" />
              <stop offset="100%" stopColor="#f8ebe2" />
            </linearGradient>
          </defs>
          <CartesianGrid horizontal stroke="#f1e7df" strokeDasharray="4 7" />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#998376", fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#7b6659", fontSize: 12 }}
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
              <stop offset="0%" stopColor="#cb8462" />
              <stop offset="58%" stopColor="#e8baa2" />
              <stop offset="100%" stopColor="#f8ebe2" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#f1e7df" vertical={false} strokeDasharray="4 7" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#7b6659", fontSize: 12 }}
            interval={0}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#998376", fontSize: 12 }}
          />
          <Tooltip content={<SoftTooltip />} cursor={{ fill: "rgba(239, 222, 212, 0.28)" }} />
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

  return (
    <div className="grid h-[19rem] items-center gap-6 md:grid-cols-[0.94fr_1.06fr]">
      <div className="relative mx-auto flex h-[15rem] w-[15rem] items-center justify-center">
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
                stroke="rgba(243,232,225,0.92)"
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
        <div className="absolute inset-[31%] rounded-full border border-[#efe1d7] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(252,245,240,0.9))] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]" />
        <div className="absolute text-center">
          <p className="font-heading text-[2.3rem] leading-none text-[#261a14]">
            {Math.round(ordered[0]?.percentage ?? 0)}%
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {ordered.map((item, index) => (
          <div
            key={item.label}
            className="rounded-[1.2rem] border border-[#efdfd4] bg-white/92 px-3.5 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="block h-3 w-3 rounded-full"
                  style={{ backgroundColor: ACTIVITY_RING_COLORS[index % ACTIVITY_RING_COLORS.length] }}
                />
                <div>
                  <p className="text-sm font-medium text-[#2b1f18]">{item.label}</p>
                  <p className="text-xs text-[#8c7467]">{item.value} jawaban</p>
                </div>
              </div>
              <span className="font-heading text-[1.45rem] leading-none text-[#2b1f18]">
                {Math.round(item.percentage)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
