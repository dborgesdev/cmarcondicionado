import { isPublicPiece } from "../src/lib/piece-policy.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const site = "https://cmarcondicionado.com.br";
const api = "https://painel.cmarcondicionado.com.br/wp-json/wp/v2/";
const escape = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
async function all(kind) {
  const items = [];
  for (let page = 1; ; page++) {
    const url = new URL(api + kind);
    url.search = new URLSearchParams({
      per_page: "100",
      page: String(page),
      _embed: "wp:featuredmedia",
      ...(kind === "pecas" ? { acf_format: "standard" } : {}),
    }).toString();
    const r = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!r.ok) throw new Error(`SEO API ${r.status}`);
    const rows = await r.json();
    items.push(...rows);
    const pages = Number(r.headers.get("X-WP-TotalPages"));
    if (pages ? page >= pages : rows.length < 100) break;
  }
  return items;
}
const html = await readFile("dist/index.html", "utf8");
const routes = [
  {
    path: "/",
    title: "Soluções em climatização",
    description:
      "Instalação, manutenção e conserto de ar-condicionado. Conheça os serviços da CM Ar-Condicionado.",
  },
  {
    path: "/pecas",
    title: "Peças e componentes",
    description:
      "Consulte peças, compatibilidade e disponibilidade com a CM Ar-Condicionado.",
  },
  {
    path: "/trabalhos",
    title: "Trabalhos realizados",
    description: "Conheça os registros dos trabalhos da CM Ar-Condicionado.",
  },
];
try {
  const [pieces, works] = await Promise.all([all("pecas"), all("trabalhos")]);
  for (const [kind, rows] of [
    ["pecas", pieces.filter(isPublicPiece)],
    ["trabalhos", works],
  ])
    for (const p of rows) {
      routes.push({
        path: `/${kind}/${p.slug}`,
        title: p.title.rendered.replace(/<[^>]*>/g, ""),
        description:
          kind === "pecas"
            ? "Consulte informações, compatibilidade e disponibilidade desta peça com a CM Ar-Condicionado."
            : "Conheça as fotografias deste trabalho e converse sobre um serviço semelhante.",
        image: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
      });
    }
} catch (e) {
  console.error(
    "Falha ao gerar SEO dinâmico. Execute o build novamente com a API disponível.",
    e,
  );
  process.exit(1);
}
for (const route of routes) {
  let out = html
    .replace(
      /<title>.*?<\/title>/,
      `<title>${escape(route.title)} | CM Ar-Condicionado</title>`,
    )
    .replace(
      /<meta\s+name="description"[^>]*>/,
      `<meta name="description" content="${escape(route.description)}"/>`,
    )
    .replace(
      /<link rel="canonical"[^>]*>/,
      `<link rel="canonical" href="${site}${escape(route.path)}"/>`,
    )
    .replace(
      /<meta\s+property="og:title"[^>]*>/,
      `<meta property="og:title" content="${escape(route.title)} | CM Ar-Condicionado"/>`,
    )
    .replace(
      /<meta\s+property="og:description"[^>]*>/,
      `<meta property="og:description" content="${escape(route.description)}"/>`,
    )
    .replace(
      /<meta property="og:url"[^>]*>/,
      `<meta property="og:url" content="${site}${escape(route.path)}"/>`,
    )
    .replace(
      "</head>",
      `<meta property="og:image" content="${escape(route.image || site + "/og-cm.jpg")}"/><meta name="twitter:title" content="${escape(route.title)} | CM Ar-Condicionado"/><meta name="twitter:description" content="${escape(route.description)}"/><meta name="twitter:image" content="${escape(route.image || site + "/og-cm.jpg")}"/></head>`,
    );
  if (
    !out.includes(
      `property="og:title" content="${escape(route.title)} | CM Ar-Condicionado"`,
    )
  )
    throw new Error(`Metadados estáticos ausentes: ${route.path}`);
  out = out.replace(
    '<div id="root"></div>',
    `<div id="root"></div><noscript><h1>${escape(route.title)}</h1><p>${escape(route.description)}</p><a href="https://wa.me/5562993528692">Consultar CM Ar-Condicionado</a></noscript>`,
  );
  const directory = route.path === "/" ? "dist" : `dist${route.path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, out);
}
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((r) => `<url><loc>${site}${escape(r.path)}</loc></url>`).join("")}</urlset>`,
);
console.log(
  `SEO: ${routes.length} páginas com metadados estáticos e sitemap gerados.`,
);
