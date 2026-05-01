"use client";

import { BadgeDollarSign, Tag, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/ui/ChartCard";
import { InsightCard } from "@/components/ui/InsightCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { LegendPill, SectionHeading } from "@/components/dashboard/DashboardPrimitives";
import type { SurveyAnalytics } from "@/types/survey";

export function PriceAcceptance({ analytics }: { analytics: SurveyAnalytics }) {
  const { priceAcceptance } = analytics;

  // Helper to align and sort price ranges for the chart
  const PRICE_ORDER = [
    "Di bawah Rp100.000",
    "Rp50.000 - Rp100.000",
    "Rp100.000 - Rp200.000",
    "Rp200.000 - Rp300.000",
    "Di atas Rp300.000",
  ];

  const combinedData = PRICE_ORDER.map((label) => {
    const acceptable = priceAcceptance.acceptablePriceChart.find((d) => d.label === label);
    const current = priceAcceptance.currentPriceChart.find((d) => d.label === label);

    return {
      label: label.replace("Rp", ""), // Shorten label for chart
      acceptable: acceptable?.value ?? 0,
      current: current?.value ?? 0,
    };
  });

  return (
    <section id="price-acceptance" className="space-y-6">
      <SectionHeading
        eyebrow="Price Acceptance"
        title="Membaca titik harga yang paling bisa diterima"
        description="Section ini membandingkan harga yang biasa dibeli responden dengan harga yang masih cocok untuk ide produk Enola, lalu mengukurnya terhadap target MVP Rp100.000 - Rp200.000."
      />

      <div className="grid items-stretch gap-5 xl:grid-cols-[0.84fr_1.16fr]">
        <div className="grid h-full gap-5">
          <MetricCard
            id="best-price-card"
            title="Best Price Range"
            value={priceAcceptance.topPriceRange}
            description="Rentang harga yang paling banyak diterima responden untuk produk ini."
            icon={BadgeDollarSign}
            accent
            className="h-full"
            valueClassName="text-[2.5rem] leading-[0.95] tracking-tight md:text-[3.1rem] lg:text-[3.35rem]"
          />
          <MetricCard
            id="price-fit-card"
            title="Price Fit Score"
            value={priceAcceptance.priceFitScore}
            suffix="%"
            description="Kecocokan target harga Enola Rp100.000 - Rp200.000 terhadap preferensi responden."
            icon={Wallet}
            className="h-full"
          />
        </div>

        <ChartCard
          id="price-comparison-chart"
          title="Price Validation Comparison"
          description="Perbandingan antara harga kebiasaan beli responden (Current) vs harga yang mereka terima untuk produk Enola (Acceptable)."
          icon={Tag}
          className="h-full"
        >
          <div className="mb-6 h-[22rem]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combinedData} margin={{ left: 8, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="acceptable-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#343a40" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#343a40" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="current-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#adb5bd" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#adb5bd" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(206,212,218,0.88)" vertical={false} strokeDasharray="4 7" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6c757d", fontSize: 11 }}
                  interval={0}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6c757d", fontSize: 12 }}
                  width={30}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="glass-panel rounded-[1.35rem] px-4 py-3">
                        <p className="mb-2 text-xs font-semibold text-[#17191d]">
                          Rp {payload[0].payload.label}
                        </p>
                        <div className="space-y-1.5">
                          {payload.map((entry) => (
                            <div key={entry.name} className="flex items-center justify-between gap-6">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm text-[var(--brand-muted)]">{entry.name}</span>
                              </div>
                              <span className="text-sm font-bold text-[#17191d]">
                                {entry.value} jawaban
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }}
                />
                <Area
                  name="Acceptable"
                  type="monotone"
                  dataKey="acceptable"
                  stroke="#343a40"
                  strokeWidth={3}
                  fill="url(#acceptable-gradient)"
                  activeDot={{ r: 6, fill: "#343a40", stroke: "#f8f9fa", strokeWidth: 2 }}
                />
                <Area
                  name="Current"
                  type="monotone"
                  dataKey="current"
                  stroke="#adb5bd"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#current-gradient)"
                  activeDot={{ r: 6, fill: "#adb5bd", stroke: "#f8f9fa", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <LegendPill label="Acceptable Price" color="#343a40" />
            <LegendPill label="Current Buying Range" color="#adb5bd" />
          </div>

          <div className="grid gap-4">
            <InsightCard className="w-full">
              Price Fit dihitung dari porsi responden yang menilai rentang Rp100.000 - Rp200.000
              masih cocok untuk Enola dibanding total jawaban valid, sehingga score ini langsung
              membaca kecocokan target harga MVP terhadap ekspektasi pasar.
            </InsightCard>
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
