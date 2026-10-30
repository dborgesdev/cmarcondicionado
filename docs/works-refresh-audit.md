# Atualização automática de trabalhos — 30/10/2026

## Causa raiz e evidências

Foram confirmados dois problemas distintos:

1. A requisição exata do frontend recebia resposta antiga do cache REST do
   WordPress, mesmo com `Cache-Control: no-cache`. Em 30/10/2026 às 13h31 de
   São Paulo, a URL abaixo retornou somente ID 36, `X-WP-Total: 1` e
   `x-wp-cached-call: served-cache`:

   ```text
   https://painel.cmarcondicionado.com.br/wp-json/wp/v2/trabalhos?_embed=wp%3Afeaturedmedia&_fields=id%2Cslug%2Cdate%2Ctitle%2Cfeatured_media%2Ctipos-trabalho%2C_links%2C_embedded&per_page=6&page=1&orderby=date&order=desc
   ```

   A consulta oficial de referência e a consulta completa retornaram IDs 46 e
   36. A navegação nova no site público também mostrou apenas o trabalho 36.
   Cloudflare retornava `cf-cache-status: DYNAMIC`: o cabeçalho de cache REST,
   não o de CDN, identificou a resposta armazenada na origem. Acrescentar
   `status=publish` retornou os dois itens; uma janela renovável de consulta
   também retornou os dois. Mudar somente a URL uma única vez não garante que
   a próxima publicação será recebida, por isso a correção inclui renovação.
2. Home, listagem e detalhe não ativavam a revalidação periódica do hook
   existente. O cache em memória expirava após cinco minutos, mas expiração
   por si só não disparava nova consulta numa página já aberta.

Não foi identificada exclusão por imagem, categoria ou galeria ausente. Não
há dados estáticos de trabalhos, React Query/SWR ou persistência local dessa
lista. O build gera metadados e sitemap; a interface consulta a API em runtime.
Metadados/sitemap estáticos continuam sendo snapshots de build, sem impedir
novos trabalhos de aparecer na SPA ou funcionar em rotas individuais.

## Publicações reais verificadas

| ID | Trabalho | `date_gmt` / data REST | Categoria | Capa | Fotos no detalhe |
| --- | --- | --- | --- | --- | --- |
| 46 | Manutenção Ar Condicionados Empresa XYZ | 2026-10-30T16:28:46 | Ausente | Mídia 47 | 6 (capa + 5 adicionais) |
| 36 | Instalação Ar Condicionado | 2026-10-29T16:13:56 | Ausente | Mídia 37 | 3 (capa + 2 adicionais) |

Ambos estavam com `status=publish`. O ID 46 era uma publicação recente,
realizada aproximadamente dois minutos antes da auditoria inicial. A capa 47
é `WhatsApp-Image-2026-10-30-at-11.20.49.jpeg`; a capa 37 é
`instalacao-ac-1.png`. As fotos adicionais retornaram IDs 48–52 e 38–39,
respectivamente. Nenhum cadastro foi criado ou alterado para os testes.

## Correção e intervalo

- `status=publish` explícito na listagem e no detalhe.
- Revalidação de Home, `/trabalhos`, categorias e páginas individuais a cada
  cinco minutos, com o hook existente. Retorno à aba, foco ou conexão também
  verificam os dados, respeitando o cache. Abas ocultas não fazem polling.
- Cache em memória de cinco minutos, por página/tipo ou slug, compartilhando
  promessas pendentes. Home e primeira página sem filtro usam a mesma chave.
  Não há consulta duplicada por montar essas telas dentro do TTL.
- Nas rotas REST `trabalhos` e `tipos-trabalho`, `_cm_refresh` identifica uma
  janela fixa de cinco minutos (`floor(Date.now() / 300000)`). Todos os
  visitantes com relógios alinhados usam a mesma URL durante a janela;
  não se gera um parâmetro aleatório ou timestamp diferente por requisição.
  Isso limita a reutilização da resposta antiga na origem sem desativar
  globalmente o cache ou instalar/configurar plugins remotamente.
- Atualização esperada em cerca de cinco minutos; dependendo do alinhamento
  entre a entrada compartilhada do cache e a montagem do timer, pode levar
  até dois ciclos (dez minutos), mais a latência da API, em aba visível.
  Esse intervalo depende também do relógio do dispositivo estar correto.
- Cada ciclo vencido consulta apenas a página/tipo atual e as categorias.
  O detalhe consulta apenas o slug aberto; galeria não é carregada na Home
  ou listagem, nem em hover. Reabertura do mesmo detalhe usa o cache vigente.
- Sem endpoint novo, plugin PHP novo, alteração no adaptador ou requisições
  individuais de mídia. A correção contorna a resposta antiga observada;
  não altera a configuração/invalidação do cache instalado no WordPress.

## Contratos e funcionalidades preservados

- Home: seis publicações mais recentes, `orderby=date&order=desc`, sem destaque.
- `/trabalhos`: seis itens por página REST, navegação por todas as páginas e
  filtro `tipos-trabalho` mantidos. O total de trabalhos não é limitado a seis.
