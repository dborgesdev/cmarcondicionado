> Atualização de 30/10/2026: por instrução do proprietário, todas as exclusões de peças por código ou ID foram removidas. As observações sobre exclusão abaixo são históricas e não definem a regra atual. Consulte docs/catalog-refresh-audit.md.

# Estado atual: V2

A revisão visual e a autorização de exibição da peça ID 29 estão documentadas em [v2-audit.md](v2-audit.md). A validação atual está em [v2-validation.md](v2-validation.md). As observações históricas da V1 abaixo sobre item fictício/zero peças foram substituídas pela confirmação explícita do proprietário na V2.

# V1 — operação e decisões técnicas

## Rodar localmente

Requisitos: Node.js 22 e pnpm 10.

```sh
pnpm install
pnpm dev
```

Abrir a URL Local indicada pelo Vite (padrão http://127.0.0.1:5173). Para produção local:

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm preview
```

O build consulta a API pública para gerar metadados estáticos e sitemap. Uma indisponibilidade da API faz o build falhar explicitamente, evitando publicar um sitemap incompleto por acidente. A interface em execução possui estados de erro e nova tentativa.

## API e catálogo

- Camada tipada em `src/lib/api.ts`, normalizadores em `src/lib/normalize.ts`.
- Cache em memória por cinco minutos, compartilhando promessas em andamento; falhas saem do cache para permitir nova tentativa.
- Home pede seis trabalhos em ordem decrescente de data. O WordPress tinha um único trabalho no momento da validação. Não duplicamos registros para preencher seis posições.
- Listagens de trabalhos não pedem `cm_galeria`. Detalhe por slug pede o campo apenas ao abrir a página. `_links`, `featured_media` e `_embedded` são preservados.
- O trabalho 36 retornou fotos 38 e 39 em `cm_galeria`; a capa 37 completa as três fotos visíveis. A resposta confirma que o campo está disponível no servidor, sem afirmar que este agente instalou o PHP.
- Galerias clássicas e Gutenberg são atendidas pelo adaptador PHP já fornecido. O caso clássico foi validado na API real; o caso Gutenberg é coberto pelo contrato do adaptador, sem novo post de teste criado no WordPress.
- Peças usam `_embed=wp:featuredmedia` e `acf_format=standard`. Nenhuma imagem é resolvida com consulta por ID na aplicação.
- O catálogo busca todas as páginas da API (100 por página) antes de habilitar resultados. Busca textual, categoria, estado, disponibilidade e ordenação são aplicados à coleção completa. Só depois há paginação visual de 12 itens. Isso evita filtrar apenas uma página REST. Para catálogos muito grandes, migrar para endpoint com filtros ACF server-side.
- Todas as peças publicadas no WordPress aparecem em Home (seleção recente), catálogo, detalhe e sitemap, independentemente do código ou ID. A antiga política de exclusão foi removida em 30/10/2026; preço e disponibilidade seguem os dados do WP.
- Preço aparece apenas com `exibir_preco === true`, número finito e não negativo. HTML do WordPress é sanitizado com uma lista restrita de elementos textuais. Galerias vêm do contrato JSON, não do HTML renderizado.

## SEO e Vercel

`pnpm build` gera HTML por rota com title, description, canonical, Open Graph e Twitter, além de sitemap com os slugs públicos existentes no build. A Home, as duas listagens e o trabalho existente e a peça autorizada produziram cinco páginas na validação V2. Organization usa apenas nome, URL, logo e telefone confirmados. Não há Offer fictício, endereço, avaliações ou credenciais inventadas.

É uma SPA: o corpo interativo ainda é renderizado pelo React, com resumo alternativo em `noscript`. Metadados sociais dos slugs existentes são estáticos no HTML entregue; novas publicações no WordPress exigem novo build para atualizar HTML e sitemap. A interface consulta novos dados independentemente do build. Não é SSR nem pré-renderização integral do conteúdo. Previews sociais de novas URLs sem rebuild usam a página base. Uma futura estratégia SSR/SSG pode ampliar indexação.

`vercel.json` prepara `pnpm build`, saída `dist`, URLs limpas, cache dos bundles com hash e fallback de rotas da SPA. Os arquivos gerados por rota têm precedência sobre o rewrite conforme a [documentação da Vercel](https://vercel.com/docs/project-configuration/vercel-json). O comportamento hospedado ainda requer validação depois de um deploy autorizado. Domínio, projeto Vercel e publicação não foram configurados remotamente.

## Conteúdo e restrições

- Logo e favicon oficiais preservados. Imagens conceituais documentadas em `docs/assets.md`.
- Instagram omitido, pois a correspondência com a empresa não foi confirmada.
- Endereço, região atendida, horário, e-mail, CNPJ, números comerciais, depoimentos e garantias não foram inventados.
- O crédito obrigatório está em todas as rotas pelo layout global.
- Nenhuma alteração remota no WordPress e nenhuma instalação do PHP foram realizadas.
- Sem commit, push, PR, merge ou deploy. Branch de implementação: `codex/implementacao-v1`.
