import { extractReadableText } from "@/lib/website/extractReadableText";
import { WebsiteExtract } from "@/lib/types";
import { normalizeWebsiteUrl, uniqueStrings } from "@/lib/utils";

const PAGE_CANDIDATES = [
  "",
  "/about",
  "/products",
  "/platform",
  "/solutions",
  "/technology",
  "/industries",
  "/security",
  "/customers",
  "/case-studies",
  "/blog",
];

const MAX_PAGES = 8;
const MAX_TEXT_LENGTH = 24000;
const MAX_BYTES = 700_000;

async function fetchTextPage(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Gov-Adoption-Radar/0.1",
        Accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";
    const contentLength = Number(response.headers.get("content-length") ?? "0");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    if (!contentType.includes("text/html")) {
      throw new Error(`Unsupported content type: ${contentType}`);
    }

    if (contentLength > MAX_BYTES) {
      throw new Error("Page exceeded size limit.");
    }

    const html = await response.text();
    if (html.length > MAX_BYTES) {
      throw new Error("Page body exceeded size limit.");
    }

    return html;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchWebsite(websiteUrl: string, manualText?: string): Promise<WebsiteExtract> {
  const normalizedUrl = normalizeWebsiteUrl(websiteUrl);
  const root = new URL(normalizedUrl);

  if (manualText?.trim()) {
    return {
      url: normalizedUrl,
      title: root.hostname,
      metaDescription: "Manual fallback text provided after website fetch error.",
      pagesFetched: [
        {
          url: normalizedUrl,
          title: root.hostname,
          status: "fetched",
        },
      ],
      headings: [],
      visibleText: manualText.trim().slice(0, MAX_TEXT_LENGTH),
      linksDiscovered: [],
      extractionStatus: "partial",
      errors: ["Website fetch was bypassed with manual fallback text."],
    };
  }

  const pagesFetched: WebsiteExtract["pagesFetched"] = [];
  const errors: string[] = [];
  const textParts: string[] = [];
  const headings: string[] = [];
  const discoveredLinks = new Set<string>();
  let title = "";
  let metaDescription = "";

  for (const candidate of PAGE_CANDIDATES.slice(0, MAX_PAGES)) {
    const pageUrl = new URL(candidate || "/", root).toString().replace(/\/$/, candidate ? "" : "/");

    try {
      const html = await fetchTextPage(pageUrl);
      const extracted = extractReadableText(html);

      if (!title && extracted.title) title = extracted.title;
      if (!metaDescription && extracted.metaDescription) metaDescription = extracted.metaDescription;

      textParts.push(extracted.visibleText);
      headings.push(...extracted.headings);
      extracted.linksDiscovered.forEach((link) => discoveredLinks.add(link));
      pagesFetched.push({
        url: pageUrl,
        title: extracted.title || pageUrl,
        status: "fetched",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown fetch error";
      errors.push(`${pageUrl}: ${message}`);
      pagesFetched.push({
        url: pageUrl,
        title: pageUrl,
        status: "error",
      });
    }
  }

  const dedupedText = uniqueStrings(
    textParts
      .join("\n")
      .split(/(?<=\.)\s+/)
      .map((part) => part.trim()),
  )
    .join(" ")
    .slice(0, MAX_TEXT_LENGTH);

  if (!dedupedText) {
    throw new Error("Website analysis failed. No readable text was extracted from the site.");
  }

  return {
    url: normalizedUrl,
    title: title || root.hostname,
    metaDescription,
    pagesFetched,
    headings: uniqueStrings(headings).slice(0, 30),
    visibleText: dedupedText,
    linksDiscovered: Array.from(discoveredLinks).slice(0, 50),
    extractionStatus: errors.length === 0 ? "success" : "partial",
    errors,
  };
}
