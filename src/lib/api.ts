import type { Term, WPPost } from "../types";
import { normalizePiece, normalizeWork } from "./normalize";
const API = "https://painel.cmarcondicionado.com.br/wp-json/wp/v2/";
export const PIECES_REFRESH_MS = 300_000;
const cache = new Map<
  string,
  { expires: number; pending: boolean; promise: Promise<unknown> }
>();
export function cached<T>(
  key: string,
  load: () => Promise<T>,
  ttl = 300_000,
): Promise<T> {
  const hit = cache.get(key);
  if (hit && (hit.pending || hit.expires > Date.now()))
    return hit.promise as Promise<T>;
  const entry = {
    expires: Date.now() + ttl,
    pending: true,
    promise: Promise.resolve() as Promise<unknown>,
  };
  const promise = load()
    .then((data) => {
      entry.pending = false;
      return data;
    })
    .catch((e) => {
      cache.delete(key);
      throw e;
    });
  entry.promise = promise;
  cache.set(key, entry);
  return promise;
}
async function request<T>(
  route: string,
  params: Record<string, string | number> = {},
) {
  const url = new URL(API + route);
  Object.entries(params).forEach(([k, v]) =>
    url.searchParams.set(k, String(v)),
  );
  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    // The application owns the TTL; expired entries must revalidate HTTP caches.
    cache: "no-cache",
  });
  if (!response.ok)
    throw new Error(`Não foi possível carregar os dados (${response.status}).`);
  return {
    data: (await response.json()) as T,
    totalPages: Number(response.headers.get("X-WP-TotalPages")) || undefined,
  };
}
const embed = { _embed: "wp:featuredmedia" };
const workFields =
  "id,slug,date,title,featured_media,tipos-trabalho,_links,_embedded";
export function getWorks(page = 1, type = "") {
  return cached(`works:${page}:${type}`, async () => {
    const r = await request<WPPost[]>("trabalhos", {
      ...embed,
      _fields: workFields,
      per_page: 6,
      page,
      orderby: "date",
      order: "desc",
      ...(type ? { "tipos-trabalho": type } : {}),
    });
    return {
      items: r.data.map(normalizeWork),
      hasNext: r.totalPages ? page < r.totalPages : r.data.length === 6,
    };
  });
}
export function getWork(slug: string) {
  return cached(`work:${slug}`, async () => {
    const r = await request<WPPost[]>("trabalhos", {
      ...embed,
      slug,
      _fields: `${workFields},content,cm_galeria`,
    });
    return r.data[0] ? normalizeWork(r.data[0]) : null;
  });
}
// Fetch every server page before applying global ACF filters; never filter a partial catalogue.
export function getPieces() {
  return cached(
    "pieces",
    async () => {
      const all: WPPost[] = [];
      let page = 1;
      for (;;) {
        const r = await request<WPPost[]>("pecas", {
          ...embed,
          acf_format: "standard",
          status: "publish",
          per_page: 100,
          page,
          orderby: "date",
          order: "desc",
        });
        all.push(...r.data);
        if (r.totalPages ? page >= r.totalPages : r.data.length < 100) break;
        page++;
      }
      return all.map(normalizePiece);
    },
    PIECES_REFRESH_MS,
  );
}
export function getPiece(slug: string) {
  // The full catalogue already includes content and galleries. Reuse it for
  // details (including after expiration), rather than repeating a slug request.
  if (cache.has("pieces")) {
    return getPieces().then(
      (items) => items.find((item) => item.slug === slug) ?? null,
    );
  }
  return cached(
    `piece:${slug}`,
    async () => {
      const r = await request<WPPost[]>("pecas", {
        ...embed,
        acf_format: "standard",
        status: "publish",
        slug,
      });
      return r.data[0] ? normalizePiece(r.data[0]) : null;
    },
    PIECES_REFRESH_MS,
  );
}
export function getTerms(kind: "pieces" | "works") {
  return cached(`terms:${kind}`, async () => {
    const all: Term[] = [];
    let page = 1;
    for (;;) {
      const r = await request<Term[]>(
        kind === "pieces" ? "categorias-pecas" : "tipos-trabalho",
        { per_page: 100, page },
      );
      all.push(...r.data);
      if (r.totalPages ? page >= r.totalPages : r.data.length < 100) break;
      page++;
    }
    return all;
  });
}
