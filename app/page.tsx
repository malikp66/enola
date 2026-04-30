"use client";

import { startTransition, useEffect, useState } from "react";
import {
  AlertTriangle,
  ChartNoAxesCombined,
  SearchX,
} from "lucide-react";

import { ConsumerSignals } from "@/components/dashboard/ConsumerSignals";
import { CustomerProblem } from "@/components/dashboard/CustomerProblem";
import { FinalValidation } from "@/components/dashboard/FinalValidation";

import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { PreferredScent } from "@/components/dashboard/PreferredScent";
import { PriceAcceptance } from "@/components/dashboard/PriceAcceptance";
import { ProductInterest } from "@/components/dashboard/ProductInterest";
import { PurchaseChannelAssets } from "@/components/dashboard/PurchaseChannelAssets";
import { PurchaseIntention } from "@/components/dashboard/PurchaseIntention";
import {
  DashboardTourProvider,
  useDashboardTour,
} from "@/components/dashboard/TourProvider";
import { InsightCard } from "@/components/ui/InsightCard";
import { MorphingText } from "@/components/ui/morphing-text";
import { buildSurveyAnalytics } from "@/lib/analytics";
import { loadSurveyCsv } from "@/lib/csv";
import type { SurveyAnalytics, SurveyFieldKey } from "@/types/survey";

const MIN_SPLASH_DURATION_MS = 5500;

const FIELD_LABELS: Record<SurveyFieldKey, string> = {
  timestamp: "Timestamp",
  province: "Provinsi responden",
  buyingFrequency: "Frekuensi pembelian kerudung",
  purchaseChannels: "Tempat pembelian kerudung",
  buyingPriority: "Prioritas saat membeli kerudung",
  problems: "Masalah saat memakai kerudung",
  freshnessDiscomfort: "Ketidaknyamanan karena bau / kurang segar",
  activeHijabUsage: "Frekuensi memakai kerudung",
  productInterest: "Ketertarikan terhadap scented hijab",
  mainBenefit: "Manfaat utama kerudung wangi",
  preferredScent: "Preferensi aroma",
  mainConcern: "Kekhawatiran terbesar",
  currentPrice: "Harga kerudung yang biasa dibeli",
  acceptablePrice: "Harga yang masih cocok",
  purchaseIntention: "Kemungkinan mencoba membeli",
};

export default function Home() {
  const [analytics, setAnalytics] = useState<SurveyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const splashDelay = new Promise((resolve) =>
      window.setTimeout(resolve, MIN_SPLASH_DURATION_MS)
    );

    async function run() {
      try {
        const parsed = await loadSurveyCsv("/data/enola-survey.csv");

        if (parsed.missingCriticalFields.length > 0) {
          const readable = parsed.missingCriticalFields.map((field) => FIELD_LABELS[field]).join(", ");
          throw new Error(
            `Format kolom CSV belum sesuai. Dashboard tidak menemukan field penting berikut: ${readable}.`
          );
        }

        if (parsed.rows.length === 0) {
          throw new Error("Data survei ditemukan, tetapi belum ada responden yang bisa divisualisasikan.");
        }

        const nextAnalytics = buildSurveyAnalytics(parsed);
        await splashDelay;

        if (!active) {
          return;
        }

        startTransition(() => {
          setAnalytics(nextAnalytics);
          setError(null);
          setLoading(false);
        });
      } catch (caughtError) {
        await splashDelay;

        if (!active) {
          return;
        }

        startTransition(() => {
          setAnalytics(null);
          setError(caughtError instanceof Error ? caughtError.message : "Terjadi kesalahan saat memproses data survei.");
          setLoading(false);
        });
      }
    }

    run();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  if (!analytics) {
    return <EmptyScreen />;
  }

  return (
    <DashboardTourProvider analytics={analytics}>
      <DashboardExperience analytics={analytics} />
    </DashboardTourProvider>
  );
}

function DashboardExperience({ analytics }: { analytics: SurveyAnalytics }) {
  const startTour = useDashboardTour();

  return (
    <main id="main-content" className="page-shell">
      <div className="dashboard-stack">
        <MarketOverview
          analytics={analytics}
          onStartTour={startTour}
          onViewInsight={() => {
            document.getElementById("final-validation")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        />
        <ConsumerSignals analytics={analytics} />
        <CustomerProblem analytics={analytics} />
        <ProductInterest analytics={analytics} />
        <PreferredScent analytics={analytics} />
        <PriceAcceptance analytics={analytics} />
        <PurchaseIntention analytics={analytics} />
        <PurchaseChannelAssets analytics={analytics} />
        <FinalValidation analytics={analytics} />
      </div>
    </main>
  );
}

function LoadingScreen() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center px-6"
      aria-live="polite"
    >
      <div className="flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.38em] text-[#b57a5e]">
          Market Validation Dashboard
        </p>
        <MorphingText
          texts={["enola", "ENOLA", "enola"]}
          className="h-[5.5rem] font-heading text-[5rem] font-semibold tracking-[0.06em] text-[#2a1d16] md:h-[8rem] md:text-[7rem] lg:h-[9.5rem] lg:text-[8.5rem]"
        />
        <p className="text-sm leading-7 text-[#9a8276]">
          Menyiapkan hasil survei responden Enola
        </p>
      </div>
    </main>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <main id="main-content" className="page-shell" aria-live="polite">
      <div className="rounded-[2.7rem] border border-[#eed9cf] bg-[linear-gradient(180deg,#fffefb_0%,#fff7f3_100%)] p-8 shadow-[0_30px_80px_rgba(140,98,76,0.08)]">
        <div className="mb-5 flex items-center gap-3 text-[#bb7458]">
          <AlertTriangle aria-hidden="true" className="h-5 w-5" />
          <p className="text-sm uppercase tracking-[0.26em]">Error state</p>
        </div>
        <div className="space-y-4">
          <h1 className="font-heading text-[3rem] leading-none text-[#281c15]">
            Dashboard belum bisa menampilkan data
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[#6f5a4e]">{message}</p>
          <InsightCard>
            Pastikan file tersedia di `public/data/enola-survey.csv` dan kolom penting seperti
            provinsi, minat produk, harga, dan purchase intention tetap terdeteksi.
          </InsightCard>
        </div>
      </div>
    </main>
  );
}

function EmptyScreen() {
  return (
    <main id="main-content" className="page-shell" aria-live="polite">
      <div className="rounded-[2.7rem] border border-[#eedfd5] bg-[linear-gradient(180deg,#fffefb_0%,#fff7f3_100%)] p-8 shadow-[0_30px_80px_rgba(140,98,76,0.08)]">
        <div className="mb-5 flex items-center gap-3 text-[#b97d60]">
          <SearchX aria-hidden="true" className="h-5 w-5" />
          <p className="text-sm uppercase tracking-[0.26em]">Empty state</p>
        </div>
        <h1 className="font-heading text-[3rem] leading-none text-[#281c15]">
          Data survei belum ditemukan
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#715c50]">
          Tambahkan file CSV hasil export Google Sheets ke `public/data/enola-survey.csv`, lalu
          buka ulang dashboard untuk memproses dan memvisualisasikan hasil survei Enola.
        </p>
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#ecdcd2] bg-white/90 px-4 py-2 text-sm text-[#725e52]">
          <ChartNoAxesCombined aria-hidden="true" className="h-4 w-4 text-[#bd7e61]" />
          Dashboard akan otomatis membaca file saat halaman dibuka
        </div>
      </div>
    </main>
  );
}
