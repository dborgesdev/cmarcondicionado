# Validação V2 — 29/10/2026

Branch mantida: `codex/implementacao-v1`. Nenhum commit, push, PR, merge ou deploy. Frontend React + TypeScript + Tailwind + pnpm preservado, sem novas dependências de animação.

## Diagnóstico e decisão sobre a peça

A API pública respondeu HTTP 200 e retornou o cadastro ID 29 com capa incorporada, galeria ACF, categoria 2, preço string "350", `exibir_preco=true`, estado usada e disponibilidade disponivel. CORS autorizado e cabeçalhos de paginação expostos.

Causa raiz: a V1 excluía explicitamente o cadastro anteriormente classificado como fictício. Nesta conversa, o proprietário confirmou: “Agora é real; autorizo exibi-la”. O ID 29 foi liberado na política compartilhada `src/lib/piece-policy.mjs`, usada tanto pelo frontend quanto pelo build. Outros códigos TESTE-CM-* continuam excluídos. A referência TESTE-CM-001 permanece porque é o valor atual do cadastro; não foi inventado outro código nem alterado o WordPress.

A peça foi verificada na Home, no catálogo e no detalhe, com preço R$ 350,00, três imagens e WhatsApp com nome, código e URL. Filtros e estados vazios usam a coleção completa, preservando a paginação consistente da V1.

## Validações executadas

| Verificação | Resultado |
| --- | --- |
| `pnpm typecheck` | Passou |
| `pnpm lint` | Passou |
| `pnpm test` | 3 arquivos, 10 testes aprovados |
| `pnpm build` | Passou, cinco rotas SEO estáticas e sitemap |
| `node scripts/verify-api.mjs` | Passou contra API real; 1 trabalho e 1 peça pública |
| `node scripts/verify-build.mjs` | Passou nas cinco rotas HTML |

Build final: JS 350,29 KB / 112,36 KB gzip; CSS 50,83 KB / 12,21 KB gzip. Novos assets conceituais WebP: panorama aproximadamente 255 KB e corretiva 96 KB. Imagens fora da primeira dobra seguem lazy; mídia do WP continua responsiva e sem resolução por ID.

## Revisão prática no navegador

- Desktop: viewport 1440 × 1000, três colunas e seis cards fotográficos. Tablet: 768 × 1024, duas colunas. Mobile: 390 × 844, uma coluna. Larguras úteis medidas de 1425, 753 e 375 pixels; sem overflow horizontal nas verificações realizadas.
- Header translúcido, blur real, borda e sombra; logo oficial integral maior no início e reduzido por transformação durante scroll. Altura fixa sobre o documento evita deslocar o conteúdo ao compactar.
- Indicador ativo da Home acompanhou Serviços, Sobre e Peças pelo IntersectionObserver. Rotas internas marcaram Trabalhos e Peças, inclusive detalhes.
- Menu mobile abriu, navegou e fechou. Retorno para Início na mesma rota foi corrigido e verificado: menu fechado, ativo Início e hero no topo. Trocas de rota usam scroll instantâneo; âncoras mantêm a transição própria.
- Os seis modais foram abertos no celular; títulos, textos e links WhatsApp específicos foram conferidos. Nenhuma mensagem foi enviada.
- Modais centralizados; foco inicial em fechar; Tab e Shift+Tab circulam explicitamente entre os controles; Esc fecha e devolve foco ao card. O ciclo Tab foi reconferido no build final.
- Galerias de peça e trabalho abriram três imagens reais cada, com próximo e setas do teclado. Fotografias adicionais de trabalhos continuam solicitadas somente no detalhe.
- Trabalho único recebeu spread com fotografia e painel editorial ocupando a largura disponível; sem replicação de registros ou galeria inventada.
- Busca e filtros por categoria, estado e disponibilidade foram testados com o cadastro real. Estado Nova resultou em vazio; Usada + Compressores + Disponível retornou a peça. Detalhe exibe as informações técnicas e o contato contextual correto.
- A fotografia da peça na Home foi conferida carregada após entrar na seção, não apenas pela existência da tag. Logo e favicon oficiais preservados.
- Detalhe da peça abriu por URL direta e continuou funcionando após refresh no build final. Console de uma aba nova do build de produção: nenhum erro ou aviso nas jornadas válidas testadas.
- Durante edição houve um erro transitório do Fast Refresh ao adicionar cleanup a um hook existente. Um reload completo resolveu o estado de desenvolvimento; o código final passou no lint, build e teste de console sem HMR.
- `prefers-reduced-motion` é atendido nas regras CSS e nas rotinas JavaScript de ponteiro/scroll. Não foi alterada a preferência do sistema do usuário nem declarada uma emulação que a ferramenta não suporta.

## Evidências locais

Capturas em `qa/v2/` (pasta ignorada pelo Git):

- `desktop-services.jpg`, `desktop-about.jpg`, `desktop-parts-home.jpg`, `desktop-full.jpg`;
- `tablet-services.jpg`;
- `mobile-home.jpg`, `mobile-services.jpg`, `mobile-modal.jpg`.

O screenshot de página inteira pode capturar imagens lazy ainda fora da janela; por isso a peça também possui evidência própria com carregamento confirmado. A revisão foi prática, sem declarar auditoria WCAG formal, Lighthouse ou teste de hospedagem não executados.

## Avaliação local e limites

Preview de desenvolvimento: `http://localhost:5174/` durante esta entrega. Para iniciar outra sessão, executar `pnpm dev` na raiz e usar a URL informada pelo Vite. Para conferir o build, `pnpm preview`.

A aprovação visual permanece com o proprietário. Domínio, deploy e QA hospedado não foram realizados. Metadados estáticos e sitemap precisam de rebuild para novos slugs; não há SSR integral. Permanece apenas um trabalho publicado, e o formato Gutenberg não recebeu um novo post remoto de teste nesta revisão.

Auditoria, direção de arte e prompts dos novos assets: `docs/v2-audit.md`.
