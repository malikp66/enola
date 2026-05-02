"use client";

import { motion } from "motion/react";
import { ArrowDownRight, Droplets, MapPin, Sparkles, Users } from "lucide-react";

import { ChartCard } from "@/components/ui/ChartCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { Button } from "@/components/ui/button";
import Text3DFlip from "@/components/ui/text-3d-flip";
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
        titleNode={
          <Text3DFlip
            as="span"
            auto
            autoDelay={3200}
            triggerOnHover={false}
            className="inline-flex [perspective:1200px]"
            textClassName="font-heading text-[2.4rem] leading-none text-[#111215] md:text-[3.2rem]"
            flipTextClassName="font-heading text-[2.4rem] leading-none text-[var(--brand-royal)] md:text-[3.2rem]"
            staggerDuration={0.04}
            rotateDirection="top"
          >
            Scented Hijab Validation Dashboard
          </Text3DFlip>
        }
        description="Dashboard ini merangkum hasil validasi pasar Enola dari survei Google Form ke dalam tampilan yang lebih siap presentasi, lebih cepat dibaca, dan lebih jelas untuk keputusan market testing."
      >
        <div className="flex flex-wrap gap-3">
          <Button
            id="hero-start-tour"
            data-tour="hero-start-tour"
            onClick={onStartTour}
            className="h-11 rounded-full border border-[#343a40] bg-[linear-gradient(135deg,#212529_0%,#343a40_56%,#495057_100%)] px-6 text-[#f8f9fa] shadow-[0_14px_34px_rgba(33,37,41,0.14)] hover:brightness-105"
          >
            <Sparkles aria-hidden="true" className="mr-2 h-4 w-4" />
            Start Dashboard Tour
          </Button>
          <Button
            id="hero-final-insight"
            data-tour="hero-final-insight"
            variant="outline"
            onClick={onViewInsight}
            className="h-11 rounded-full border-[#ced4da] bg-[linear-gradient(180deg,#f8f9fa_0%,#e9ecef_100%)] px-6 text-[#343a40] shadow-[0_12px_28px_rgba(33,37,41,0.06)] hover:border-[#adb5bd] hover:bg-[linear-gradient(180deg,#f8f9fa_0%,#dee2e6_100%)]"
          >
            <ArrowDownRight aria-hidden="true" className="mr-2 h-4 w-4" />
            View Final Insight
          </Button>
        </div>
      </SectionHeading>

      <motion.div
        className="mt-16 grid items-stretch gap-5 xl:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.32 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {[
          <MetricCard
            key="respondents"
            id="total-respondents-card"
            title="Total Respondents"
            value={analytics.marketOverview.totalRespondents}
            description="Jumlah responden valid yang menjadi dasar pembacaan hasil survei."
            icon={Users}
            accent
          />,
          <MetricCard
            key="province"
            id="top-province-card"
            title="Top Province"
            value={analytics.marketOverview.topProvince}
            description="Wilayah dengan kontribusi responden terbesar saat ini."
            icon={MapPin}
          />,
          <MetricCard
            key="freshness"
            id="active-hijab-users-card"
            title="Freshness Need Signal"
            value={analytics.marketOverview.freshnessNeedScore}
            suffix="%"
            description="Persentase responden yang sering atau kadang merasa kurang nyaman karena bau atau tidak segar."
            icon={Droplets}
          />,
        ].map((card) => (
          <motion.div
            key={card.key}
            className="h-full"
            variants={{
              hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            {card}
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-16 grid items-start gap-6">
        <ChartCard
          id="province-distribution-map"
          title="Province Distribution"
          description="Peta Indonesia dengan intensitas warna berdasarkan jumlah response tiap provinsi, dilengkapi ranking provinsi di sisi kanan."
          icon={MapPin}
          hideIcon
          descriptionClassName="max-w-none"
        >
          <ProvinceDistributionMap provinces={analytics.marketOverview.provinceDistribution} />
        </ChartCard>
      </div>
    </section>
  );
}
