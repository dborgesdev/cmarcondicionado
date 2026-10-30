# Auditoria de atualização do catálogo — 30/10/2026

## Resultado e causa raiz

A peça nova ID 41 estava publicada e presente na API, mas a política local
`piece-policy.mjs` excluía qualquer referência `TESTE-CM-*`, com exceção do ID 29.
A mesma regra foi confirmada no bundle público
`https://cmarcondicionado.com.br/assets/index-p5YashqG.js`.
A referência da peça 41 é `TESTE-CM-002`: era removida antes da renderização.

Além disso, `useResource` só consultava na montagem, mudança de chave ou retry.
Expirar o cache de cinco minutos não disparava uma nova consulta. Uma página
aberta podia manter os dados antigos indefinidamente.

Conforme a instrução final do proprietário, todas as exclusões por ID/código
foram removidas do frontend e do build. Todas as peças publicadas são exibidas.
A publicação no WordPress determina a inclusão; o código não determina estoque.

## Auditoria da API e da aplicação

API oficial consultada em 30/10/2026, entre aproximadamente 13h09 e 13h20 de São Paulo:
`https://painel.cmarcondicionado.com.br/wp-json/wp/v2/pecas?_embed=wp:featuredmedia&acf_format=standard`.

| ID | Peça | Publicação (date_gmt) | Status | Preço | Disponibilidade | Fotos |
| --- | --- | --- | --- | --- | --- | --- |
| 41 | Kit Placa Universal Split Hi-wall | 2026-10-30T16:01:39 | publish | R$ 100,00 | sob_consulta | 4 |
| 29 | Compressor Rotativo para Ar-Condicionado 12.000 BTUs | 2026-10-29T15:26:21 | publish | R$ 350,00 | disponivel | 3 |

Ambas aparecem no catálogo corrigido, com a 41 antes da 29.

- API: HTTP 200, `X-WP-Total: 2`, `X-WP-TotalPages: 1`, Cloudflare
  `cf-cache-status: DYNAMIC`; sem evidência de cache HTTP obsoleto na resposta.
- HTML público: `Cache-Control: public, must-revalidate, max-age=0`.
  O cache dos JS/CSS versionados não contém os dados do catálogo.
- Sem React Query/SWR, persistência local ou service worker de catálogo.
  Dados consultados em runtime; não há lista estática de peças na interface.
- O build gera metadados HTML e sitemap; não embute o catálogo no React.
  Novas peças funcionam na SPA sem rebuild. Sitemap/metadados estáticos são
  snapshots de build, uma limitação de SEO separada da atualização do catálogo.
- Home e catálogo compartilham `getPieces` e o cache `pieces`.
  Home mantém as quatro peças mais recentes, sem depender de `destaque_home`.
- Todas as páginas REST de até 100 peças são carregadas com `status=publish`,
  `orderby=date`, `order=desc`. Filtros de categoria, estado, disponibilidade,
  busca e ordenação por nome são locais sobre o catálogo completo; paginação
  visual de 12 itens preservada. Não existe limite total fixo de produtos.
- Não há descarte por ACF opcional, imagem ausente, indisponibilidade, estado,
  destaque, código ou ID. Preços condicionais, imagens e galerias preservados.
- Estados de catálogo vazio, filtros sem resultado e falha de API continuam
  distintos. Erros não são transformados em lista vazia nem persistidos no cache.

## Estratégia para reduzir consultas

- Cache compartilhado em memória por cinco minutos, com deduplicação inclusive
  de requisições pendentes que ultrapassem o TTL.
- Revalidação periódica a cada cinco minutos nas telas de peças; foco, retorno
  à aba e recuperação de conexão reutilizam o cache enquanto ele estiver válido.
  Abas ocultas não fazem polling. Timers/listeners são limpos ao desmontar.
- Como a lista já inclui descrição e galeria, os detalhes reutilizam o catálogo
  completo quando ele existe: abrir peças após a listagem não faz nova consulta.
  Um acesso direto ao detalhe, sem catálogo em memória, consulta apenas o slug.
