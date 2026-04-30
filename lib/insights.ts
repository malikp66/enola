import type {
  DistributionDatum,
  FinalValidationData,
  QuestionInsight,
  ValidationStatus,
} from "@/types/survey";

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function createImplication(topAnswer: string, noun: string) {
  return `${topAnswer} menjadi sinyal paling kuat untuk menentukan arah ${noun} awal Enola.`;
}

export function pickQuestionInsight(
  question: string,
  distribution: DistributionDatum[],
  fallbackSummary: string,
  noun: string
): QuestionInsight {
  const [first, second] = distribution;

  return {
    question,
    topAnswer: first?.label ?? "Belum ada data",
    runnerUpAnswer: second?.label,
    summary: first
      ? `${first.label} memimpin dengan ${formatPercent(first.percentage)} dari jawaban valid.`
      : fallbackSummary,
    implication: first ? createImplication(first.label, noun) : fallbackSummary,
  };
}

export function buildValidationStatus(score: number): ValidationStatus {
  if (score >= 80) {
    return "Strong validation";
  }
  if (score >= 60) {
    return "Promising, test further";
  }
  if (score >= 40) {
    return "Needs refinement";
  }
  return "Weak validation";
}

export function buildRecommendation({
  finalBusinessValidationScore,
  validationStatus,
  topScent,
  topPriceRange,
}: {
  finalBusinessValidationScore: number;
  validationStatus: ValidationStatus;
  topScent: string;
  topPriceRange: string;
}) {
  if (finalBusinessValidationScore >= 80) {
    return `Ide scented hijab Enola sudah memiliki sinyal validasi yang kuat. Lanjutkan ke market testing dengan varian aroma ${topScent.toLowerCase()} dan harga acuan ${topPriceRange}.`;
  }

  if (validationStatus === "Promising, test further") {
    return `Pasar menunjukkan minat yang menjanjikan, tetapi Enola perlu menguji kombinasi aroma ${topScent.toLowerCase()} dan harga ${topPriceRange} secara terkontrol untuk mengonfirmasi conversion nyata.`;
  }

  if (validationStatus === "Needs refinement") {
    return `Ide produk masih memiliki potensi, tetapi positioning, benefit utama, atau strategi pricing Enola perlu dipertajam sebelum market test yang lebih agresif.`;
  }

  return `Sinyal pasar saat ini belum cukup kuat. Enola sebaiknya memperdalam riset konsumen dan meninjau ulang proposisi scented hijab sebelum masuk ke market testing.`;
}

export function buildTestingStrategy({
  status,
  topScent,
  topChannel,
  topPriceRange,
}: {
  status: ValidationStatus;
  topScent: string;
  topChannel: string;
  topPriceRange: string;
}) {
  if (status === "Strong validation") {
    return `Mulai market test terbatas dengan 1 varian utama ${topScent.toLowerCase()}, distribusi awal di channel ${topChannel.toLowerCase()}, dan anchor price ${topPriceRange}.`;
  }

  if (status === "Promising, test further") {
    return `Jalankan waitlist atau pre-order mini dengan 1-2 varian aroma, lalu ukur respons pembelian aktual di channel ${topChannel.toLowerCase()} sebelum memperluas stok.`;
  }

  if (status === "Needs refinement") {
    return `Lakukan test message terlebih dahulu: validasi aroma ${topScent.toLowerCase()}, benefit utama, dan sensitivitas harga sebelum masuk ke penjualan terbuka.`;
  }

  return `Prioritaskan survei lanjutan dan interview singkat untuk mengecek ulang problem inti, manfaat yang benar-benar dicari, dan batas harga yang realistis.`;
}

export function buildInsightSummary(lines: Array<string | null | undefined>) {
  return lines.filter(Boolean) as string[];
}

export function buildScorecards(scorecards: FinalValidationData["scorecards"]) {
  return scorecards.map((card) => ({
    ...card,
    summary: `${Math.round(card.value)}%`,
  }));
}