- `_fields` mantém `featured_media`, `_links` e `_embedded` junto de `_embed`.
  `normalizeWork` mantém a capa incorporada como primeira foto, seguida de
  `cm_galeria`, com deduplicação. Nenhum campo opcional determina inclusão.
- Falha na consulta principal continua passando por `ErrorState`, antes do
  estado vazio; erros não são convertidos em array vazio nem ficam no cache.
- O endpoint real expôs `cm_galeria` corretamente nos dois detalhes, mas não
  nas listagens com `_fields`. A galeria clássica do WP funcionou nos dois.
- O adaptador local existente trata `core/gallery`, `core/image` e shortcodes
  `[gallery ids]` / `[gallery include]`. Isso foi inspecionado sem modificações.
  Não se afirma qual versão do arquivo está instalada no servidor. Não havia
  um trabalho Gutenberg disponível para teste real desse formato nesta auditoria.
- Nenhuma mudança no design, CSS ou componentes de galeria/cards. O build
  manteve o CSS `index-VGxhQd-K.css`.

## Arquivos alterados

- `src/lib/api.ts`: status explícito, constante de atualização e janela da URL.
- `src/components/sections/WorksPreview.tsx`: revalidação e chave da primeira página.
- `src/pages/Works.tsx`: revalidação da página/tipo atual e categorias.
- `src/pages/Detail.tsx`: revalidação dos trabalhos individuais.
- `src/lib/works-api.test.ts`: regressões controladas.
- `src/lib/works-api.live.test.ts`: integração real, ativada explicitamente.
- `docs/works-refresh-audit.md`: este relatório.

## Testes executados

- `pnpm typecheck`: passou.
- `pnpm lint`: passou.
- `pnpm test`: 17 testes passaram; duas integrações reais ficam desativadas
  por padrão. Regressões novas cobrem sete trabalhos em duas páginas, seis
  recentes na Home, categoria, status/ordenação/campos, cache compartilhado,
  publicação nova após TTL, rotação da URL, trabalho sem foto/categoria/galeria,
  detalhe previamente inexistente, galeria sob demanda, erro/retry e vazio.
  Os testes existentes do hook cobrem polling, foco, conexão e visibilidade.
- `$env:CM_WORKS_API_LIVE='1'; pnpm exec vitest run src/lib/works-api.live.test.ts`:
  passou. Comparou IDs 46 e 36 entre consulta completa, Home e detalhes;
  conferiu capas, categorias vazias e URLs das galerias. Uma consulta de lista
  e duas de detalhe; repetições dentro do TTL não consultaram novamente.
  Com avanço do relógio de teste, ocorreu uma quarta consulta, sem rebuild,
  mantendo ambas as publicações. O cenário de chegada de uma nova publicação
  após TTL foi validado com respostas controladas, sem modificar produção.
- `pnpm build`: passou, sete páginas com metadados/sitemap.
- Navegador local com API real: Home e `/trabalhos` exibiram os dois trabalhos,
  ID 46 antes de 36; ambas as páginas individuais abriram. Lightbox abriu com
  1/6 e 1/3; navegação da galeria recente avançou para 2/6.
- `git diff --check`: passou.

## Estado da entrega

Mudanças locais na branch existente `main`, conforme solicitado. Nenhum commit,
push, PR, merge, deploy ou alteração remota do WordPress foi realizado nesta
tarefa. A correção precisa de publicação autorizada para chegar à produção;
depois disso, novos trabalhos não exigem novos builds para aparecer na interface.
Pendência de validação: exemplo real Gutenberg; a galeria clássica foi validada.

## Ajuste visual solicitado em seguida

Por nova instrução do proprietário, a restrição de manter o layout foi
substituída pelo pedido de carrossel na Home e grid em `/trabalhos`, com o
acabamento dos cards de serviços. A integração e a revalidação acima permanecem.

- `Content.tsx`: cards de trabalho reutilizam foto, degradê, ícone, tipografia,
  CTA e motion acessível dos serviços, mantendo fotos reais e links individuais.
- `WorksCollection.tsx`: grid uniforme na página completa; carrossel opcional
  com scroll snap, setas, limites, teclado, touch e ResizeObserver na Home.
  Sem autoplay ou biblioteca adicional. Um único trabalho também usa o card
  padrão. A antiga composição especial e a expansão do primeiro card deixaram
  de ser usadas.
- `WorksPreview.tsx`: ativa a apresentação em carrossel.
- `styles.css`: duas colunas no desktop, grid de uma coluna no mobile;
  carrossel com dois cards visíveis no desktop e próximo card parcialmente
  visível no mobile. Movimento respeita `prefers-reduced-motion`.
- `docs/project.md`: registra a nova direção visual aprovada.

Validação após o ajuste: typecheck, lint, 17 testes e build passaram. Navegador
local confirmou dois cards lado a lado no desktop; carrossel mobile avançou
para o segundo trabalho e desativou a seta no fim. Seta do teclado retornou
ao card anterior. Nenhuma consulta extra de API foi adicionada pelo carrossel.
