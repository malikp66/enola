"use client";

import { ChevronDown, Heart, PieChart, Sparkles } from "lucide-react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useRef, useState } from "react";

import { ChartCard } from "@/components/ui/ChartCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { InsightCard } from "@/components/ui/InsightCard";
import { LegendPill, SectionHeading, SoftTooltip } from "@/components/dashboard/DashboardPrimitives";
import type { SurveyAnalytics } from "@/types/survey";

const INTEREST_COLORS = ["#cb8462", "#e7b39a", "#f0d7ca", "#f6ede8"];

export function ProductInterest({ analytics }: { analytics: SurveyAnalytics }) {
  const { productInterest } = analytics;
  const listRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const list = listRef.current;

    if (!list) {
      return;
    }

    const updateScrollState = () => {
      setCanScrollUp(list.scrollTop > 8);
      setCanScrollDown(list.scrollTop + list.clientHeight < list.scrollHeight - 8);
    };

    updateScrollState();
  }, [productInterest.mainBenefitChart]);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  function handleBenefitScroll() {
    const list = listRef.current;

    if (!list) {
      return;
    }

    setCanScrollUp(list.scrollTop > 8);
    setCanScrollDown(list.scrollTop + list.clientHeight < list.scrollHeight - 8);
    setIsScrolling(true);

    if (scrollTimerRef.current) {
      window.clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 700);
  }

  function handleScrollHintClick() {
    const list = listRef.current;

    if (!list) {
      return;
    }

    list.scrollTo({
      top: canScrollDown
        ? Math.min(list.scrollTop + list.clientHeight * 0.72, list.scrollHeight)
        : 0,
      behavior: "smooth",
    });
  }

  return (
    <section id="product-interest" className="space-y-6">
      <SectionHeading
        eyebrow="Product Interest"
        title="Ketertarikan awal terhadap ide Enola"
        description="Bagian ini mengukur seberapa banyak responden yang benar-benar tertarik dengan ide scented hijab. Angka utama yang dipakai adalah gabungan jawaban Sangat tertarik dan Tertarik."
      />

      <div className="grid items-stretch gap-5 xl:grid-cols-[0.84fr_1fr_0.86fr]">
        <MetricCard
            id="market-interest-card"
            title="Market Interest Score"
            value={productInterest.marketInterestScore}
            suffix="%"
            description="Gabungan Sangat tertarik dan Tertarik terhadap ide kerudung wangi Enola."
            icon={Heart}
            accent
            className="h-full min-h-[21rem]"
          />

        <ChartCard
          id="interest-chart"
          title="Interest Donut"
          description="Distribusi detail tingkat ketertarikan responden."
          icon={PieChart}
        >
          <div className="grid gap-4">
            <div className="h-[17rem]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Tooltip content={<SoftTooltip />} />
                  <Pie
                    data={productInterest.interestChart}
                    dataKey="value"
                    innerRadius={62}
                    outerRadius={92}
                    paddingAngle={4}
                    cornerRadius={18}
                    animationDuration={1100}
                  >
                    {productInterest.interestChart.map((entry, index) => (
                      <Cell
                        key={entry.label}
                        fill={INTEREST_COLORS[index % INTEREST_COLORS.length]}
                        stroke="#fffaf7"
                        strokeWidth={4}
                      />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2">
              {productInterest.interestChart.map((item, index) => (
                <LegendPill
                  key={item.label}
                  label={`${item.label} · ${item.value}`}
                  color={INTEREST_COLORS[index % INTEREST_COLORS.length]}
                />
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard
          id="main-benefit-chart"
          title="Expected Benefit"
          description="Benefit utama yang diharapkan responden dari kerudung wangi."
          icon={Sparkles}
          className="h-full"
        >
          <div className="relative">
            <div
              ref={listRef}
              className={`custom-scrollbar scrollbar-reveal h-[17.5rem] space-y-3 overflow-y-auto pr-3 pb-12 ${
                isScrolling ? "is-scrolling" : ""
              }`}
              onScroll={handleBenefitScroll}
            >
              {productInterest.mainBenefitChart.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.45rem] border border-[#efdfd6] bg-white/90 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-[0.96rem] font-medium leading-6 text-[#281c15]">
                      {item.label}
                    </p>
                    <span className="text-sm text-[#8a7367]">{Math.round(item.percentage)}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#f3e9e2]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#cb8462,#f0c3a9)]"
                      style={{ width: `${Math.max(item.percentage, 8)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-12 bg-[linear-gradient(180deg,#fffaf7_5%,rgba(255,250,247,0.78)_36%,transparent_100%)] transition-opacity duration-300 ${
                canScrollUp ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent_0%,rgba(255,250,247,0.82)_48%,#fffaf7_100%)] transition-opacity duration-300 ${
                canScrollDown ? "opacity-100" : "opacity-0"
              }`}
            />

            {(canScrollDown || canScrollUp) && (
              <button
                type="button"
                onClick={handleScrollHintClick}
                className="absolute inset-x-0 bottom-0 mx-auto grid h-10 w-10 place-items-center rounded-full border border-[#ebd9cd] bg-white/96 text-[#b87a5e] shadow-[0_14px_30px_rgba(145,104,79,0.12)] transition-transform duration-300 hover:-translate-y-0.5"
                aria-label={
                  canScrollDown
                    ? "Scroll ke benefit berikutnya"
                    : "Kembali ke atas daftar benefit"
                }
              >
                <ChevronDown
                  aria-hidden="true"
                  className={`h-4 w-4 transition-transform duration-300 ${
                    !canScrollDown && canScrollUp ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
