import { isPublicPiece } from "../src/lib/piece-policy.mjs";
import assert from "node:assert/strict";
const base = "https://painel.cmarcondicionado.com.br/wp-json/wp/v2/";
async function get(path) {
  const r = await fetch(base + path, {
    headers: { Origin: "http://localhost:5174" },
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(r.status, 200, path);
  return { r, data: await r.json() };
}
const listing = await get(
  "trabalhos?per_page=6&orderby=date&order=desc&_embed=wp:featuredmedia&_fields=id,slug,date,title,featured_media,tipos-trabalho,_links,_embedded",
);
assert.ok(listing.data.length <= 6);
assert.ok(listing.data[0]?._embedded?.["wp:featuredmedia"]?.[0]?.source_url);
assert.ok(!("cm_galeria" in listing.data[0]));
const detail = await get("trabalhos/36?_fields=id,title,cm_galeria");
assert.ok(detail.data.cm_galeria.some((p) => p.id === 38));
assert.ok(detail.data.cm_galeria.some((p) => p.id === 39));
const pieces = await get("pecas?_embed=wp:featuredmedia&acf_format=standard");
const filtered = await get(
  "pecas?categorias-pecas=2&_embed=wp:featuredmedia&acf_format=standard",
);
assert.ok(filtered.data.every((p) => p["categorias-pecas"].includes(2)));
console.log(
  JSON.stringify(
    {
      works: listing.data.length,
      embeddedCover: true,
      onDemandGallery: detail.data.cm_galeria.map((p) => p.id),
      publicPieces: pieces.data.filter(isPublicPiece).length,
      taxonomyFilter: true,
      cors: listing.r.headers.get("access-control-allow-origin"),
      paginationHeaders: listing.r.headers.get("access-control-expose-headers"),
    },
    null,
    2,
  ),
);
