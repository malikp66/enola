"use client";

import { ShoppingBag } from "lucide-react";

import { ChartCard } from "@/components/ui/ChartCard";
import {
  PurchaseChannelIcon,
  SectionHeading,
} from "@/components/dashboard/DashboardPrimitives";
import type { SurveyAnalytics } from "@/types/survey";

export function PurchaseChannelAssets({ analytics }: { analytics: SurveyAnalytics }) {
  return (
    <section id="purchase-channel-assets" className="space-y-6">
      <SectionHeading
        eyebrow="Purchase Channel Assets"
        title="Analisis channel pembelian responden"
        description="Bagian ini merangkum channel pembelian yang paling sering dipilih responden agar Enola bisa membaca distribusi awal, pola kebiasaan beli, dan titik channel yang paling layak diprioritaskan."
      />

      <div className="grid items-start gap-5">
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
                className="rounded-[1.6rem] border border-[#efdfd5] bg-white/95 p-4"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[#fff5ef] text-[#bb7c60]">
                    <PurchaseChannelIcon label={channel.label} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2b1f18]">{channel.label}</p>
                    <p className="text-xs text-[#897164]">{channel.value} jawaban</p>
                  </div>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#f2e7e0]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#cc8663,#efc3ab)]"
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
