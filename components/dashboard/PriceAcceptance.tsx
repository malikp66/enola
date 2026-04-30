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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChartCard } from "@/components/ui/ChartCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionHeading, SoftTooltip } from "@/components/dashboard/DashboardPrimitives";
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
                    <stop offset="0%" stopColor="#cb8160" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#cb8160" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="current-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#876f62" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#876f62" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f2e8e1" vertical={false} strokeDasharray="4 7" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#7a6457", fontSize: 11 }}
                  interval={0}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#7a6457", fontSize: 12 }}
                  width={30}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-[1.35rem] border border-[#ead8cc] bg-white/98 px-4 py-3 shadow-[0_20px_45px_rgba(146,104,79,0.15)] backdrop-blur-sm">
                        <p className="mb-2 text-xs font-semibold text-[#2c2018]">
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
                                <span className="text-sm text-[#7b6458]">{entry.name}</span>
                              </div>
                              <span className="text-sm font-bold text-[#2b1f18]">
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
                  stroke="#cb8160"
                  strokeWidth={3}
                  fill="url(#acceptable-gradient)"
                  activeDot={{ r: 6, fill: "#cb8160", stroke: "#fff", strokeWidth: 2 }}
                />
                <Area
                  name="Current"
                  type="monotone"
                  dataKey="current"
                  stroke="#876f62"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#current-gradient)"
                  activeDot={{ r: 6, fill: "#876f62", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="price-fit-method"
                className="rounded-[1.45rem] border border-[#efdfd6] bg-[#fffaf7]/50 px-4"
              >
                <AccordionTrigger className="py-4 text-left text-sm font-medium text-[#2a1f18] hover:no-underline">
                  Interpretasi Data Pembanding
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-xs leading-6 text-[#715c50]">
                  Garis putus-putus cokelat menunjukkan kebiasaan belanja asli responden. Jika garis oranye Enola lebih tinggi di rentang Rp100k-200k dibanding garis cokelat, artinya produk ini berhasil menarik segmen yang bersedia "upgrade" harga demi manfaat yang ditawarkan.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="price-method"
                className="rounded-[1.45rem] border border-[#efdfd6] bg-[#fffaf7]/50 px-4"
              >
                <AccordionTrigger className="py-4 text-left text-sm font-medium text-[#2a1f18] hover:no-underline">
                  Metode Price Fit
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-xs leading-6 text-[#715c50]">
                  Target MVP Enola adalah Rp100.000 - Rp200.000. Score Price Fit dihitung dari proporsi jawaban responden yang menyatakan rentang ini "cocok" dibanding total jawaban valid dalam survei.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
