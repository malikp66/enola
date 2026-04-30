import {
  buildInsightSummary,
  buildRecommendation,
  buildTestingStrategy,
  buildValidationStatus,
  pickQuestionInsight,
} from "@/lib/insights";
import type {
  DistributionDatum,
  ParsedSurveyData,
  SurveyAnalytics,
} from "@/types/survey";

const TARGET_PRICE_RANGE = "Rp100.000 - Rp200.000";

function toPercent(value: number, total: number) {
  if (!total) {
    return 0;
  }
  return Number(((value / total) * 100).toFixed(1));
}

function roundScore(value: number) {
  return Number(value.toFixed(1));
}

function titleCase(value: string) {
  return value
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeFreeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function canonicalLabel(value: string, dictionary: Array<[string[], string]>) {
  const normalized = normalizeFreeText(value);

  for (const [keywords, label] of dictionary) {
    // All keywords in a group must be present (AND logic)
    if (keywords.every((keyword) => normalized.includes(keyword))) {
      return label;
    }
  }

  return titleCase(value);
}

function countDistribution(values: string[], dictionary?: Array<[string[], string]>) {
  const counts = new Map<string, number>();

  for (const value of values) {
    if (!value) {
      continue;
    }

    const label = dictionary ? canonicalLabel(value, dictionary) : titleCase(value);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  const total = Array.from(counts.values()).reduce((sum, value) => sum + value, 0);

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .map(([label, value]) => ({
      label,
      value,
      percentage: toPercent(value, total),
    })) satisfies DistributionDatum[];
}

function findTop(distribution: DistributionDatum[]) {
  return distribution[0]?.label ?? "Belum ada data";
}

function findSecond(distribution: DistributionDatum[]) {
  return distribution[1]?.label;
}

function scoreShare(distribution: DistributionDatum[], labels: string[]) {
  return distribution
    .filter((item) => labels.includes(item.label))
    .reduce((sum, item) => sum + item.percentage, 0);
}

const CHANNEL_DICTIONARY: Array<[string[], string]> = [
  [["shopee"], "Marketplace"],
  [["tokopedia"], "Marketplace"],
  [["tiktok"], "TikTok Shop"],
  [["instagram"], "Instagram Shop"],
  [["whatsapp"], "Reseller / WhatsApp"],
  [["reseller"], "Reseller / WhatsApp"],
  [["teman"], "Reseller / WhatsApp"],
  [["toko kerudung"], "Toko Offline"],
  [["toko baju muslim"], "Toko Offline"],
  [["online shop"], "Online Shop"],
  [["website"], "Website Brand"],
];

const PRIORITY_DICTIONARY: Array<[string[], string]> = [
  [["bahan adem"], "Bahan adem dan nyaman"],
  [["warna"], "Warna / model bagus"],
  [["harga terjangkau"], "Harga terjangkau"],
  [["tidak mudah kusut"], "Tidak mudah kusut"],
  [["mudah dibentuk"], "Mudah dibentuk"],
  [["wangi", "terasa segar"], "Wangi / terasa segar"],
];

const PROBLEM_DICTIONARY: Array<[string[], string]> = [
  [["bau setelah"], "Bau setelah dipakai lama"],
  [["bau", "lama"], "Bau setelah dipakai lama"],
  [["gerah"], "Gerah / panas"],
  [["panas"], "Gerah / panas"],
  [["lepek"], "Lepek"],
  [["kusut"], "Mudah kusut"],
  [["susah dibentuk"], "Susah dibentuk"],
  [["tidak ada masalah"], "Tidak ada masalah"],
];

const FRESHNESS_DICTIONARY: Array<[string[], string]> = [
  [["tidak pernah"], "Tidak pernah"],
  [["sering"], "Sering"],
  [["kadang"], "Kadang-kadang"],
  [["jarang"], "Jarang"],
];

const INTEREST_DICTIONARY: Array<[string[], string]> = [
  [["sangat tertarik"], "Sangat tertarik"],
  [["tidak tertarik"], "Tidak tertarik"],
  [["biasa saja"], "Biasa saja"],
  [["tertarik"], "Tertarik"],
];

const BENEFIT_DICTIONARY: Array<[string[], string]> = [
  [["lebih segar"], "Kerudung terasa lebih segar"],
  [["segar"], "Kerudung terasa lebih segar"],
  [["percaya diri"], "Menambah rasa percaya diri"],
  [["mengurangi", "bau"], "Mengurangi bau tidak sedap"],
  [["bau"], "Mengurangi bau tidak sedap"],
  [["acara"], "Cocok dipakai untuk acara tertentu"],
  [["tidak merasa", "manfaat"], "Tidak merasa ada manfaat khusus"],
];

const SCENT_DICTIONARY: Array<[string[], string]> = [
  [["bunga lembut"], "Bunga lembut"],
  [["bedak bayi"], "Bedak bayi"],
  [["sabun bersih"], "Sabun bersih"],
  [["buah segar"], "Buah segar"],
  [["herbal"], "Herbal / Natural"],
  [["natural"], "Herbal / Natural"],
  [["vanila"], "Vanila"],
  [["vanilla"], "Vanila"],
  [["tidak suka kerudung beraroma"], "Tidak suka aroma"],
  [["tidak suka"], "Tidak suka aroma"],
  [["udara segar"], "Udara Segar"],
];

const CONCERN_DICTIONARY: Array<[string[], string]> = [
  [["tidak ada kekhawatiran"], "Tidak ada kekhawatiran"],
  [["pusing"], "Takut membuat pusing"],
  [["gatal"], "Takut membuat gatal"],
  [["iritasi"], "Takut iritasi"],
  [["cepat hilang"], "Takut aroma cepat hilang"],
  [["terlalu menyengat"], "Takut wanginya terlalu menyengat"],
  [["harga", "mahal"], "Takut harganya terlalu mahal"],
];

const PRICE_DICTIONARY: Array<[string[], string]> = [
  [["di atas"], "Di atas Rp300.000"],
  [["50.000 - rp100.000"], "Rp50.000 - Rp100.000"],
  [["50.000", "100.000"], "Rp50.000 - Rp100.000"],
  [["100.000 - rp200.000"], "Rp100.000 - Rp200.000"],
  [["100.000", "200.000"], "Rp100.000 - Rp200.000"],
  [["200.000 - rp300.000"], "Rp200.000 - Rp300.000"],
  [["200.000", "300.000"], "Rp200.000 - Rp300.000"],
  [["di bawah"], "Di bawah Rp100.000"],
];

const PURCHASE_INTENTION_DICTIONARY: Array<[string[], string]> = [
  [["sangat mungkin"], "Sangat mungkin"],
  [["kurang mungkin"], "Kurang mungkin"],
  [["tidak mungkin"], "Tidak mungkin"],
  [["ragu"], "Ragu-ragu"],
  [["mungkin"], "Mungkin"],
];

export function buildSurveyAnalytics(parsed: ParsedSurveyData): SurveyAnalytics {
  const provinces = countDistribution(
    parsed.rows.map((row) => row.province ?? "").filter(Boolean)
  );
  const buyingFrequency = countDistribution(
    parsed.rows.map((row) => row.buyingFrequency ?? "").filter(Boolean)
  );
  const purchaseChannels = countDistribution(
    parsed.rows.flatMap((row) => row.purchaseChannels),
    CHANNEL_DICTIONARY
  );
  const buyingPriority = countDistribution(
    parsed.rows.flatMap((row) => row.buyingPriority),
    PRIORITY_DICTIONARY
  );
  const problemChart = countDistribution(
    parsed.rows.flatMap((row) => row.problems),
    PROBLEM_DICTIONARY
  );
  const freshnessDiscomfortChart = countDistribution(
    parsed.rows.map((row) => row.freshnessDiscomfort ?? "").filter(Boolean),
    FRESHNESS_DICTIONARY
  );
  const interestChart = countDistribution(
    parsed.rows.map((row) => row.productInterest ?? "").filter(Boolean),
    INTEREST_DICTIONARY
  );
  const mainBenefitChart = countDistribution(
    parsed.rows.flatMap((row) => row.mainBenefit),
    BENEFIT_DICTIONARY
  );
  const scentChart = countDistribution(
    parsed.rows.map((row) => row.preferredScent ?? "").filter(Boolean),
    SCENT_DICTIONARY
  );
  const mainConcernChart = countDistribution(
    parsed.rows.flatMap((row) => row.mainConcern),
    CONCERN_DICTIONARY
  );
  const currentPriceChart = countDistribution(
    parsed.rows.map((row) => row.currentPrice ?? "").filter(Boolean),
    PRICE_DICTIONARY
  );
  const acceptablePriceChart = countDistribution(
    parsed.rows.map((row) => row.acceptablePrice ?? "").filter(Boolean),
    PRICE_DICTIONARY
  );
  const purchaseIntentionChart = countDistribution(
    parsed.rows.map((row) => row.purchaseIntention ?? "").filter(Boolean),
    PURCHASE_INTENTION_DICTIONARY
  );

  const totalRespondents = parsed.rows.length;
  const marketInterestScore = roundScore(
    scoreShare(interestChart, ["Sangat tertarik", "Tertarik"])
  );
  const purchaseIntentionScore = roundScore(
    scoreShare(purchaseIntentionChart, ["Sangat mungkin", "Mungkin"])
  );
  const freshnessNeedScore = roundScore(
    scoreShare(freshnessDiscomfortChart, ["Sering", "Kadang-kadang"])
  );
  const problemAnyShare = 100 - scoreShare(problemChart, ["Tidak ada masalah"]);
  const coreProblemShare = scoreShare(problemChart, [
    "Bau setelah dipakai lama",
    "Gerah / panas",
    "Lepek",
  ]);
  const problemRelevanceScore = roundScore(problemAnyShare * 0.4 + coreProblemShare * 0.6);
  const priceFitScore = roundScore(
    acceptablePriceChart.find((item) => item.label === TARGET_PRICE_RANGE)?.percentage ?? 0
  );
  const finalBusinessValidationScore = roundScore(
    (marketInterestScore + purchaseIntentionScore + problemRelevanceScore + priceFitScore) / 4
  );
  const validationStatus = buildValidationStatus(finalBusinessValidationScore);

  const topScent = findTop(scentChart);
  const topPriceRange = findTop(acceptablePriceChart);
  const topChannel = findTop(purchaseChannels);

  const recommendation = buildRecommendation({
    finalBusinessValidationScore,
    validationStatus,
    topScent,
    topPriceRange,
  });
  const testingStrategy = buildTestingStrategy({
    status: validationStatus,
    topScent,
    topChannel,
    topPriceRange,
  });

  const insightSummary = buildInsightSummary([
    `Total responden survei adalah ${totalRespondents} orang.`,
    `Provinsi dengan responden terbanyak adalah ${findTop(provinces)}.`,
    `${Math.round(freshnessNeedScore)}% responden sering atau kadang merasa kurang nyaman karena kerudung terasa bau atau tidak segar.`,
    `Masalah utama responden adalah ${findTop(problemChart)}.`,
    `Market Interest Score Enola mencapai ${Math.round(marketInterestScore)}%.`,
    `Aroma yang paling disukai adalah ${topScent}.`,
    `Rentang harga yang paling diterima adalah ${topPriceRange}.`,
    `Purchase Potential Score mencapai ${Math.round(purchaseIntentionScore)}%.`,
    `Berdasarkan final score ${Math.round(finalBusinessValidationScore)}, ide produk Enola masuk kategori ${validationStatus}.`,
  ]);

  return {
    sourcePath: parsed.csvPath,
    headers: parsed.headers,
    columnMap: parsed.columnMap,
    totalRespondents,
    marketOverview: {
      totalRespondents,
      topProvince: findTop(provinces),
      topPurchaseChannel: findTop(purchaseChannels),
      provinceDistribution: provinces,
      freshnessNeedScore,
      freshnessNeedLabel: `${Math.round(freshnessNeedScore)}%`,
      buyingFrequency,
      purchaseChannels,
    },
    customerProblem: {
      topProblem: findTop(problemChart),
      secondaryProblem: findSecond(problemChart),
      problemChart,
      problemRelevanceScore,
    },
    productInterest: {
      marketInterestScore,
      interestChart,
      mainBenefitChart,
    },
    preferredScent: {
      topScent,
      secondaryScent: findSecond(scentChart),
      scentChart,
      mvpRecommendation:
        topScent === "Belum ada data"
          ? "Belum ada rekomendasi aroma karena data belum cukup."
          : `Varian MVP paling aman dimulai dari aroma ${topScent.toLowerCase()} karena menjadi preferensi tertinggi responden.`,
    },
    priceAcceptance: {
      topPriceRange,
      priceFitScore,
      acceptablePriceChart,
      currentPriceChart,
    },
    purchaseIntention: {
      purchaseIntentionScore,
      purchaseIntentionChart,
      conversionOpportunity:
        purchaseIntentionScore >= 70
          ? "Sinyal willingness to try sudah cukup kuat untuk mendorong market test terbatas."
          : "Intent beli ada, tetapi perlu diperkuat dengan messaging, aroma MVP, dan framing harga.",
    },
    consumerSignals: {
      buyingPriorityChart: buyingPriority,
      freshnessDiscomfortChart,
      mainConcernChart,
    },
    finalValidation: {
      finalBusinessValidationScore,
      validationStatus,
      recommendation,
      testingStrategy,
      scorecards: [
        {
          label: "Market Interest",
          value: marketInterestScore,
          summary: "Gabungan responden tertarik",
        },
        {
          label: "Purchase Intention",
          value: purchaseIntentionScore,
          summary: "Gabungan responden mungkin membeli",
        },
        {
          label: "Problem Relevance",
          value: problemRelevanceScore,
          summary: "Kekuatan masalah yang relevan dengan scented hijab",
        },
        {
          label: "Price Fit",
          value: priceFitScore,
          summary: `Kecocokan dengan target harga ${TARGET_PRICE_RANGE}`,
        },
      ],
    },
    insightSummary,
    questionInsights: {
      province: pickQuestionInsight(
        "Asal daerah responden",
        provinces,
        "Data wilayah belum cukup untuk dianalisis.",
        "prioritas wilayah"
      ),
      buyingFrequency: pickQuestionInsight(
        "Seberapa sering membeli kerudung baru",
        buyingFrequency,
        "Frekuensi pembelian belum cukup untuk dibaca.",
        "repeat purchase"
      ),
      purchaseChannels: pickQuestionInsight(
        "Di mana responden membeli kerudung",
        purchaseChannels,
        "Channel pembelian belum terbaca.",
        "distribusi"
      ),
      buyingPriority: pickQuestionInsight(
        "Hal paling penting saat membeli kerudung",
        buyingPriority,
        "Prioritas pembelian belum terbaca.",
        "nilai produk"
      ),
      problems: pickQuestionInsight(
        "Masalah yang dirasakan saat memakai kerudung",
        problemChart,
        "Masalah pengguna belum terbaca.",
        "problem-solution fit"
      ),
      freshnessDiscomfort: pickQuestionInsight(
        "Seberapa sering merasa kurang nyaman karena bau atau tidak segar",
        freshnessDiscomfortChart,
        "Sinyal ketidaknyamanan belum terbaca.",
        "messaging kesegaran"
      ),
      productInterest: pickQuestionInsight(
        "Ketertarikan terhadap ide kerudung wangi",
        interestChart,
        "Minat terhadap produk belum terbaca.",
        "permintaan awal"
      ),
      mainBenefit: pickQuestionInsight(
        "Manfaat utama kerudung wangi",
        mainBenefitChart,
        "Benefit yang dicari belum terbaca.",
        "komunikasi manfaat"
      ),
      preferredScent: pickQuestionInsight(
        "Aroma yang paling disukai",
        scentChart,
        "Preferensi aroma belum terbaca.",
        "varian MVP"
      ),
      mainConcern: pickQuestionInsight(
        "Kekhawatiran terbesar terhadap kerudung wangi",
        mainConcernChart,
        "Kekhawatiran konsumen belum terbaca.",
        "risk messaging"
      ),
      currentPrice: pickQuestionInsight(
        "Harga kerudung yang biasa dibeli",
        currentPriceChart,
        "Harga kebiasaan beli belum terbaca.",
        "benchmark harga saat ini"
      ),
      acceptablePrice: pickQuestionInsight(
        "Harga yang masih cocok untuk produk ini",
        acceptablePriceChart,
        "Kecocokan harga belum terbaca.",
        "pricing awal"
      ),
      purchaseIntention: pickQuestionInsight(
        "Kemungkinan mencoba membeli",
        purchaseIntentionChart,
        "Potensi pembelian belum terbaca.",
        "conversion test"
      ),
    },
  };
}
