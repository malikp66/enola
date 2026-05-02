import { readFile } from "node:fs/promises";
import path from "node:path";

const LOCAL_SURVEY_PATH = path.join(process.cwd(), "public", "data", "enola-survey.csv");

function buildGoogleSheetsCsvUrl() {
  const directCsvUrl = process.env.GOOGLE_SHEETS_CSV_URL?.trim();
  if (directCsvUrl) {
    return directCsvUrl;
  }

  const sheetsUrl = process.env.GOOGLE_SHEETS_URL?.trim();
  if (!sheetsUrl) {
    return null;
  }

  try {
    const parsed = new URL(sheetsUrl);
    const match = parsed.pathname.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);

    if (!match) {
      return null;
    }

    const spreadsheetId = match[1];
    const gid = parsed.searchParams.get("gid") ?? parsed.hash.match(/gid=(\d+)/)?.[1] ?? "0";

    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
  } catch {
    return null;
  }
}

async function loadLocalSurveyCsv() {
  return readFile(LOCAL_SURVEY_PATH, "utf8");
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const remoteCsvUrl = buildGoogleSheetsCsvUrl();

  if (remoteCsvUrl) {
    try {
      const response = await fetch(remoteCsvUrl, {
        cache: "no-store",
        headers: {
          accept: "text/csv,text/plain;q=0.9,*/*;q=0.8",
        },
      });

      if (response.ok) {
        const csvText = await response.text();

        if (csvText.trim()) {
          return new Response(csvText, {
            status: 200,
            headers: {
              "content-type": "text/csv; charset=utf-8",
              "cache-control": "no-store, max-age=0",
              "x-survey-source": "google-sheets",
            },
          });
        }
      }
    } catch {
      // Fallback to the bundled CSV when remote sync is unavailable.
    }
  }

  try {
    const localCsv = await loadLocalSurveyCsv();

    return new Response(localCsv, {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "cache-control": "no-store, max-age=0",
        "x-survey-source": "local-fallback",
      },
    });
  } catch {
    return Response.json(
      {
        error:
          "Data survei belum tersedia. Set GOOGLE_SHEETS_CSV_URL/GOOGLE_SHEETS_URL atau sediakan public/data/enola-survey.csv.",
      },
      { status: 404 }
    );
  }
}
