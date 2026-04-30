"use client";

import { ChevronDown } from "lucide-react";
import {
  type FocusEvent,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";
import type { DistributionDatum } from "@/types/survey";

type ProvinceGlyphShape = {
  path: string;
  viewBox: string;
};

type ProvinceTooltipState = {
  label: string;
  percentage: number;
  rank: number;
  value: number;
  x: number;
  y: number;
};

const SVG_VIEW_BOX = "0 0 800 400";

const PROVINCE_ID_BY_LABEL: Record<string, string> = {
  Aceh: "IDAC",
  Bali: "IDBA",
  Banten: "IDBT",
  "DKI Jakarta": "IDJK",
  "Jawa Barat": "IDJB",
  "Jawa Tengah": "IDJT",
  "Jawa Timur": "IDJI",
  "Kalimantan Timur": "IDKI",
  Lampung: "IDLA",
  "Sulawesi Barat": "IDSR",
  "Sulawesi Selatan": "IDSN",
  "Sumatera Barat": "IDSB",
  "Sumatera Utara": "IDSU",
};

const PROVINCE_NAME_ALIASES: Record<string, string[]> = {
  "DKI Jakarta": ["Jakarta Raya"],
};

function normalizeProvinceName(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function provinceFill(share: number) {
  const opacity = 0.2 + share * 0.8;
  return `rgba(201,129,93,${opacity.toFixed(3)})`;
}

function intensity(value: number, max: number) {
  if (!max) {
    return 0.25;
  }

  return Math.max(0.16, value / max);
}

function ProvinceGlyph({
  shape,
  className,
}: {
  shape?: ProvinceGlyphShape;
  className?: string;
}) {
  if (!shape) {
    return null;
  }

  return (
    <svg
      viewBox={shape.viewBox}
      className={className}
      aria-hidden="true"
      fill="currentColor"
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={shape.path} />
    </svg>
  );
}

function findProvincePath(paths: SVGPathElement[], provinceLabel: string) {
  const provinceId = PROVINCE_ID_BY_LABEL[provinceLabel];

  if (provinceId) {
    const byId = paths.find((path) => path.id === provinceId);

    if (byId) {
      return byId;
    }
  }

  const expectedNames = [
    provinceLabel,
    ...(PROVINCE_NAME_ALIASES[provinceLabel] ?? []),
  ].map(normalizeProvinceName);

  return paths.find((path) => {
    const candidates = [
      path.getAttribute("name"),
      path.getAttribute("class"),
      path.id,
    ]
      .filter(Boolean)
      .map((value) => normalizeProvinceName(value as string));

    return expectedNames.some((expected) => candidates.includes(expected));
  });
}

function createGlyphShape(
  sourceSvg: SVGSVGElement,
  sourcePath: SVGPathElement
) {
  const fallback = {
    path: sourcePath.getAttribute("d") ?? "",
    viewBox: sourceSvg.getAttribute("viewBox") ?? SVG_VIEW_BOX,
  };

  try {
    const measureSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    const measurePath = sourcePath.cloneNode(true) as SVGPathElement;

    measureSvg.setAttribute("viewBox", fallback.viewBox);
    measureSvg.style.position = "absolute";
    measureSvg.style.left = "-9999px";
    measureSvg.style.top = "-9999px";
    measureSvg.style.width = "0";
    measureSvg.style.height = "0";
    measureSvg.style.overflow = "visible";
    measureSvg.style.pointerEvents = "none";
    measureSvg.appendChild(measurePath);
    document.body.appendChild(measureSvg);

    const bbox = measurePath.getBBox();
    document.body.removeChild(measureSvg);

    if (!bbox.width || !bbox.height) {
      return fallback;
    }

    const padding = Math.max(1.8, Math.min(bbox.width, bbox.height) * 0.22);

    return {
      path: fallback.path,
      viewBox: `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`,
    };
  } catch {
    return fallback;
  }
}

function readTooltipState(
  target: EventTarget | null,
  wrapper: HTMLDivElement | null,
  position?: { clientX: number; clientY: number }
) {
  if (!(target instanceof SVGPathElement) || !wrapper) {
    return null;
  }

  const {
    provinceLabel,
    provinceValue,
    provincePercentage,
    provinceRank,
  } = target.dataset;

  if (!provinceLabel || !provinceValue || !provincePercentage || !provinceRank) {
    return null;
  }

  const wrapperRect = wrapper.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const rawX =
    position?.clientX ?? targetRect.left + targetRect.width / 2;
  const rawY =
    position?.clientY ?? targetRect.top + targetRect.height / 2;

  return {
    label: provinceLabel,
    value: Number(provinceValue),
    percentage: Number(provincePercentage),
    rank: Number(provinceRank),
    x: Math.min(Math.max(rawX - wrapperRect.left, 108), wrapperRect.width - 108),
    y: Math.min(Math.max(rawY - wrapperRect.top, 98), wrapperRect.height - 26),
  };
}

export function ProvinceDistributionMap({
  provinces,
}: {
  provinces: DistributionDatum[];
}) {
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [provinceGlyphs, setProvinceGlyphs] = useState<
    Record<string, ProvinceGlyphShape>
  >({});
  const [tooltip, setTooltip] = useState<ProvinceTooltipState | null>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);

  const maxCount = provinces[0]?.value ?? 0;

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      const response = await fetch("/maps/id.svg");
      const svgText = await response.text();
      const parser = new DOMParser();
      const svgDocument = parser.parseFromString(svgText, "image/svg+xml");
      const svg = svgDocument.documentElement as unknown as SVGSVGElement;
      const provincePaths = Array.from(
        svg.querySelectorAll<SVGPathElement>("path[id]")
      );
      const nextGlyphs: Record<string, ProvinceGlyphShape> = {};

      svg.setAttribute("viewBox", svg.getAttribute("viewBox") ?? SVG_VIEW_BOX);
      svg.setAttribute("class", "h-full w-full");
      svg.setAttribute(
        "aria-label",
        "Peta persebaran responden berdasarkan provinsi di Indonesia"
      );
      svg.setAttribute("role", "img");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.removeAttribute("width");
      svg.removeAttribute("height");

      svg.querySelectorAll("circle, text").forEach((node) => node.remove());

      provincePaths.forEach((path) => {
        path.setAttribute("class", "province-region");
        path.setAttribute("fill", "#f6efe9");
        path.setAttribute("stroke", "#e7d7cb");
        path.setAttribute("stroke-width", "0.75");
        path.setAttribute("vector-effect", "non-scaling-stroke");
      });

      provinces.forEach((province, index) => {
        const provincePath = findProvincePath(provincePaths, province.label);

        if (!provincePath) {
          return;
        }

        const share = intensity(province.value, maxCount);

        provincePath.setAttribute("fill", provinceFill(share));
        provincePath.setAttribute(
          "stroke",
          index === 0 ? "rgba(142,84,54,0.55)" : "rgba(173,104,69,0.24)"
        );
        provincePath.setAttribute("stroke-width", index === 0 ? "1.05" : "0.85");
        provincePath.setAttribute("opacity", index === 0 ? "1" : "0.92");
        provincePath.setAttribute("data-hoverable", "true");
        provincePath.setAttribute("data-province-label", province.label);
        provincePath.setAttribute("data-province-value", String(province.value));
        provincePath.setAttribute(
          "data-province-percentage",
          String(Math.round(province.percentage))
        );
        provincePath.setAttribute("data-province-rank", String(index + 1));
        provincePath.setAttribute(
          "aria-label",
          `${province.label}, rank ${index + 1}, ${province.value} response, ${Math.round(province.percentage)} persen`
        );
        provincePath.setAttribute("tabindex", "0");

        nextGlyphs[province.label] = createGlyphShape(svg, provincePath);
      });

      const serializer = new XMLSerializer();

      if (!cancelled) {
        setSvgMarkup(serializer.serializeToString(svg));
        setProvinceGlyphs(nextGlyphs);
      }
    }

    loadMap().catch(() => {
      if (!cancelled) {
        setSvgMarkup(null);
        setProvinceGlyphs({});
      }
    });

    return () => {
      cancelled = true;
    };
  }, [maxCount, provinces]);

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
  }, [provinces]);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  function handleMapMove(event: MouseEvent<HTMLDivElement>) {
    setTooltip(
      readTooltipState(event.target, mapRef.current, {
        clientX: event.clientX,
        clientY: event.clientY,
      })
    );
  }

  function handleMapFocus(event: FocusEvent<HTMLDivElement>) {
    setTooltip(readTooltipState(event.target, mapRef.current));
  }

  function handleMapBlur() {
    setTooltip(null);
  }

  function handleMapLeave() {
    setTooltip(null);
  }

  function handleListScroll() {
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
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr] xl:items-stretch">
      <div className="relative flex h-full min-h-[30rem] flex-col">
        <div
          ref={mapRef}
          className="province-map relative h-full min-h-[30rem] w-full"
          onMouseMove={handleMapMove}
          onMouseLeave={handleMapLeave}
          onFocusCapture={handleMapFocus}
          onBlurCapture={handleMapBlur}
        >
          {svgMarkup ? (
            <div
              className="h-full w-full"
              dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />
          ) : (
            <div className="grid h-full min-h-[30rem] place-items-center text-sm text-[#947767]">
              Peta Indonesia sedang dimuat.
            </div>
          )}

          {tooltip ? (
            <div
              className="pointer-events-none absolute z-20 w-[13rem] rounded-[1.5rem] border border-[#ebd6c9] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,247,241,0.96)_100%)] px-4 py-3 shadow-[0_24px_60px_rgba(133,92,69,0.18)] backdrop-blur-md"
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: "translate(-50%, calc(-100% - 18px))",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#bc8163]">
                    Province Insight
                  </p>
                  <p className="mt-1 text-base font-medium text-[#2a1d16]">
                    {tooltip.label}
                  </p>
                </div>
                <div className="rounded-full bg-[#fff2ea] px-2.5 py-1 text-[0.72rem] font-semibold text-[#b86f4c]">
                  #{tooltip.rank}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-[1rem] bg-[#fff8f3] px-3 py-2">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#9b7f71]">
                    Response
                  </p>
                  <p className="mt-1 font-heading text-[1.5rem] leading-none text-[#2a1d16]">
                    {tooltip.value}
                  </p>
                </div>
                <div className="rounded-[1rem] bg-[#fff8f3] px-3 py-2">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#9b7f71]">
                    Share
                  </p>
                  <p className="mt-1 font-heading text-[1.5rem] leading-none text-[#2a1d16]">
                    {tooltip.percentage}%
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative flex h-full min-h-[30rem] flex-col">
        <div className="mb-4">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#b07b61]">
              Province Rank
            </p>
            <p className="mt-2 font-heading text-[2.2rem] leading-none text-[#251914]">
              {provinces.length}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#7a6558]">
              Provinsi terurut dari jumlah response terbanyak.
            </p>
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div
            ref={listRef}
            className={cn(
              "custom-scrollbar scrollbar-reveal h-full max-h-[30rem] space-y-3 overflow-y-auto pr-3 pb-12",
              isScrolling && "is-scrolling"
            )}
            onScroll={handleListScroll}
          >
            {provinces.map((province, index) => {
              const share = intensity(province.value, maxCount);
              const glyph = provinceGlyphs[province.label];

              return (
                <div
                  key={province.label}
                  className="rounded-[1.35rem] border border-[#efdfd4] bg-white/92 p-3.5"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "grid h-12 w-12 place-items-center rounded-full border border-[#eeded3] bg-[#fff6f0] text-[#bf7f62]",
                          !glyph && "text-[0.65rem] font-semibold"
                        )}
                      >
                        {glyph ? (
                          <ProvinceGlyph shape={glyph} className="h-7 w-7" />
                        ) : (
                          province.label.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#2b1f18]">
                          {province.label}
                        </p>
                        <p className="text-xs text-[#8c7467]">
                          Rank #{index + 1} • {province.value} response
                        </p>
                      </div>
                    </div>
                    <span className="font-heading text-[1.65rem] leading-none text-[#2b1f18]">
                      {Math.round(province.percentage)}%
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-[#f2e8e1]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#c9815d_0%,#e9b799_62%,#f5e4d7_100%)]"
                      style={{
                        width: `${Math.max(province.percentage, 8)}%`,
                        opacity: 0.58 + share * 0.42,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 h-12 bg-[linear-gradient(180deg,#fffaf7_5%,rgba(255,250,247,0.78)_36%,transparent_100%)] transition-opacity duration-300",
              canScrollUp ? "opacity-100" : "opacity-0"
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent_0%,rgba(255,250,247,0.82)_48%,#fffaf7_100%)] transition-opacity duration-300",
              canScrollDown ? "opacity-100" : "opacity-0"
            )}
          />

          {(canScrollDown || canScrollUp) && (
            <button
              type="button"
              onClick={handleScrollHintClick}
              className="absolute inset-x-0 bottom-0 mx-auto grid h-10 w-10 place-items-center rounded-full border border-[#ebd9cd] bg-white/96 text-[#b87a5e] shadow-[0_14px_30px_rgba(145,104,79,0.12)] transition-transform duration-300 hover:-translate-y-0.5"
              aria-label={
                canScrollDown
                  ? "Scroll ke daftar provinsi berikutnya"
                  : "Kembali ke atas daftar provinsi"
              }
            >
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  !canScrollDown && canScrollUp && "rotate-180"
                )}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
