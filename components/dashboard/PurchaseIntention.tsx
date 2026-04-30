"use client";

import { MousePointerClick, PieChart, TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartCard } from "@/components/ui/ChartCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { LegendPill, SectionHeading, SoftTooltip } from "@/components/dashboard/DashboardPrimitives";
import type { SurveyAnalytics } from "@/types/survey";

const PURCHASE_COLORS = ["#c97f5d", "#e6b49c", "#f0d8cc", "#f7ede7"];

export function PurchaseIntention({ analytics }: { analytics: SurveyAnalytics }) {
  const { purchaseIntention } = analytics;

  return (
    <section id="purchase-intention" className="space-y-6">
      <SectionHeading
        eyebrow="Purchase Intention"
        title="Melihat sinyal willingness to try"
        description="Interest belum tentu berujung beli. Bagian ini membaca seberapa besar kemungkinan responden benar-benar ingin mencoba membeli jika produk tersedia."
      />

      <div className="grid items-start gap-5 xl:grid-cols-[0.84fr_1.16fr]">
        <div className="grid h-full content-start gap-5">
          <MetricCard
            id="purchase-potential-card"
            title="Purchase Potential Score"
            value={purchaseIntention.purchaseIntentionScore}
            suffix="%"
            description="Gabungan jawaban Sangat mungkin dan Mungkin sebagai indikator purchase potential."
            icon={TrendingUp}
            accent
            className="h-full"
          />
          <MetricCard
            id="conversion-opportunity-card"
            title="Conversion Opportunity"
            value="Conversion signal"
            description={purchaseIntention.conversionOpportunity}
            icon={MousePointerClick}
            className="h-full"
          />
        </div>

        <ChartCard
          id="purchase-intention-chart"
          title="Purchase Intention Donut"
          description="Distribusi kemungkinan responden mencoba membeli produk."
          icon={PieChart}
        >
          <div className="grid gap-4">
            <div className="h-[20rem]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Tooltip content={<SoftTooltip />} />
                  <Pie
                    data={purchaseIntention.purchaseIntentionChart}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={92}
                    paddingAngle={4}
                    cornerRadius={20}
                    animationDuration={1200}
                  >
                    {purchaseIntention.purchaseIntentionChart.map((entry, index) => (
                      <Cell
                        key={entry.label}
                        fill={PURCHASE_COLORS[index % PURCHASE_COLORS.length]}
                        stroke="#fffaf7"
                        strokeWidth={4}
                      />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {purchaseIntention.purchaseIntentionChart.map((item, index) => (
                  <LegendPill
                    key={item.label}
                    label={`${item.label} · ${item.value}`}
                    color={PURCHASE_COLORS[index % PURCHASE_COLORS.length]}
                  />
                ))}
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
