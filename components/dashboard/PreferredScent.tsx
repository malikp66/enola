"use client";

import { Flower2, Wind } from "lucide-react";
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
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionHeading, SoftTooltip } from "@/components/dashboard/DashboardPrimitives";
import type { SurveyAnalytics } from "@/types/survey";

export function PreferredScent({ analytics }: { analytics: SurveyAnalytics }) {
  const { preferredScent } = analytics;

  return (
    <section id="preferred-scent" className="space-y-6">
      <SectionHeading
        eyebrow="Preferred Scent"
        title="Aroma yang paling layak diprioritaskan"
        description="Bagian ini membantu melihat aroma mana yang paling mudah diterima responden, sehingga pemilihan varian awal bisa terasa lebih terarah dan lebih aman untuk uji pasar pertama."
      />

      <div id="preferred-scent-content" className="grid items-stretch gap-5 xl:grid-cols-[0.84fr_1.16fr]">
        <div className="grid h-full gap-5">
          <MetricCard
            id="top-scent-card"
            title="Top Scent"
            value={preferredScent.topScent}
            description="Aroma dengan tingkat preferensi tertinggi di antara responden."
            icon={Flower2}
            accent
            className="h-full"
          />
          {/* <MetricCard
            id="mvp-scent-card"
            title="MVP Scent Recommendation"
            value={preferredScent.secondaryScent ?? "Single-varian focus"}
            description={preferredScent.mvpRecommendation}
            icon={Leaf}
            className="h-full"
          /> */}
        </div>
        <ChartCard
          id="preferred-scent-chart"
          title="Scent Preference"
          description="Distribusi aroma favorit responden untuk konsep kerudung wangi."
          icon={Wind}
          className="h-full"
        >
          <div className="h-[28rem]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={preferredScent.scentChart}
                layout="vertical"
                margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
                barCategoryGap={10}
              >
                <defs>
                  <linearGradient id="scent-gradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#212529" />
                    <stop offset="55%" stopColor="#495057" />
                    <stop offset="100%" stopColor="#adb5bd" />
                  </linearGradient>
                </defs>
                <CartesianGrid horizontal={false} stroke="rgba(206,212,218,0.88)" strokeDasharray="4 7" />
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
                  width={140}
                />
                <Tooltip content={<SoftTooltip />} cursor={{ fill: "rgba(233, 236, 239, 0.76)" }} />
                <Bar dataKey="value" radius={[0, 18, 18, 0]} fill="url(#scent-gradient)" animationDuration={1100} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
