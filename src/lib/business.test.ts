import { describe, it, expect, vi, afterEach } from "vitest";
import { isPublicPiece, normalizePiece, normalizeWork } from "./normalize";
import { pieceMessage, whatsapp, workMessage } from "./whatsapp";
import type { WPPost } from "../types";
const post = (override: Partial<WPPost> = {}): WPPost => ({
  id: 101,
  slug: "peca-publica",
  title: { rendered: "Peça &amp; componente" },
  ...override,
});
afterEach(() => vi.unstubAllGlobals());
describe("regras do catálogo público", () => {
  it("publica o ID 29 confirmado pelo proprietário e exclui os demais códigos de teste", () => {
    expect(
      isPublicPiece(
        post({ id: 29, acf: { codigo_referencia: "TESTE-CM-001" } }),
      ),
    ).toBe(true);
    expect(
      isPublicPiece(post({ acf: { codigo_referencia: "TESTE-CM-002" } })),
    ).toBe(false);
    expect(isPublicPiece(post())).toBe(true);
  });
  it("só revela preços válidos quando explicitamente autorizado", () => {
    for (const preco of ["", undefined, "inválido", -1])
      expect(
        normalizePiece(post({ acf: { exibir_preco: true, preco } })).price,
      ).toBeUndefined();
    expect(
      normalizePiece(post({ acf: { exibir_preco: false, preco: 350 } })).price,
    ).toBeUndefined();
    expect(
      normalizePiece(post({ acf: { exibir_preco: true, preco: "350,50" } }))
        .price,
    ).toBe(350.5);
  });
  it("usa imagens ACF já resolvidas e remove duplicação da capa", () => {
    const item = normalizePiece(
      post({
        _embedded: {
          "wp:featuredmedia": [{ source_url: "https://example.com/capa.jpg" }],
        },
        acf: {
          galeria: {
            "1": { url: "https://example.com/capa.jpg" },
            "2": false,
            "3": { url: "https://example.com/extra.jpg" },
          },
        },
      }),
    );
    expect(item.photos.map((p) => p.url)).toEqual([
      "https://example.com/capa.jpg",
      "https://example.com/extra.jpg",
    ]);
  });
  it("aceita a galeria do adaptador para shortcodes clássicos e Gutenberg", () => {
    const work = normalizeWork(
      post({
        cm_galeria: [
          {
            url: "https://example.com/classic.jpg",
            alt: "Foto real",
            width: 800,
            height: 600,
            srcset: "https://example.com/classic.jpg 800w",
          },
        ],
      }),
    );
    expect(work.galleryAvailable).toBe(true);
    expect(work.photos[0].srcSet).toContain("800w");
    expect(normalizeWork(post()).galleryAvailable).toBe(false);
  });
});
describe("WhatsApp contextualizado", () => {
  it("codifica mensagem e usa o único destino confirmado", () => {
    const message = 'Peça "A&B" + condições?';
    const url = new URL(whatsapp(message));
    expect(url.pathname).toBe("/5562993528692");
    expect(url.searchParams.get("text")).toBe(message);
  });
  it("consulta alternativa quando a peça está indisponível e inclui código e URL", () => {
    const message = pieceMessage({
      name: "Motor",
      code: "M10",
      slug: "motor",
      availability: "indisponivel",
    });
    expect(message).toContain("consultar uma alternativa");
    expect(message).toContain("M10");
    expect(message).toContain("https://cmarcondicionado.com.br/pecas/motor");
  });
  it("contextualiza o serviço pelo trabalho visualizado", () => {
    expect(workMessage({ name: "Instalação", slug: "instalacao" })).toContain(
      "https://cmarcondicionado.com.br/trabalhos/instalacao",
    );
  });
});
