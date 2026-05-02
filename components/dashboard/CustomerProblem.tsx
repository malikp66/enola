"use client";

import { AlertCircle, Flame, Waves } from "lucide-react";
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
import { InsightCard } from "@/components/ui/InsightCard";
import { SectionHeading, SoftTooltip } from "@/components/dashboard/DashboardPrimitives";
import type { SurveyAnalytics } from "@/types/survey";

export function CustomerProblem({ analytics }: { analytics: SurveyAnalytics }) {
  const { customerProblem } = analytics;

  return (
    <section id="customer-problem" className="space-y-6">
      <SectionHeading
        eyebrow="Customer Problem"
        title="Masalah utama yang membuat scented hijab relevan"
        description="Bagian ini merangkum apakah masalah yang dialami responden memang cukup dekat dengan proposisi scented hijab, terutama dalam konteks rasa kurang segar, panas, atau penurunan kenyamanan setelah beberapa jam."
      />

      <div id="customer-problem-content" className="grid items-start gap-5 xl:grid-cols-[0.84fr_1fr_0.86fr]">
        <div className="grid h-full gap-5">
          <MetricCard
            id="main-problem-card"
            title="Main Problem"
            value={customerProblem.topProblem}
            description="Masalah yang paling banyak dipilih oleh responden."
            icon={AlertCircle}
            accent
            className="h-full"
          />
        </div>
        <ChartCard
          id="problem-chart"
          title="Problem Distribution"
          description="Distribusi masalah utama pengguna saat memakai kerudung."
          icon={Flame}
        >
          <div className="h-[20rem]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerProblem.problemChart} layout="vertical" margin={{ left: 8 }}>
                <defs>
                  <linearGradient id="problem-gradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#212529" />
                    <stop offset="55%" stopColor="#495057" />
                    <stop offset="100%" stopColor="#adb5bd" />
                  </linearGradient>
                </defs>
                <CartesianGrid horizontal stroke="rgba(206,212,218,0.88)" strokeDasharray="4 7" />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "#6c757d" }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#495057", fontSize: 12 }}
                  width={130}
                />
                <Tooltip content={<SoftTooltip />} cursor={{ fill: "rgba(233, 236, 239, 0.76)" }} />
                <Bar
                  dataKey="value"
                  radius={[0, 18, 18, 0]}
                  fill="url(#problem-gradient)"
                  animationDuration={1200}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <div className="grid h-full grid-rows-[minmax(0,1fr)_auto] gap-5">
          <MetricCard
            id="problem-score-card"
            title="Problem Relevance Score"
            value={customerProblem.problemRelevanceScore}
            suffix="%"
            description="Semakin tinggi angkanya, semakin relevan masalah pasar dengan proposisi scented hijab."
            icon={Waves}
            className="h-full min-h-[14rem]"
          />
          <InsightCard>
            {customerProblem.topProblem} menjadi problem terbesar
            {customerProblem.secondaryProblem
              ? `, diikuti oleh ${customerProblem.secondaryProblem.toLowerCase()}.`
              : "."}
          </InsightCard>
        </div>
      </div>
    </section>
  );
}
