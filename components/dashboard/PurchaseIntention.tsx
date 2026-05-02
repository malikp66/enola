"use client";

import { MousePointerClick, PieChart, TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartCard } from "@/components/ui/ChartCard";
import { InsightCard } from "@/components/ui/InsightCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { LegendPill, SectionHeading, SoftTooltip } from "@/components/dashboard/DashboardPrimitives";
import type { SurveyAnalytics } from "@/types/survey";

const PURCHASE_COLORS = ["#212529", "#343a40", "#495057", "#adb5bd"];

export function PurchaseIntention({ analytics }: { analytics: SurveyAnalytics }) {
  const { purchaseIntention } = analytics;
  const strongestSignal = purchaseIntention.purchaseIntentionChart[0];
  const hesitantSignal =
    purchaseIntention.purchaseIntentionChart[purchaseIntention.purchaseIntentionChart.length - 1];

  return (
    <section id="purchase-intention" className="space-y-6">
      <SectionHeading
        eyebrow="Purchase Intention"
        title="Seberapa kuat niat responden untuk mencoba"
        description="Ketertarikan belum selalu berubah menjadi niat beli. Bagian ini membantu melihat apakah rasa penasaran yang muncul sudah cukup dekat dengan keinginan untuk mencoba saat produk tersedia."
      />

      <div id="purchase-intention-content" className="grid items-stretch gap-5 xl:grid-cols-[0.84fr_1.06fr]">
        <div className="grid h-full gap-5 xl:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
          <MetricCard
            id="purchase-potential-card"
            title="Purchase Potential Score"
            value={purchaseIntention.purchaseIntentionScore}
            suffix="%"
            description="Gabungan jawaban Sangat mungkin dan Mungkin sebagai indikator purchase potential."
            icon={TrendingUp}
            accent
            className="h-full min-h-[13.5rem]"
          />
          <MetricCard
            id="conversion-opportunity-card"
            title="Conversion Opportunity"
            value="Conversion signal"
            description={purchaseIntention.conversionOpportunity}
            icon={MousePointerClick}
            className="h-full min-h-[13.5rem]"
          />
        </div>

        <ChartCard
          id="purchase-intention-chart"
          title="Purchase Intention Donut"
          description="Distribusi kemungkinan responden mencoba membeli produk."
          icon={PieChart}
          className="h-full"
        >
          <div className="grid gap-4">
            <div className="h-[15.5rem]">
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
                        stroke="rgba(248,251,255,0.95)"
                        strokeWidth={4}
                      />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2">
              {purchaseIntention.purchaseIntentionChart.map((item, index) => (
                <LegendPill
                  key={item.label}
                  label={`${item.label} · ${item.value}`}
                  color={PURCHASE_COLORS[index % PURCHASE_COLORS.length]}
                />
              ))}
            </div>
            <InsightCard>
              {purchaseIntention.purchaseIntentionScore}% responden setidaknya masih berada pada
              spektrum siap mencoba, dengan sinyal terkuat di kategori {strongestSignal?.label?.toLowerCase()}
              {strongestSignal ? ` (${strongestSignal.value} jawaban)` : ""}. Penolakan paling rendah
              datang dari {hesitantSignal?.label?.toLowerCase()}
              {hesitantSignal ? ` yang hanya mencatat ${hesitantSignal.value} jawaban.` : "."}
            </InsightCard>
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
