import { expect, it, vi } from "vitest";
import { getWorks, getWork, WORKS_REFRESH_MS } from "./api";
import type { WPPost } from "../types";

it.skipIf(process.env.CM_WORKS_API_LIVE !== "1")(
  "confere duas publicações reais, capas, galerias e reconsulta sem rebuild",
  async () => {
    const realFetch = globalThis.fetch;
    const response = await realFetch(
      `https://painel.cmarcondicionado.com.br/wp-json/wp/v2/trabalhos?status=publish&per_page=100&orderby=date&order=desc&_embed=wp:featuredmedia&_cm_refresh=${Math.floor(Date.now() / WORKS_REFRESH_MS)}`,
    );
    expect(response.ok).toBe(true);
    const published: WPPost[] = await response.json();
    expect(published.map((p) => p.id)).toEqual(
      expect.arrayContaining([46, 36]),
    );
    const spy = vi.spyOn(globalThis, "fetch");
    try {
      const home = await getWorks();
      expect(home.items.map((w) => w.id)).toEqual(
        published.slice(0, 6).map((p) => p.id),
      );
      expect(await getWorks(1, "")).toBe(home);
      expect(spy).toHaveBeenCalledTimes(1);
      for (const id of [46, 36]) {
        const raw = published.find((p) => p.id === id)!;
        const card = home.items.find((w) => w.id === id)!;
        expect(card.cover?.url).toBe(
          raw._embedded?.["wp:featuredmedia"]?.[0].source_url,
        );
        expect(card.categories).toEqual([]);
        expect(card.galleryAvailable).toBe(false);
        const detail = await getWork(raw.slug);
        expect(detail?.cover).toEqual(card.cover);
        expect(detail?.galleryAvailable).toBe(true);
        expect(detail?.photos.map((p) => p.url)).toEqual([
          card.cover!.url,
          ...raw.cm_galeria!.map((p) => p.url),
        ]);
        expect(detail?.photos).toHaveLength(id === 46 ? 6 : 3);
        await getWork(raw.slug);
      }
      expect(spy).toHaveBeenCalledTimes(3);
      const now = Date.now();
      vi.spyOn(Date, "now").mockReturnValue(now + WORKS_REFRESH_MS + 1);
      expect((await getWorks()).items.map((w) => w.id)).toEqual(
        home.items.map((w) => w.id),
      );
      expect(spy).toHaveBeenCalledTimes(4);
      console.log(
        JSON.stringify({
          published: published.map((p) => ({ id: p.id, date: p.date })),
          home: home.items.map((w) => w.id),
          galleries: { 46: 6, 36: 3 },
          requests: spy.mock.calls.length,
          revalidatedWithoutBuild: true,
        }),
      );
    } finally {
      vi.restoreAllMocks();
    }
  },
  60_000,
);
