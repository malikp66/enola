import Papa from "papaparse";

import type {
  ParsedSurveyData,
  SurveyColumnMap,
  SurveyFieldKey,
  SurveyRecord,
} from "@/types/survey";

const FIELD_MATCHERS: Record<
  SurveyFieldKey,
  { include: string[][]; exclude?: string[] }
> = {
  timestamp: {
    include: [["timestamp"]],
  },
  province: {
    include: [["asal", "daerah"], ["provinsi"], ["domisili"]],
  },
  buyingFrequency: {
    include: [["seberapa", "sering", "membeli", "kerudung"]],
  },
  purchaseChannels: {
    include: [["membeli", "kerudung", "di", "mana"], ["tempat", "beli"]],
  },
  buyingPriority: {
    include: [["hal", "apa", "paling", "penting"], ["yang", "paling", "penting"]],
  },
  problems: {
    include: [["masalah", "sering", "rasakan", "memakai", "kerudung"]],
  },
  freshnessDiscomfort: {
    include: [["bau", "tidak", "segar"], ["kurang", "nyaman", "kerudung"]],
  },
  activeHijabUsage: {
    include: [
      ["seberapa", "sering", "memakai", "kerudung"],
      ["pengguna", "kerudung", "aktif"],
    ],
    exclude: ["masalah", "rasakan"],
  },
  productInterest: {
    include: [["kerudung", "aroma", "wangi"], ["apakah", "tertarik"]],
  },
  mainBenefit: {
    include: [["manfaat", "utama", "kerudung", "wangi"]],
  },
  preferredScent: {
    include: [["aroma", "paling", "sukai", "kerudung"]],
  },
  mainConcern: {
    include: [["kekhawatiran", "terbesar"], ["terhadap", "kerudung", "wangi"]],
  },
  currentPrice: {
    include: [["biasanya", "membeli", "kerudung", "dengan", "harga"]],
  },
  acceptablePrice: {
    include: [["harga", "masih", "cocok"], ["kualitas", "bahan", "nyaman"]],
  },
  purchaseIntention: {
    include: [["kemungkinan", "mencoba", "membelinya"], ["produk", "ini", "tersedia"]],
  },
};

const CRITICAL_FIELDS: SurveyFieldKey[] = [
  "province",
  "buyingFrequency",
  "purchaseChannels",
  "problems",
  "productInterest",
  "preferredScent",
  "acceptablePrice",
  "purchaseIntention",
];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[“”"']/g, "")
    .replace(/[–—]/g, "-")
    .replace(/[^\p{L}\p{N}\s/-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findColumn(headers: string[], field: SurveyFieldKey) {
  const matcher = FIELD_MATCHERS[field];

  for (const header of headers) {
    const normalized = normalizeText(header);
    const hasGroup = matcher.include.some((group) =>
      group.every((token) => normalized.includes(token))
    );
    const blocked = matcher.exclude?.some((token) => normalized.includes(token));

    if (hasGroup && !blocked) {
      return header;
    }
  }

  return null;
}

function cleanValue(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function splitMultiValue(value: string) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => cleanValue(entry))
    .filter(Boolean);
}

function mapRow(row: Record<string, string>, columnMap: SurveyColumnMap): SurveyRecord {
  return {
    timestamp: cleanValue(row[columnMap.timestamp ?? ""]),
    province: cleanValue(row[columnMap.province ?? ""]),
    buyingFrequency: cleanValue(row[columnMap.buyingFrequency ?? ""]),
    purchaseChannels: splitMultiValue(cleanValue(row[columnMap.purchaseChannels ?? ""])),
    buyingPriority: splitMultiValue(cleanValue(row[columnMap.buyingPriority ?? ""])),
    problems: splitMultiValue(cleanValue(row[columnMap.problems ?? ""])),
    freshnessDiscomfort: cleanValue(row[columnMap.freshnessDiscomfort ?? ""]),
    activeHijabUsage: cleanValue(row[columnMap.activeHijabUsage ?? ""]),
    productInterest: cleanValue(row[columnMap.productInterest ?? ""]),
    mainBenefit: splitMultiValue(cleanValue(row[columnMap.mainBenefit ?? ""])),
    preferredScent: cleanValue(row[columnMap.preferredScent ?? ""]),
    mainConcern: splitMultiValue(cleanValue(row[columnMap.mainConcern ?? ""])),
    currentPrice: cleanValue(row[columnMap.currentPrice ?? ""]),
    acceptablePrice: cleanValue(row[columnMap.acceptablePrice ?? ""]),
    purchaseIntention: cleanValue(row[columnMap.purchaseIntention ?? ""]),
  };
}

export async function loadSurveyCsv(csvPath = "/data/enola-survey.csv"): Promise<ParsedSurveyData> {
  const response = await fetch(csvPath, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Data survei belum ditemukan di folder public.");
  }

  const csvText = await response.text();

  if (!csvText.trim()) {
    throw new Error("File CSV ditemukan tetapi isinya kosong.");
  }

  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error("Format CSV tidak bisa dibaca. Pastikan file export Google Sheets valid.");
  }

  const headers = parsed.meta.fields ?? [];
  const columnMap = Object.keys(FIELD_MATCHERS).reduce((accumulator, field) => {
    const typedField = field as SurveyFieldKey;
    accumulator[typedField] = findColumn(headers, typedField);
    return accumulator;
  }, {} as SurveyColumnMap);

  const missingCriticalFields = CRITICAL_FIELDS.filter((field) => !columnMap[field]);
  const rows = parsed.data
    .map((row) => mapRow(row, columnMap))
    .filter((row) =>
      Object.values(row).some((value) =>
        Array.isArray(value) ? value.length > 0 : Boolean(value)
      )
    );

  return {
    csvPath,
    headers,
    columnMap,
    rows,
    missingCriticalFields,
  };
}
