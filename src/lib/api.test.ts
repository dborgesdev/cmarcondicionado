import { it, expect, vi, afterEach } from "vitest";
import {
  getPieces,
  getPiece,
  getWorks,
  getWork,
  cached,
  PIECES_REFRESH_MS,
} from "./api";
import type { WPPost } from "../types";
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
it("carrega todas as páginas de peças antes de filtrar, sem consultas de mídia por ID", async () => {
  const first: WPPost[] = Array.from({ length: 100 }, (_, i) => ({
    id: 1000 + i,
    slug: `peca-${i}`,
    title: { rendered: `Peça ${i}` },
    acf: { estado_peca: "nova" },
  }));
  first[0] = {
    id: 9999,
    slug: "teste",
    title: { rendered: "Teste" },
    acf: { codigo_referencia: "TESTE-CM-001" },
  };
  const last = {
    id: 2000,
    slug: "ultima",
    title: { rendered: "Última peça" },
    acf: { estado_peca: "recondicionada" },
  };
  const fetchMock = vi.fn(async (input: URL) => {
    const page = input.searchParams.get("page");
    return new Response(JSON.stringify(page === "1" ? first : [last]), {
      headers: { "X-WP-TotalPages": "2" },
    });
  });
  vi.stubGlobal("fetch", fetchMock);
  const items = await getPieces();
  expect(items).toHaveLength(101);
  expect(items.some((p) => p.id === 9999)).toBe(true);
  expect(items.find((p) => p.condition === "recondicionada")?.slug).toBe(
    "ultima",
  );
  expect(fetchMock).toHaveBeenCalledTimes(2);
  for (const [url] of fetchMock.mock.calls) {
    expect(url.pathname).toMatch(/\/pecas$/);
    expect(url.searchParams.get("acf_format")).toBe("standard");
    expect(url.searchParams.get("_embed")).toBe("wp:featuredmedia");
    expect(url.searchParams.get("status")).toBe("publish");
    expect(url.searchParams.get("orderby")).toBe("date");
    expect(url.searchParams.get("order")).toBe("desc");
  }
  await getPieces();
  expect(fetchMock).toHaveBeenCalledTimes(2);
  vi.unstubAllGlobals();
});
it("revalida catálogo e detalhe após TTL sem rebuild, aceitando nova peça sem ACF ou foto", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(Date.now() + 600_000);
  const old = {
    id: 501,
    slug: "antiga",
    title: { rendered: "Antiga" },
    acf: { preco: "75", exibir_preco: true, disponibilidade: "disponivel" },
  };
  const recent = { id: 502, slug: "recente", title: { rendered: "Recente" } };
  let rows: WPPost[] = [old];
  const fetchMock = vi.fn(async (url: URL, options: RequestInit) => {
    expect(options.cache).toBe("no-cache");
    return new Response(
      JSON.stringify(
        url.searchParams.has("slug")
          ? rows.filter((p) => p.slug === url.searchParams.get("slug"))
          : rows,
      ),
      { headers: { "X-WP-TotalPages": "1" } },
    );
  });
  vi.stubGlobal("fetch", fetchMock);
  expect((await getPieces()).map((p) => p.id)).toEqual([501]);
  expect(await getPiece("recente")).toBeNull();
  rows = [recent, old];
  expect((await getPieces()).map((p) => p.id)).toEqual([501]);
  await vi.advanceTimersByTimeAsync(PIECES_REFRESH_MS);
  const items = await getPieces();
  expect(items.map((p) => p.id)).toEqual([502, 501]);
  expect(items[0]).toMatchObject({ photos: [], availability: "sob_consulta" });
  expect(items[1]).toMatchObject({ price: 75, availability: "disponivel" });
  expect((await getPiece("recente"))?.id).toBe(502);
  await getPieces();
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
it("deduplica requisições pendentes mesmo após TTL e permite tentar novamente após falha", async () => {
  vi.useFakeTimers();
  let resolve!: (n: number) => void;
  const load = vi.fn(
    () =>
      new Promise<number>((r) => {
        resolve = r;
      }),
  );
  const first = cached("pending-test", load, 10);
  await vi.advanceTimersByTimeAsync(20);
  expect(cached("pending-test", load, 10)).toBe(first);
  resolve(1);
  expect(await first).toBe(1);
  const fail = vi
    .fn()
    .mockRejectedValueOnce(new Error("API indisponível"))
    .mockResolvedValueOnce([]);
  await expect(cached("failure-test", fail)).rejects.toThrow(
    "API indisponível",
  );
  await expect(cached("failure-test", fail)).resolves.toEqual([]);
  expect(fail).toHaveBeenCalledTimes(2);
});
it("mantém capas na listagem e pede galeria apenas no detalhe", async () => {
  const urls: URL[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: URL) => {
      urls.push(url);
      return new Response(
        JSON.stringify([
          {
            id: 36,
            slug: "instalacao",
            title: { rendered: "Instalação" },
            cm_galeria: [],
          },
        ]),
        { headers: { "X-WP-TotalPages": "1" } },
      );
    }),
  );
  await getWorks(1, "999");
  await getWork("instalacao");
  expect(urls[0].searchParams.get("per_page")).toBe("6");
  expect(urls[0].searchParams.get("order")).toBe("desc");
  expect(urls[0].searchParams.get("_fields")).toContain("_links");
  expect(urls[0].searchParams.get("_fields")).not.toContain("cm_galeria");
  expect(urls[1].searchParams.get("_fields")).toContain("cm_galeria");
  vi.unstubAllGlobals();
});
