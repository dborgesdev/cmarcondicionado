import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { WPPost } from "../types";

beforeEach(() => vi.resetModules());
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
const post = (id: number): WPPost => ({
  id,
  slug: `trabalho-${id}`,
  date: `2026-10-${String(id).padStart(2, "0")}T12:00:00`,
  title: { rendered: `Trabalho ${id}` },
});

it("Home compartilha a primeira página; página seguinte e categoria mantêm paginação real", async () => {
  const { getWorks } = await import("./api");
  const fetchMock = vi.fn(
    async (url: URL) =>
      new Response(
        JSON.stringify(
          url.searchParams.get("page") === "2"
            ? [post(1)]
            : [7, 6, 5, 4, 3, 2].map(post),
        ),
        { headers: { "X-WP-TotalPages": "2" } },
      ),
  );
  vi.stubGlobal("fetch", fetchMock);
  const home = await getWorks();
  expect(home.items.map((w) => w.id)).toEqual([7, 6, 5, 4, 3, 2]);
  expect(home.hasNext).toBe(true);
  expect(await getWorks(1, "")).toBe(home);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const second = await getWorks(2);
  expect(second.items.map((w) => w.id)).toEqual([1]);
  expect(second.hasNext).toBe(false);
  await getWorks(1, "3");
  expect(fetchMock.mock.calls[2][0].searchParams.get("tipos-trabalho")).toBe(
    "3",
  );
  for (const [url] of fetchMock.mock.calls) {
    expect(url.searchParams.get("status")).toBe("publish");
    expect(url.searchParams.get("orderby")).toBe("date");
    expect(url.searchParams.get("order")).toBe("desc");
    expect(url.searchParams.get("per_page")).toBe("6");
    expect(url.searchParams.get("_fields")).not.toContain("cm_galeria");
    for (const field of ["featured_media", "_links", "_embedded"])
      expect(url.searchParams.get("_fields")).toContain(field);
  }
});

it("nova publicação aparece após TTL sem rebuild e com nova chave para o cache do WordPress", async () => {
  vi.useFakeTimers();
  const { getWorks, getWork, WORKS_REFRESH_MS } = await import("./api");
  let published = [post(1)];
  const urls: URL[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: URL) => {
      urls.push(url);
      const slug = url.searchParams.get("slug");
      return new Response(
        JSON.stringify(
          slug ? published.filter((p) => p.slug === slug) : published,
        ),
        { headers: { "X-WP-TotalPages": "1" } },
      );
    }),
  );
  expect((await getWorks()).items.map((w) => w.id)).toEqual([1]);
  expect(await getWork("trabalho-2")).toBeNull();
  published = [post(2), post(1)];
  expect((await getWorks()).items.map((w) => w.id)).toEqual([1]);
  await vi.advanceTimersByTimeAsync(WORKS_REFRESH_MS);
  const updated = await getWorks();
  expect(updated.items.map((w) => w.id)).toEqual([2, 1]);
  expect(updated.items[0]).toMatchObject({
    categories: [],
    photos: [],
    galleryAvailable: false,
  });
  expect((await getWork("trabalho-2"))?.id).toBe(2);
  expect(urls).toHaveLength(4);
  expect(urls[0].searchParams.get("_cm_refresh")).not.toBe(
    urls[2].searchParams.get("_cm_refresh"),
  );
});

it("galeria só é consultada no detalhe; capa principal e fotos adicionais são preservadas", async () => {
  const { getWorks, getWork } = await import("./api");
  const work = {
    ...post(1),
    _embedded: {
      "wp:featuredmedia": [{ source_url: "https://example.com/capa.jpg" }],
    },
  };
  const fetchMock = vi.fn(
    async (url: URL) =>
      new Response(
        JSON.stringify([
          url.searchParams.has("slug")
            ? {
                ...work,
                cm_galeria: [
                  {
                    url: "https://example.com/extra.jpg",
                    alt: "Galeria",
                    width: 800,
                    height: 600,
                  },
                ],
              }
            : work,
        ]),
      ),
  );
  vi.stubGlobal("fetch", fetchMock);
  const listing = await getWorks();
  expect(listing.items[0].cover?.url).toBe("https://example.com/capa.jpg");
  expect(listing.items[0].photos).toHaveLength(1);
  const detail = await getWork(work.slug);
  expect(detail?.photos.map((p) => p.url)).toEqual([
    "https://example.com/capa.jpg",
    "https://example.com/extra.jpg",
  ]);
  await getWork(work.slug);
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(
    fetchMock.mock.calls.every(([url]) => url.pathname.endsWith("/trabalhos")),
  ).toBe(true);
});

it("erro da API é rejeitado, não vira vazio e permite retry; resposta vazia continua válida", async () => {
  const { getWorks } = await import("./api");
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(new Response("Falha", { status: 503 }))
    .mockResolvedValueOnce(
      new Response("[]", { headers: { "X-WP-TotalPages": "0" } }),
    );
  vi.stubGlobal("fetch", fetchMock);
  await expect(getWorks()).rejects.toThrow("503");
  expect(await getWorks()).toEqual({ items: [], hasNext: false });
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
