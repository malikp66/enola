"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CalendarClock,
  ChevronDown,
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
        title="Sinyal perilaku yang memperkaya konteks pasar"
        description="Bagian ini membantu membaca kebiasaan dan pertimbangan responden, mulai dari prioritas saat membeli kerudung hingga rasa kurang nyaman yang bisa menguatkan konteks kebutuhan scented hijab."
      />

      <div id="consumer-signals-content" className="grid auto-rows-fr items-stretch gap-5 xl:grid-cols-2">
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
  const [activeRingLabel, setActiveRingLabel] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const activeRing = ordered.find((item) => item.label === activeRingLabel) ?? leadSignal ?? null;

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
                className="cursor-help transition-opacity duration-200 hover:opacity-90 focus:opacity-90"
                tabIndex={0}
                role="button"
                aria-label={`${item.label}: ${item.value} jawaban atau ${Math.round(item.percentage)} persen`}
                onMouseEnter={() => {
                  setActiveRingLabel(item.label);
                  setShowTooltip(true);
                }}
                onFocus={() => {
                  setActiveRingLabel(item.label);
                  setShowTooltip(true);
                }}
                onMouseLeave={() => {
                  setActiveRingLabel(null);
                  setShowTooltip(false);
                }}
                onBlur={() => {
                  setActiveRingLabel(null);
                  setShowTooltip(false);
                }}
              />
            </g>
          ))}
        </svg>
        {activeRing && showTooltip ? (
          <div className="pointer-events-none absolute -right-3 top-5 z-10 max-w-[11rem] text-left">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#6c757d]">
              {activeRing.label}
            </p>
            <p className="mt-1 text-sm font-medium text-[#17191d]">
              {activeRing.value} jawaban • {Math.round(activeRing.percentage)}%
            </p>
          </div>
        ) : null}
      </div>

      <FreshnessScrollableList
        items={ordered}
        colors={ACTIVITY_RING_COLORS}
        onItemFocus={(item) => {
          setActiveRingLabel(item.label);
          setShowTooltip(true);
        }}
        onItemLeave={() => {
          setActiveRingLabel(null);
          setShowTooltip(false);
        }}
      />
    </div>
  );
}

function FreshnessScrollableList({
  items,
  colors,
  onItemFocus,
  onItemLeave,
}: {
  items: DistributionDatum[];
  colors: string[];
  onItemFocus: (item: DistributionDatum) => void;
  onItemLeave: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);

  const updateScrollState = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;
    const maxScroll = node.scrollHeight - node.clientHeight;
    setCanScrollUp(node.scrollTop > 8);
    setCanScrollDown(maxScroll - node.scrollTop > 8);
  }, []);

  useEffect(() => {
    updateScrollState();
    const node = scrollRef.current;
    if (!node) return;
    node.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      node.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="custom-scrollbar scrollbar-reveal max-h-[15rem] space-y-3 overflow-y-auto pr-1.5 pb-12 md:max-h-none md:overflow-visible md:pb-0"
      >
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className="glass-panel block w-full rounded-[1.2rem] px-3.5 py-3 text-left transition duration-200 hover:border-[#adb5bd] focus:outline-none focus:ring-2 focus:ring-[#6c757d]/25"
            onMouseEnter={() => onItemFocus(item)}
            onMouseLeave={onItemLeave}
            onFocus={() => onItemFocus(item)}
            onBlur={onItemLeave}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="block h-3 w-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
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
          </button>
        ))}
      </div>

      {canScrollUp ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-[linear-gradient(180deg,#f8f9fa_0%,rgba(248,249,250,0)_100%)] md:hidden" />
      ) : null}
      {canScrollDown ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,rgba(248,249,250,0)_0%,rgba(248,249,250,0.9)_62%,#f8f9fa_100%)] md:hidden" />
          <button
            type="button"
            aria-label="Scroll daftar sinyal ke bawah"
            className="glass-icon absolute bottom-2 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full md:hidden"
            onClick={() =>
              scrollRef.current?.scrollBy({
                top: 144,
                behavior: "smooth",
              })
            }
          >
            <ChevronDown className="h-4 w-4 text-[#495057]" />
          </button>
        </>
      ) : null}
    </div>
  );
}
