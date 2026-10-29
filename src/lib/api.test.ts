import { it, expect, vi } from "vitest";
import { getPieces, getWorks, getWork } from "./api";
import type { WPPost } from "../types";
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
  expect(items).toHaveLength(100);
  expect(items.some((p) => p.id === 9999)).toBe(false);
  expect(items.find((p) => p.condition === "recondicionada")?.slug).toBe(
    "ultima",
  );
  expect(fetchMock).toHaveBeenCalledTimes(2);
  for (const [url] of fetchMock.mock.calls) {
    expect(url.pathname).toMatch(/\/pecas$/);
    expect(url.searchParams.get("acf_format")).toBe("standard");
    expect(url.searchParams.get("_embed")).toBe("wp:featuredmedia");
  }
  await getPieces();
  expect(fetchMock).toHaveBeenCalledTimes(2);
  vi.unstubAllGlobals();
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
