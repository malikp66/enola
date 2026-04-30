import type { ReactNode } from "react";

import type { TourStep } from "@/components/tour";
import type { SurveyAnalytics } from "@/types/survey";

import { useTour } from "@/components/tour";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

function TourContent({
  title,
  summary,
  implication,
  isStart = false,
}: {
  title: string;
  summary: string;
  implication: string;
  isStart?: boolean;
}) {
  const { nextStep } = useTour();

  return (
    <div className="space-y-4">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#b37b60]">
        Guided Insight
      </p>
      <div className="space-y-1.5">
        <h3 className="font-heading text-2xl leading-none text-[#2d2018]">{title}</h3>
        <p className="text-sm leading-6 text-[#6c584c]">{summary}</p>
      </div>
      {implication && (
        <div className="rounded-[1.35rem] border border-[#ead8ce] bg-[#fff8f4] p-3 text-sm leading-6 text-[#7b5e4c]">
          {implication}
        </div>
      )}
      {isStart && (
        <Button
          onClick={nextStep}
          className="w-full gap-2 rounded-full bg-[#bd7e61] hover:bg-[#a66d54]"
        >
          <Play className="h-4 w-4 fill-current" />
          Mulai Guided Insight
        </Button>
      )}
    </div>
  );
}

function makeStep(
  selectorId: string,
  content: ReactNode,
  position: TourStep["position"] = "bottom",
  options: Partial<TourStep> = {}
): TourStep {
  return {
    selectorId,
    content,
    position,
    borderRadius: 26,
    padding: 10,
    ...options,
  };
}

export function buildTourSteps(analytics: SurveyAnalytics): TourStep[] {
  return [
    makeStep(
      "hero-start-tour",
      <TourContent
        isStart
        title="Mulai membaca dashboard"
        summary={`Dashboard ini merangkum ${analytics.totalRespondents} responden menjadi insight bisnis yang lebih cepat dipahami dibanding membaca Google Forms mentah.`}
        implication=""
      />,
      "bottom",
      { hideNext: true, hidePagination: true }
    ),
    makeStep(
      "total-respondents-card",
      <TourContent
        title="Ukuran sampel awal"
        summary={`Total responden saat ini adalah ${analytics.totalRespondents}. Jumlah ini menjadi dasar awal untuk membaca validasi market Enola.`}
        implication="Semakin banyak responden, semakin kuat dasar keputusan. Untuk tahap eksplorasi ide, angka ini sudah cukup untuk membaca pola awal demand."
      />,
      "right"
    ),
    makeStep(
      "top-province-card",
      <TourContent
        title="Wilayah responden terkuat"
        summary={`Provinsi dengan responden terbanyak adalah ${analytics.marketOverview.topProvince}.`}
        implication={`Insight paling kuat saat ini datang dari ${analytics.marketOverview.topProvince}, sehingga wilayah ini layak diprioritaskan untuk test market atau komunikasi awal.`}
      />,
      "right"
    ),
    makeStep(
      "buying-frequency-chart",
      <TourContent
        title="Frekuensi membeli kerudung"
        summary={analytics.questionInsights.buyingFrequency.summary}
        implication={analytics.questionInsights.buyingFrequency.implication}
      />,
      "top"
    ),
    makeStep(
      "purchase-channel-chart",
      <TourContent
        title="Tempat membeli kerudung"
        summary={analytics.questionInsights.purchaseChannels.summary}
        implication={analytics.questionInsights.purchaseChannels.implication}
      />,
      "left"
    ),
    makeStep(
      "buying-priority-chart",
      <TourContent
        title="Prioritas saat membeli kerudung"
        summary={analytics.questionInsights.buyingPriority.summary}
        implication={analytics.questionInsights.buyingPriority.implication}
      />,
      "top"
    ),
    makeStep(
      "freshness-discomfort-chart",
      <TourContent
        title="Sinyal ketidaknyamanan kesegaran"
        summary={analytics.questionInsights.freshnessDiscomfort.summary}
        implication={analytics.questionInsights.freshnessDiscomfort.implication}
      />,
      "left"
    ),
    makeStep(
      "problem-chart",
      <TourContent
        title="Masalah utama pengguna"
        summary={analytics.questionInsights.problems.summary}
        implication={analytics.questionInsights.problems.implication}
      />,
      "top"
    ),
    makeStep(
      "interest-chart",
      <TourContent
        title="Minat terhadap scented hijab"
        summary={`Market Interest Score Enola adalah ${Math.round(analytics.productInterest.marketInterestScore)}%, dihitung dari jawaban Sangat tertarik dan Tertarik.`}
        implication={analytics.questionInsights.productInterest.implication}
      />,
      "left"
    ),
    makeStep(
      "main-benefit-chart",
      <TourContent
        title="Benefit utama yang dicari"
        summary={analytics.questionInsights.mainBenefit.summary}
        implication={analytics.questionInsights.mainBenefit.implication}
      />,
      "top"
    ),
    makeStep(
      "preferred-scent-chart",
      <TourContent
        title="Preferensi aroma MVP"
        summary={`Aroma paling disukai adalah ${analytics.preferredScent.topScent}${analytics.preferredScent.secondaryScent ? `, diikuti ${analytics.preferredScent.secondaryScent}` : ""}.`}
        implication={`Varian awal dapat diprioritaskan ke aroma ${analytics.preferredScent.topScent.toLowerCase()} untuk meningkatkan peluang penerimaan saat market testing.`}
      />,
      "top"
    ),
    makeStep(
      "main-concern-chart",
      <TourContent
        title="Kekhawatiran terbesar"
        summary={analytics.questionInsights.mainConcern.summary}
        implication={analytics.questionInsights.mainConcern.implication}
      />,
      "left"
    ),
    makeStep(
      "current-price-chart",
      <TourContent
        title="Harga yang biasa dibeli"
        summary={analytics.questionInsights.currentPrice.summary}
        implication={analytics.questionInsights.currentPrice.implication}
      />,
      "right"
    ),
    makeStep(
      "price-chart",
      <TourContent
        title="Harga yang masih cocok"
        summary={`Rentang harga paling diterima adalah ${analytics.priceAcceptance.topPriceRange}. Price Fit Score terhadap target Enola ${Math.round(analytics.priceAcceptance.priceFitScore)}%.`}
        implication={`Target harga MVP ${analytics.priceAcceptance.topPriceRange.toLowerCase()} harus menjadi anchor utama pada eksperimen pricing pertama.`}
      />,
      "top"
    ),
    makeStep(
      "purchase-intention-chart",
      <TourContent
        title="Kemungkinan membeli"
        summary={`Purchase Potential Score mencapai ${Math.round(analytics.purchaseIntention.purchaseIntentionScore)}% dari gabungan jawaban Sangat mungkin dan Mungkin.`}
        implication={analytics.questionInsights.purchaseIntention.implication}
      />,
      "left"
    ),
    makeStep(
      "final-validation-score",
      <TourContent
        title="Kesimpulan validasi bisnis"
        summary={`Final Business Validation Score Enola adalah ${Math.round(analytics.finalValidation.finalBusinessValidationScore)} dengan status ${analytics.finalValidation.validationStatus}.`}
        implication={analytics.finalValidation.recommendation}
      />,
      "top"
    ),
  ];
}
