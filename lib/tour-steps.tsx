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
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#6c757d]">
        Guided Insight
      </p>
      <div className="space-y-1.5">
        <h3 className="font-heading text-2xl leading-none text-[#212529]">{title}</h3>
        <p className="text-sm leading-6 text-[#495057]">{summary}</p>
      </div>
      {implication && (
        <div className="rounded-[1.35rem] border border-[#ced4da] bg-[#e9ecef] p-3 text-sm leading-6 text-[#495057]">
          {implication}
        </div>
      )}
      {isStart && (
        <Button
          onClick={nextStep}
          className="w-full gap-2 rounded-full bg-[linear-gradient(135deg,#212529_0%,#343a40_58%,#495057_100%)] text-[#f8f9fa] hover:brightness-110"
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
      "market-overview",
      <TourContent
        title="Market overview"
        summary={`Bagian pembuka ini merangkum ${analytics.totalRespondents} responden, wilayah terkuat di ${analytics.marketOverview.topProvince}, dan sinyal kebutuhan kesegaran sebesar ${Math.round(analytics.marketOverview.freshnessNeedScore)}%.`}
        implication="Gunakan section ini untuk membuka cerita: ukuran sampel, wilayah dominan, lalu alasan mengapa ide scented hijab layak dibaca lebih lanjut."
      />,
      "bottom"
    ),
    makeStep(
      "consumer-signals",
      <TourContent
        title="Consumer signals"
        summary="Section ini menjelaskan perilaku pendukung: apa yang paling dicari saat membeli kerudung, seberapa sering responden merasa kurang segar, dan kekhawatiran lain di sekitar produk."
        implication={analytics.questionInsights.freshnessDiscomfort.implication}
      />,
      "top"
    ),
    makeStep(
      "customer-problem",
      <TourContent
        title="Customer problem"
        summary={analytics.questionInsights.problems.summary}
        implication={analytics.questionInsights.problems.implication}
      />,
      "top"
    ),
    makeStep(
      "product-interest",
      <TourContent
        title="Minat terhadap scented hijab"
        summary={`Market Interest Score Enola adalah ${Math.round(analytics.productInterest.marketInterestScore)}%, dihitung dari jawaban Sangat tertarik dan Tertarik.`}
        implication={analytics.questionInsights.productInterest.implication}
      />,
      "left"
    ),
    makeStep(
      "preferred-scent",
      <TourContent
        title="Preferred scent"
        summary={`Aroma paling disukai adalah ${analytics.preferredScent.topScent}${analytics.preferredScent.secondaryScent ? `, diikuti ${analytics.preferredScent.secondaryScent}` : ""}.`}
        implication={`Varian awal dapat diprioritaskan ke aroma ${analytics.preferredScent.topScent.toLowerCase()} untuk meningkatkan peluang penerimaan saat market testing.`}
      />,
      "top"
    ),
    makeStep(
      "price-acceptance",
      <TourContent
        title="Price acceptance"
        summary={`Rentang harga paling diterima adalah ${analytics.priceAcceptance.topPriceRange}. Price Fit Score terhadap target Enola ${Math.round(analytics.priceAcceptance.priceFitScore)}%.`}
        implication={`Target harga MVP ${analytics.priceAcceptance.topPriceRange.toLowerCase()} harus menjadi anchor utama pada eksperimen pricing pertama.`}
      />,
      "top"
    ),
    makeStep(
      "purchase-intention",
      <TourContent
        title="Purchase intention"
        summary={`Purchase Potential Score mencapai ${Math.round(analytics.purchaseIntention.purchaseIntentionScore)}% dari gabungan jawaban Sangat mungkin dan Mungkin.`}
        implication={analytics.questionInsights.purchaseIntention.implication}
      />,
      "left"
    ),
    makeStep(
      "purchase-channel-assets",
      <TourContent
        title="Purchase channel assets"
        summary={analytics.questionInsights.purchaseChannels.summary}
        implication={analytics.questionInsights.purchaseChannels.implication}
      />,
      "top"
    ),
    makeStep(
      "final-validation",
      <TourContent
        title="Kesimpulan validasi bisnis"
        summary={`Final Business Validation Score Enola adalah ${Math.round(analytics.finalValidation.finalBusinessValidationScore)} dengan status ${analytics.finalValidation.validationStatus}.`}
        implication={analytics.finalValidation.recommendation}
      />,
      "top"
    ),
  ];
}
