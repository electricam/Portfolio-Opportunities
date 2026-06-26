import * as cheerio from "cheerio";
import { uniqueStrings } from "@/lib/utils";

export function extractReadableText(html: string) {
  const $ = cheerio.load(html);
  $("script, style, noscript, svg, iframe").remove();

  const title = $("title").first().text().trim();
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ??
    $('meta[property="og:description"]').attr("content")?.trim() ??
    "";

  const headings = uniqueStrings(
    $("h1, h2, h3")
      .toArray()
      .map((element) => $(element).text().replace(/\s+/g, " ").trim())
      .filter((text) => text.length > 2),
  ).slice(0, 30);

  const bodyText = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  const links = uniqueStrings(
    $("a[href]")
      .toArray()
      .map((element) => $(element).attr("href") ?? "")
      .filter(Boolean),
  );

  return {
    title,
    metaDescription,
    headings,
    visibleText: bodyText,
    linksDiscovered: links,
  };
}
