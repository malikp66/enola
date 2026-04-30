"use client";

import { ArrowDownRight, Droplets, MapPin, Sparkles, Users } from "lucide-react";

import { ChartCard } from "@/components/ui/ChartCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { Button } from "@/components/ui/button";
import { ProvinceDistributionMap } from "@/components/dashboard/ProvinceDistributionMap";
import { SectionHeading } from "@/components/dashboard/DashboardPrimitives";
import type { SurveyAnalytics } from "@/types/survey";

export function MarketOverview({
  analytics,
  onStartTour,
  onViewInsight,
}: {
  analytics: SurveyAnalytics;
  onStartTour: () => void;
  onViewInsight: () => void;
}) {
  return (
    <section id="market-overview" className="space-y-6">
      <SectionHeading
        eyebrow="Market Overview"
        title="Scented Hijab Validation Dashboard"
        description="Dashboard ini merangkum hasil validasi pasar Enola dari survei Google Form ke dalam tampilan yang lebih siap presentasi, lebih cepat dibaca, dan lebih jelas untuk keputusan market testing."
      >
        <div className="flex flex-wrap gap-3">
          <Button
            id="hero-start-tour"
            data-tour="hero-start-tour"
            onClick={onStartTour}
            className="h-11 rounded-full bg-[#2b201a] px-6 text-white shadow-[0_12px_24px_rgba(63,45,36,0.12)] hover:opacity-95"
          >
            <Sparkles aria-hidden="true" className="mr-2 h-4 w-4" />
            Start Dashboard Tour
          </Button>
          <Button
            id="hero-final-insight"
            data-tour="hero-final-insight"
            variant="outline"
            onClick={onViewInsight}
            className="h-11 rounded-full border-[#e8d6ca] bg-white px-6 text-[#6c5649] hover:bg-[#fff9f6]"
          >
            <ArrowDownRight aria-hidden="true" className="mr-2 h-4 w-4" />
            View Final Insight
          </Button>
        </div>
      </SectionHeading>

      <div className="mt-16 grid items-start gap-5 xl:grid-cols-3">
        <MetricCard
          id="total-respondents-card"
          title="Total Respondents"
          value={analytics.marketOverview.totalRespondents}
          description="Jumlah responden valid yang menjadi dasar pembacaan hasil survei."
          icon={Users}
          accent
        />
        <MetricCard
          id="top-province-card"
          title="Top Province"
          value={analytics.marketOverview.topProvince}
          description="Wilayah dengan kontribusi responden terbesar saat ini."
          icon={MapPin}
        />
        <MetricCard
          id="active-hijab-users-card"
          title="Freshness Need Signal"
          value={analytics.marketOverview.freshnessNeedScore}
          suffix="%"
          description="Persentase responden yang sering atau kadang merasa kurang nyaman karena bau atau tidak segar."
          icon={Droplets}
        />
      </div>

      <div className="mt-16 grid items-start gap-6">
        <ChartCard
          id="province-distribution-map"
          title="Province Distribution"
          description="Peta Indonesia dengan intensitas warna berdasarkan jumlah response tiap provinsi, dilengkapi ranking provinsi di sisi kanan."
          icon={MapPin}
        >
          <ProvinceDistributionMap provinces={analytics.marketOverview.provinceDistribution} />
        </ChartCard>
      </div>
    </section>
  );
}
