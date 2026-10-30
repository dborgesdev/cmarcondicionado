import { expect, it, vi } from "vitest";
import { getPiece, getPieces, PIECES_REFRESH_MS } from "./api";

// Explicit opt-in: ordinary regression tests never depend on WordPress uptime.
it.skipIf(process.env.CM_API_LIVE !== "1")(
  "compara catálogo e detalhe com as duas publicações reais e reconsulta sem rebuild",
  async () => {
    const realFetch = globalThis.fetch;
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const response = await realFetch(
      "https://painel.cmarcondicionado.com.br/wp-json/wp/v2/pecas?_embed=wp:featuredmedia&acf_format=standard&status=publish&per_page=100&orderby=date&order=desc",
      { cache: "no-cache" },
    );
    expect(response.ok).toBe(true);
    const posts = await response.json();
    expect(posts.find((p: { id: number }) => p.id === 29)?.status).toBe(
      "publish",
    );
    const recent = posts.find((p: { id: number }) => p.id === 41);
    expect(recent.status).toBe("publish");
    try {
      const items = await getPieces();
      expect(items.some((p) => p.id === 29)).toBe(true);
      const item = items.find((p) => p.id === 41)!;
      expect(item.name).toBe(recent.title.rendered);
      expect(item.price).toBe(Number(recent.acf.preco));
      expect(item.availability).toBe(recent.acf.disponibilidade);
      expect(item.cover?.url).toBe(
        recent._embedded["wp:featuredmedia"][0].source_url,
      );
      expect(item.photos).toHaveLength(4);
      const count = fetchSpy.mock.calls.length;
      expect(await getPiece(item.slug)).toEqual(item);
      const compressor = items.find((p) => p.id === 29)!;
      expect(compressor).toMatchObject({
        code: "TESTE-CM-001",
        price: 350,
        availability: "disponivel",
        condition: "usada",
      });
      expect(compressor.photos).toHaveLength(3);
      expect(await getPiece(compressor.slug)).toEqual(compressor);
      expect(fetchSpy).toHaveBeenCalledTimes(count);
      await getPieces();
      expect(fetchSpy).toHaveBeenCalledTimes(count);
      const now = Date.now();
      vi.spyOn(Date, "now").mockReturnValue(now + PIECES_REFRESH_MS + 1);
      expect(await getPieces()).toEqual(items);
      expect(fetchSpy).toHaveBeenCalledTimes(count + 1);
      console.log(
        JSON.stringify({
          published: posts.map(
            (p: { id: number; status: string; date: string }) => ({
              id: p.id,
              status: p.status,
              date: p.date,
            }),
          ),
          visible: items.map((p) => p.id),
          price: item.price,
          photos: item.photos.length,
          revalidatedWithoutBuild: true,
        }),
      );
    } finally {
      vi.restoreAllMocks();
    }
  },
  60_000,
);
