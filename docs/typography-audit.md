# Auditoria global de tipografia e legibilidade — 29/10/2026

Revisão na branch `codex/implementacao-v1`, preservando a direção visual V2, fotos, marca, rotas, funcionalidades e integração WordPress. Alterações de interface concentradas em `src/styles.css`; sem novas dependências ou mudanças nas regras comerciais.

## Diagnóstico

A escala anterior combinava raiz de 15px com fontes de 0.43–0.94rem em textos auxiliares. Algumas legendas chegavam a cerca de 6–10px, links de footer a 10–11px e descrições mobile a 12–13px. Havia várias regras de breakpoint reduzindo novamente as fontes.

As declarações pequenas foram substituídas por tokens semânticos centralizados. Os breakpoints agora ajustam a composição e os espaços, mantendo a leitura confortável. Títulos principais permaneceram expressivos; seções e títulos de cards passaram a ter uma relação mais equilibrada com os parágrafos.

## Escala aplicada e medida no navegador

| Papel | Escala atual |
| --- | --- |
| Parágrafos e descrições de leitura | 16–18px, line-height 1.65 |
| Descrições dos serviços | 16px, line-height 1.6 |
| Navegação, botões e CTAs | 15px |
| Campos e opções de filtros | 16px |
| Textos secundários, badges e códigos | 14–15px |
| Eyebrows e legendas | 13px, tracking moderado |
| Footer: links e descrições | 15px |
| Footer: créditos | 13px |
| Títulos de seções | 40–56px |
| Títulos de cards | 24–28px |
| Preços | 24–30px |
| Legenda do lightbox | 15px |

A entrada de busca mantém caráter editorial (22–30px). Títulos institucionais intermediários e cabeçalhos de modal têm escalas próprias. Os h1 da Home e das páginas internas mantêm a linguagem expressiva, com ajuste pontual abaixo de 370px para que palavras longas não sejam cortadas.

## Ajustes de espaço e contraste

- Header: links de 15px, espaçamento proporcional e acomodação em larguras intermediárias.
- Hero mobile: descrição de 16px e botões de 15px; texto, fotografia e faixa de serviços ocupam espaços próprios, sem sobreposição. CTAs ficam empilhados quando a largura exige.
- Serviços: descrições maiores, títulos equilibrados, área de texto com altura mínima e espaço para crescer; overlays reforçados sob os textos.
- Sobre e trabalhos: parágrafos com largura de leitura controlada e entrelinha de 1.65; legendas e categorias ampliadas.
- Peças: códigos, badges, preços e CTAs mais legíveis; filtros em duas colunas no tablet e uma no celular estreito para evitar valores truncados.
- Footer: links e descrições de 15px, pesos e cores reforçados; quebras de linha naturais e crédito de 13px.
- Modais: corpo de 16px no celular, CTAs de 15px e rolagem interna preservada. Lightbox reserva altura para título e controles sem reduzir a legenda.
- Superfícies dos botões foram levemente escurecidas dentro da paleta. As cores sólidas/limites do gradiente verificadas contra branco resultam em contraste entre 4.71:1 e 6.75:1. Isto não constitui uma auditoria WCAG integral de fotografias, estados e gradientes.

## Validação prática

Seis rotas verificadas em quatro larguras (24 combinações):

- `/`, `/trabalhos`, `/pecas`;
- `/trabalhos/instalacao-ar-condicionado`;
- `/pecas/compressor-rotativo-para-ar-condicionado-12-000-btus`;
- página 404.

Viewports: 1440px, 768px, 390px e 320px. Header também conferido em 1024px.

Resultados nas verificações realizadas:

- Sem overflow horizontal da página nas 24 combinações.
- Sem textos de leitura abaixo de 16px nos seletores auditados.
- Sem texto visual identificado abaixo de 12px nas páginas auditadas; legendas comuns usam 13px.
- Títulos, descrições e CTAs dos cards dentro de seus limites. A área extra das imagens de parallax foi distinguida de cortes reais de texto.
- Foram encontrados cortes internos em palavras longas dos h1 de trabalhos/detalhes em 320px. Eles foram corrigidos e as seis rotas revalidadas nessa largura sem estouro interno nos h1, h2, h3, parágrafos ou botões verificados.
- Os seis modais foram abertos no celular: corpo de 16px, CTA de 15px, sem overflow horizontal ou texto truncado. Tab/Shift+Tab, retorno de foco e Esc preservados.
- Detalhe da peça, galeria e lightbox testados. Legenda medida em 15px e controles visíveis dentro do dialog.
- Estado sem resultados do catálogo conferido: corpo de 16px, CTA de 15px, filtros de 16px e busca de 22px no mobile.
- Footer conferido em desktop e celular com links e descrições de 15px e créditos de 13px.

Não foram criados testes que apenas repetem declarações CSS. Foram executados os testes existentes, além da inspeção real de estilos computados e limites dos elementos.

## Comandos

- `pnpm typecheck`: passou.
- `pnpm lint`: passou.
- `pnpm test`: 3 arquivos, 10 testes aprovados.
- `pnpm build`: build de produção e geração de cinco rotas SEO/sitemap.
- `node scripts/verify-build.mjs`: validação dos HTMLs gerados.

Capturas e resultados medidos em `qa/typography/` (ignorado pelo Git), incluindo footer desktop/mobile, modal, lightbox, catálogo mobile e bloco institucional tablet.

Preview local: `http://localhost:5174/`. Para iniciar outra sessão: `pnpm dev` e usar a URL informada pelo Vite.

Sem commit, push, PR, merge ou deploy. A aprovação visual permanece com o proprietário.
