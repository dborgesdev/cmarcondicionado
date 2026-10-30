> Atualização de 30/10/2026: por instrução do proprietário, todas as exclusões de peças por código ou ID foram removidas. As observações sobre exclusão abaixo são históricas e não definem a regra atual. Consulte docs/catalog-refresh-audit.md.

# Validação da V1 — 29/10/2026

Branch: `codex/implementacao-v1`. Sem commit, push, PR, merge ou deploy.

## Comandos executados

| Verificação | Resultado |
| --- | --- |
| `pnpm typecheck` | Passou, sem erros TypeScript |
| `pnpm lint` | Passou, sem erros ou avisos ESLint |
| `pnpm test` | 2 arquivos, 9 testes aprovados |
| `pnpm build` | Passou; Vite + geração de quatro páginas SEO e sitemap |
| `node scripts/verify-api.mjs` | Passou contra WordPress real |
| `node scripts/verify-build.mjs` | Passou nas quatro rotas HTML geradas |

Build final: JavaScript aproximadamente 340 KB / 109,5 KB gzip; CSS 33,5 KB / 8,6 KB gzip. Sem bibliotecas de checkout, WooCommerce ou ACF PRO.

Os testes cobrem: remoção de itens fictícios, preço condicional, deduplicação de imagens, contrato das galerias, mensagens e codificação WhatsApp, carregamento de todas as páginas de peças antes dos filtros, cache compartilhado, preservação das capas e galeria apenas no detalhe. O teste de catálogo usa 101 registros REST em duas páginas, incluindo peça de teste e um resultado que existe apenas na segunda página.

## API real

- Listagem retornou um trabalho. Capa veio em `_embedded` sem chamada adicional de mídia.
- `trabalhos/36?_fields=id,title,cm_galeria` retornou fotos 38 e 39. No detalhe, capa + galeria apresentaram três fotos reais.
- Única peça encontrada: ID 29, código TESTE-CM-001. Zero peças comerciais após exclusão.
- Filtro REST `categorias-pecas=2` respondeu corretamente.
- CORS permitiu `http://localhost:5174` e expôs `X-WP-Total, X-WP-TotalPages`.
- Nenhuma escrita remota ou instalação WordPress foi feita.

## Navegador real

Preview Vite e build de produção com Vite Preview foram abertos no navegador integrado.

- Home inspecionada em desktop (área útil 1265 px), tablet (viewport 768 × 1024) e celular (viewport 390 × 844; área útil 375 px). Sem overflow horizontal nas medições realizadas; nenhuma imagem quebrada nas verificações de DOM.
- Logo oficial no Header e Footer com `object-fit: contain`; favicon `/favicon.ico` confirmado no HTML. OG próprio de 1200 × 630 com logo intacto.
- Cinco modais abertos e conteúdo/CTA de cada serviço conferidos; destino WhatsApp 5562993528692 com mensagens específicas. Nenhuma mensagem foi enviada.
- Foco inicial no fechar; Esc fecha e restaura o foco ao card. Dialog modal nativo impede interação com o conteúdo de fundo.
- Galeria real abriu lightbox; próximo e setas alternaram as imagens. A seta funciona a partir do foco inicial no botão de fechar.
- Menu mobile abriu e permitiu navegar; busca com debounce e filtro Estado geraram `?busca=motor&estado=usada`.
- Catálogo vazio correto; acesso direto ao slug do produto fictício apresentou “Peça não encontrada”.
- Detalhe real abriu por URL direta e continuou funcionando após refresh no build de produção.
- Crédito exato verificado no DOM, incluindo URL, target e rel.
- Nenhum erro/aviso referente ao endereço do build de produção no console. Durante a edição houve mensagens transitórias de HMR ao formatar arquivos em lote; o reload e o build final resolveram esse estado.
- SEO estático inspecionado no HTML gerado; o build verifica explicitamente o title Open Graph de cada rota para evitar falha silenciosa na substituição. Sitemap tem Home, listagens e o trabalho público existente; não inclui a peça fictícia.

Capturas locais ficam em `qa/` (ignorada pelo Git): desktop-home.jpg, desktop-full.jpg, tablet-home.jpg e mobile-home.jpg.

## Pendências e limites reais

1. Publicar peças comerciais no WordPress para validar visualmente um detalhe de peça com conteúdo real. A implementação e as regras foram verificadas com testes; nenhum produto fictício foi anunciado.
2. Há apenas um trabalho publicado; a consulta está preparada para os seis mais recentes sem replicar ou inventar obras.
3. O caso clássico de galeria está validado ao vivo. Não foi criado um post Gutenberg de teste; a compatibilidade desse formato depende do adaptador fornecido.
4. A indexação do corpo é de SPA, com metadados estáticos por rota e resumo em noscript. Novos slugs exigem rebuild para sitemap e previews sociais próprios. Não se trata de SSR ou pré-renderização integral.
5. Instagram, endereço, região, horário e demais informações não confirmadas seguem omitidos.
6. Rewrites Vercel estão preparados; comportamento no host, domínio e validações após publicação dependem de deploy autorizado. Não foi realizado deploy nem teste hospedado.
7. A revisão responsiva e de teclado foi prática, sem declarar auditoria WCAG completa ou métricas Lighthouse que não foram executadas.
