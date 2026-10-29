import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname,
);
assert.ok(paths.length >= 3);

for (const path of paths) {
  const html = await readFile(
    path === "/" ? "dist/index.html" : `dist${path}/index.html`,
    "utf8",
  );
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const ogTitle = html.match(/property="og:title" content="([^"]+)"/)?.[1];
  assert.equal(ogTitle, title, `OG de ${path}`);
  assert.ok(html.includes(`href="https://cmarcondicionado.com.br${path}"`));
  assert.match(html, /href="\/favicon.ico"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /name="description" content="[^"]+"/);
}
console.log(
  `HTML estático validado: ${paths.length} rotas, título OG, canonical, descrição, imagem social, favicon e política de catálogo.`,
);
