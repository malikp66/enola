"use client";

import { ShoppingBag, Store } from "lucide-react";

import { ChartCard } from "@/components/ui/ChartCard";
import { MetricCard } from "@/components/ui/MetricCard";
import {
  PurchaseChannelIcon,
  SectionHeading,
} from "@/components/dashboard/DashboardPrimitives";
import type { SurveyAnalytics } from "@/types/survey";

export function PurchaseChannelAssets({ analytics }: { analytics: SurveyAnalytics }) {
  const topChannel = analytics.marketOverview.purchaseChannels[0];

  return (
    <section id="purchase-channel-assets" className="space-y-6">
      <SectionHeading
        eyebrow="Purchase Channel Assets"
        title="Channel pembelian yang paling berpotensi"
        description="Bagian ini merangkum jalur pembelian yang paling sering dipilih responden agar prioritas distribusi awal, pola kebiasaan beli, dan channel yang layak diuji bisa terlihat lebih jelas."
      />

      <div id="purchase-channel-assets-content" className="grid items-start gap-5 xl:grid-cols-[0.42fr_1.18fr]">
        <MetricCard
          id="purchase-channel-metric"
          title="Top Purchase Channel"
          value={topChannel?.label ?? "Belum ada data"}
          description={
            topChannel
              ? `${topChannel.value} jawaban atau ${Math.round(topChannel.percentage)}% dari total pilihan channel masuk ke jalur pembelian ini.`
              : "Belum ada data channel pembelian yang bisa dirangkum."
          }
          icon={Store}
          accent
          className="h-full min-h-[18rem]"
          valueClassName="text-[2.25rem] leading-[0.94] tracking-tight md:text-[2.8rem]"
        />
        <ChartCard
          id="purchase-channel-insight"
          title="Purchase Channel Breakdown"
          description="Urutan channel pembelian berdasarkan hasil survei, dengan jumlah jawaban dan kekuatan porsinya."
          icon={ShoppingBag}
        >
          <div className="grid gap-3 md:grid-cols-2">
            {analytics.marketOverview.purchaseChannels.map((channel) => (
              <div
                key={channel.label}
                className="glass-panel rounded-[1.6rem] p-4"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="glass-icon grid h-11 w-11 place-items-center rounded-full text-[var(--brand-royal)]">
                    <PurchaseChannelIcon label={channel.label} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#17191d]">{channel.label}</p>
                    <p className="text-xs text-[var(--brand-muted)]">{channel.value} jawaban</p>
                  </div>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#e9ecef]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#212529_0%,#343a40_42%,#6c757d_100%)]"
                    style={{ width: `${Math.max(channel.percentage, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
