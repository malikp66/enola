"use client";

import { CheckCircle2, Sparkles, Target } from "lucide-react";

import { ChartCard } from "@/components/ui/ChartCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { Progress } from "@/components/ui/progress";
import { SectionHeading } from "@/components/dashboard/DashboardPrimitives";
import type { SurveyAnalytics } from "@/types/survey";

export function FinalValidation({ analytics }: { analytics: SurveyAnalytics }) {
  const { finalValidation } = analytics;

  return (
    <section id="final-validation" className="space-y-6">
      <SectionHeading
        eyebrow="Final Business Validation"
        title="Merangkum kelayakan ide bisnis Enola"
        description="Section terakhir menggabungkan market interest, purchase intention, problem relevance, dan price fit menjadi satu final score agar keputusan lanjut atau refine bisa lebih objektif."
      />

      <div className="grid items-stretch gap-5 xl:grid-cols-[0.84fr_1.16fr]">
        <div className="grid h-full gap-5 xl:grid-rows-2">
          <MetricCard
            id="final-validation-score"
            title="Final Validation Score"
            value={finalValidation.finalBusinessValidationScore}
            suffix="%"
            description={`Status saat ini: ${finalValidation.validationStatus}.`}
            icon={Target}
            accent
            className="h-full"
          />
          <ChartCard
            id="testing-strategy-card"
            title="Suggested Market Testing Strategy"
            description="Langkah uji pasar yang disarankan berdasarkan kekuatan sinyal saat ini."
            icon={Sparkles}
            className="h-full"
          >
            <p className="text-sm leading-7 text-[var(--brand-muted)]">{finalValidation.testingStrategy}</p>
          </ChartCard>
        </div>
        <ChartCard
          id="final-recommendation-card"
          title="Final Recommendation"
          description="Rekomendasi akhir berdasarkan kombinasi seluruh score bisnis utama."
          icon={CheckCircle2}
          className="h-full"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {finalValidation.scorecards.map((score) => (
              <div
                key={score.label}
                className="glass-panel rounded-[1.55rem] p-4"
              >
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#17191d]">{score.label}</p>
                    <p className="text-xs text-[var(--brand-muted)]">{score.summary}</p>
                  </div>
                  <span className="font-heading text-3xl leading-none text-[#111215]">
                    {Math.round(score.value)}%
                  </span>
                </div>
                <Progress
                  value={score.value}
                  className="gap-0"
                  trackClassName="h-2.5 rounded-full bg-[#e9ecef]"
                  indicatorClassName="bg-[linear-gradient(90deg,#212529_0%,#343a40_45%,#495057_72%,#adb5bd_100%)]"
                />
              </div>
            ))}
          </div>
          <div className="glass-panel-strong rounded-[1.7rem] p-5">
            <p className="font-heading text-[1.65rem] leading-none text-[#111215]">
              {finalValidation.validationStatus}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
              {finalValidation.recommendation}
            </p>
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