- Busca, filtros, ordenação e paginação visual não consultam o WordPress.
- `_embed=wp:featuredmedia` e `acf_format=standard` preservados; nenhuma consulta
  adicional de mídia por ID. `cache: no-cache` revalida o HTTP somente quando o
  cache da aplicação precisa realmente de nova consulta; sem cache-busting aleatório.
- Com o catálogo atual são uma consulta de peças e uma de categorias por ciclo
  vencido, por aba ativa; apenas peças na Home. Catálogos maiores usam uma
  consulta por página REST de 100 registros. Não há polling em abas ocultas.
- Atualizações aparecem normalmente em cerca de cinco minutos; o alinhamento
  entre cache compartilhado e timer pode levar até dois ciclos (dez minutos),
  além da latência da API. Retorno à aba revalida imediatamente se o TTL venceu.

## Arquivos alterados

- `src/lib/api.ts`: publicação explícita, cache, deduplicação e reaproveitamento
  do catálogo nos detalhes.
- `src/hooks/useResource.ts`: revalidação opcional, visibilidade/foco/conexão e cleanup.
- `src/pages/Pieces.tsx`, `src/pages/Detail.tsx`,
  `src/components/sections/PartsPreview.tsx`: ativação da revalidação.
- `src/lib/normalize.ts`: remoção da exportação da política.
- `src/lib/piece-policy.mjs` e `src/lib/piece-policy.d.mts`: removidos.
- `scripts/seo.mjs`, `scripts/verify-api.mjs`: nenhuma exclusão por código/ID.
- `src/lib/api.test.ts`, `src/lib/business.test.ts`,
  `src/lib/api.live.test.ts`, `src/hooks/useResource.test.ts`: regressões e teste real.
- `eslint.config.mjs`: ignora `.vite`, cache compilado que causava falsos erros de lint.
- `AGENTS.md`, `INSTRUCOES-CODEX.md`, `docs/project.md`: regra de exclusão removida.
- Relatórios antigos em `docs/implementation.md`, `docs/validation.md`,
  `docs/v2-audit.md`, `docs/v2-validation.md`: indicação explícita de que as
  antigas observações de exclusão são históricas e foram substituídas.

## Validação

- `pnpm typecheck`, `pnpm lint`: passaram.
- `pnpm test`: 13 testes passaram; teste real desativado por padrão.
- `$env:CM_API_LIVE='1'; pnpm exec vitest run src/lib/api.live.test.ts`: passou.
  Verificou ambas as publicações 29 e 41, catálogo e detalhe, preços,
  disponibilidade e galerias. Confirmou zero consultas adicionais ao abrir os
  dois detalhes a partir do catálogo e uma nova consulta depois do TTL,
  com avanço do relógio de teste, sem rebuild.
- Testes controlados: 101 peças em duas páginas REST; códigos não excluem peças;
  nova peça sem ACF/foto aparece após TTL; detalhe antes ausente é atualizado;
  falha/retry, deduplicação, polling, foco, conexão, aba oculta e cleanup.
- Navegador local com API real: catálogo exibiu as duas peças, preços R$ 100,00
  e R$ 350,00, estados Nova/Usada e disponibilidades Sob consulta/Disponível.
  Detalhe da peça 41 com quatro imagens, marca/compatibilidade e WhatsApp contextual.
  Acesso direto ao detalhe da peça 29 confirmou três fotos, preço R$ 350,00,
  estado Usada, Disponível e WhatsApp contextual.
- `pnpm build`: passou, gerando seis páginas com metadados e sitemap,
  incluindo ambas as peças, sem qualquer exclusão.

Sem alteração de layout/CSS. Sem alteração remota no WordPress, commit, push,
PR, merge ou deploy. Branch local: `codex/fix-catalog-refresh`.
A produção só recebe esta correção após uma publicação autorizada; depois
novos cadastros não exigem builds adicionais para aparecer na interface.
