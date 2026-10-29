import type { AcfImage, Media, Photo, Piece, Work, WPPost } from "../types";
export function text(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#038;/g, "&")
    .replace(/&nbsp;/g, " ");
}
export function mediaPhoto(media?: Media): Photo | undefined {
  if (!media?.source_url) return;
  const sizes = Object.values(media.media_details?.sizes ?? {});
  return {
    url: media.source_url,
    alt: media.alt_text ?? "",
    width: media.media_details?.width,
    height: media.media_details?.height,
    preview:
      media.media_details?.sizes?.medium_large?.source_url ??
      media.media_details?.sizes?.medium?.source_url,
    srcSet: sizes.map((s) => `${s.source_url} ${s.width}w`).join(", "),
  };
}
function acfPhoto(p: AcfImage): Photo {
  const sizes = p.sizes ?? {};
  return {
    url: p.url,
    alt: p.alt ?? "",
    width: p.width,
    height: p.height,
    preview:
      typeof sizes.medium_large === "string" ? sizes.medium_large : undefined,
    srcSet: ["medium", "medium_large", "large"]
      .flatMap((k) =>
        typeof sizes[k] === "string" && typeof sizes[`${k}-width`] === "number"
          ? [`${sizes[k]} ${sizes[`${k}-width`]}w`]
          : [],
      )
      .join(", "),
  };
}
export function uniquePhotos(photos: (Photo | undefined)[]) {
  return photos
    .filter((p): p is Photo => !!p?.url)
    .filter((p, i, a) => a.findIndex((q) => q.url === p.url) === i);
}
function base(p: WPPost) {
  return {
    id: p.id,
    slug: p.slug,
    name: text(p.title.rendered),
    html: p.content?.rendered ?? "",
    cover: mediaPhoto(p._embedded?.["wp:featuredmedia"]?.[0]),
  };
}
export { isPublicPiece } from "./piece-policy.mjs";
export function normalizePiece(p: WPPost): Piece {
  const a = p.acf ?? {};
  const price =
    typeof a.preco === "number"
      ? a.preco
      : Number(
          String(a.preco ?? "")
            .trim()
            .replace(",", "."),
        );
  const b = base(p);
  return {
    ...b,
    categories: p["categorias-pecas"] ?? [],
    photos: uniquePhotos([
      b.cover,
      ...Object.values(a.galeria ?? {})
        .filter((i): i is AcfImage => !!i && typeof i.url === "string")
        .map(acfPhoto),
    ]),
    code: a.codigo_referencia ?? "",
    brand: a.marca_fabricante ?? "",
    compatibility: a.compatibilidade ?? "",
    condition: a.estado_peca ?? "",
    availability: a.disponibilidade ?? "sob_consulta",
    price:
      a.exibir_preco === true &&
      String(a.preco ?? "").trim() !== "" &&
      Number.isFinite(price) &&
      price >= 0
        ? price
        : undefined,
  };
}
export function normalizeWork(p: WPPost): Work {
  const b = base(p);
  return {
    ...b,
    date: p.date,
    categories: p["tipos-trabalho"] ?? [],
    galleryAvailable: Array.isArray(p.cm_galeria),
    photos: uniquePhotos([
      b.cover,
      ...(p.cm_galeria ?? []).map((i) => ({
        url: i.url,
        alt: i.alt,
        width: i.width,
        height: i.height,
        preview: i.preview_url,
        srcSet: i.srcset,
      })),
    ]),
  };
}
