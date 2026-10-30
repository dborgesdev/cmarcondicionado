# CM Ar-Condicionado — Especificação de implementação V1

**Estado:** direção visual aprovada como referência; especificação pronta para implementação; conteúdo empresarial não fornecido permanece pendente. **Não declarar publicação/QA concluídos sem executar.**

## 1. Fonte de verdade e classificação

### Confirmado
- Nome oficial: **CM Ar-Condicionado**. Não usar “Kleber Martins” como nome oficial nem como marca secundária sem autorização.
- Site público: `https://cmarcondicionado.com.br/`.
- WordPress headless: `https://painel.cmarcondicionado.com.br/`.
- Repositório: `https://github.com/dborgesdev/cmarcondicionado`.
- Instagram fornecido: `https://www.instagram.com/climartinzar_arcondicinado` (verificar se o perfil ainda corresponde à empresa antes de exibir).
- WhatsApp confirmado: **+55 62 99352-8692**; destino `https://wa.me/5562993528692`.
- Frontend React; backend WordPress para peças e trabalhos; **não usar WooCommerce** nem checkout.
- CPT peças `peca`, REST `/wp-json/wp/v2/pecas`; categorias REST `/wp-json/wp/v2/categorias-pecas`.
- CPT trabalhos `trabalho`, REST `/wp-json/wp/v2/trabalhos`; tipos REST `/wp-json/wp/v2/tipos-trabalho`.
- Home mostra automaticamente os **seis trabalhos mais recentes**, sem campo ACF de destaque.
- Cada serviço abre **modal próprio**, com texto persuasivo específico e CTA WhatsApp contextualizado.
- Cada peça tem **página própria**; catálogo completo com **busca e filtros**; página completa com todos os trabalhos.
- WhatsApp flutuante fixo no canto inferior direito em todas as páginas.
- Referência visual aprovada: `assets/referencia-visual-home-v1.png` (mockup, não asset de produção).
- Serviços identificados no material fornecido: manutenção preventiva e corretiva, instalação residencial e comercial, conserto em geral, chiller industrial, climatização hospitalar/sala limpa/UTI. Não inventar certificações ou habilitações.

### Direção/recomendação aprovada como base de V1
- Conceito **Industrial Premium**, com azul profundo `#091C35`, azul técnico `#1266B2`, azul glacial `#DCEFFA`, branco gelo `#F6F9FC`, grafite `#263545`, ciano `#43BCE8`.
- Títulos Barlow Condensed; corpo Inter; fotografia realista de aparelhos split e condensadoras reconhecíveis; hero editorial com texto à esquerda e equipamento à direita.
- Motion intencional, leve, acessível, respeitando `prefers-reduced-motion`.
- Galeria de trabalhos usa **fotos reais cadastradas no WordPress**, não imagens geradas que simulem obras reais.

### Pendências que NÃO devem ser inventadas
- Logotipo original em arquivo reutilizável e demais imagens institucionais reais (localizar nos materiais disponíveis/repositório; solicitar somente se indisponíveis).
- Endereço, cidade/região de atendimento, horário, e-mail, CNPJ, anos de atuação, números de clientes, avaliações, garantias, certificações e políticas comerciais: **não publicar sem confirmação**.
- Fotos reais de trabalhos: somente as que o cliente cadastrar no WordPress. Peças: exibir todos os cadastros publicados, independentemente de código ou ID, conforme instrução do proprietário em 30/10/2026.
- Conteúdo final detalhado dos serviços: os textos propostos abaixo são copy editorial baseada nos tipos de serviço confirmados, não alegações específicas sobre capacidade/resultado.
- Destino de hospedagem da SPA: preferir Vercel; confirmar domínio, acesso e deploy antes de configurar produção.

## 2. Objetivo, público e conversão

Site institucional e catálogo consultivo para visitantes que precisam de instalação, manutenção, conserto e soluções de climatização; interessados em peças consultam disponibilidade pelo WhatsApp. Jornada: compreender serviço → confiar na apresentação → visualizar trabalhos reais → entrar em contato. Conversão primária: WhatsApp contextualizado; secundária: navegação por trabalhos/peças.

## 3. Rotas e arquitetura de navegação

- `/` — Home.
- `/trabalhos` — Todos os trabalhos publicados, com paginação ou “carregar mais”, filtros por tipo se houver categorias.
- `/trabalhos/:slug` — **Recomendado** para URL compartilhável e SEO: detalhes do trabalho, galeria completa, CTA de contato. Na Home o card pode abrir visualizador/lightbox, mas preservar link para URL individual. Não bloquear SEO em modal.
- `/pecas` — Todas as peças, busca textual, filtros por categoria, estado e disponibilidade; paginação, estados de vazio e erro.
- `/pecas/:slug` — Página própria de peça, fotos, especificações, preço condicional, disponibilidade e CTA WhatsApp com nome/código/URL.
- Serviços podem ser seções da Home; **não criar páginas individuais de serviços na V1** sem necessidade. Cada card abre seu modal específico.
- Âncoras da Home: `#servicos`, `#sobre`, `#trabalhos`, `#pecas`, `#contato` quando fizer sentido.
- Header: Início, Serviços, Sobre, Trabalhos, Peças, Contato; CTA WhatsApp. Mobile: menu acessível.
- Footer: contatos confirmados, links, Instagram após validação e crédito obrigatório exato **“Desenvolvido por Douglas Borges - Smart Local”**, link `https://smartlocal.com.br`, `target="_blank" rel="noopener noreferrer"`.

**Routing SPA:** configurar rewrites/fallback de Vercel para URLs profundas; garantir acesso direto/refresh nas rotas. SEO de páginas dinâmicas: SPA com metadados client-side é insuficiente para alguns crawlers/social previews; avaliar pré-renderização/SSG das rotas de peças e trabalhos ou SSR caso viável, e documentar trade-off. Não alegar OG dinâmico completo se não implementado.

## 4. Home — estrutura e direção de composição

**A imagem `assets/referencia-visual-home-v1.png` é a referência principal de composição, hierarquia, ritmo, proporções e tratamento fotográfico.** Não a renderizar como página, não recortar seus cards para virar assets, não reproduzir texto incorreto do mockup. Recriar em componentes React com dados reais.

1. **Header** — logo real, links, CTA WhatsApp, sticky compacto após scroll.
2. **Hero** — atmosfera azul profunda, tipografia de impacto, foto realista de **ar-condicionado split/condensadora familiar ao público**, não maquinaria industrial obscura; overlay para contraste; CTA “Solicitar atendimento”, CTA secundário “Conhecer serviços”. Texto inicial proposto: eyebrow `SOLUÇÕES EM CLIMATIZAÇÃO`; H1 `Climatização com atenção a cada detalhe.`; apoio `Instalação, manutenção e conserto de sistemas de ar-condicionado para diferentes necessidades.` Não afirmar rapidez, economia ou cobertura geográfica não comprovadas.
3. **Serviços** — cards fotográficos editoriais com nomes e descrições específicas, CTA “Saiba mais” abre modal do serviço. Variedade compositiva; não somente grade genérica.
4. **Sobre** — bloco institucional técnico, sem estatísticas inventadas; apresentar o que faz e foco em atendimento. Se não houver história factual, texto enxuto e objetivo.
5. **Trabalhos realizados** — 6 últimos automaticamente por data desc em carrossel horizontal, com cards lado a lado no desktop e deslize no mobile; capa real, título e categoria quando disponível; CTA “Ver todos os trabalhos” → `/trabalhos`; card abre detalhe ou visualizador com navegação. Cards seguem o acabamento fotográfico da seção de serviços.
6. **Peças e componentes** — seleção recente de peças publicadas, independentemente de código ou ID, com imagem, preço condicional, disponibilidade; CTA “Ver todas as peças” → `/pecas`.
7. **CTA final** — faixa azul profundo com mensagem e WhatsApp.
8. **Footer** — completo, com crédito obrigatório.

## 5. Modais de serviços — conteúdo e conversão

Cada serviço deve ter **conteúdo próprio**, não um template com troca de título. Modal acessível com título, contexto/problema, abordagem/benefícios plausíveis, o que o cliente pode informar no contato, e CTA específico. Copy abaixo é **proposta editorial** baseada nos serviços listados, não garantia contratual:

### Instalação residencial e comercial
- Título: `Instalação de ar-condicionado para o seu ambiente`
- Texto: `A escolha do local e a instalação adequada fazem diferença no conforto e no funcionamento do equipamento. Seja em casa ou em um espaço comercial, vale avaliar as condições do ambiente e as necessidades de uso antes de instalar.`
- Apoio: `Conte qual é o aparelho, onde será instalado e se já existe infraestrutura preparada. Assim, a conversa começa com as informações certas.`
- CTA: `Conversar sobre instalação`.
- Mensagem WhatsApp: `Olá! Vim pelo site da CM Ar-Condicionado e gostaria de solicitar informações sobre instalação de ar-condicionado. Meu ambiente é [residencial/comercial] e preciso de orientação.`

### Manutenção preventiva
- Título: `Cuidados periódicos para o seu sistema de climatização`
- Texto: `A manutenção preventiva ajuda a identificar necessidades de limpeza, inspeção e ajustes antes que pequenos sinais se tornem problemas maiores. A frequência e os procedimentos dependem do equipamento e de suas condições de uso.`
- Apoio: `Informe o tipo de aparelho e quando foi feita a última manutenção.`
- CTA: `Consultar manutenção preventiva`.
- Mensagem: `Olá! Vim pelo site da CM Ar-Condicionado e gostaria de informações sobre manutenção preventiva do meu ar-condicionado.`

### Manutenção corretiva e conserto
- Título: `Seu ar-condicionado apresentou algum problema?`
- Texto: `Falhas de funcionamento, ruídos incomuns, baixo desempenho ou interrupções de operação exigem avaliação para identificar a causa. Descreva os sintomas e o modelo do equipamento para iniciar o atendimento.`
- Apoio: `Se possível, envie foto da etiqueta do aparelho e explique o que está acontecendo.`
- CTA: `Solicitar avaliação de conserto`.
- Mensagem: `Olá! Vim pelo site da CM Ar-Condicionado e preciso de orientação sobre um ar-condicionado com problema. Posso informar o modelo e os sintomas.`

### Chiller industrial
- Título: `Atendimento para sistemas de climatização industrial`
- Texto: `Sistemas de maior porte exigem compreensão das condições de operação e das características do equipamento. Para demandas envolvendo chiller industrial, o primeiro passo é reunir as informações técnicas do sistema e a necessidade identificada.`
- Apoio: `Informe aplicação, fabricante/modelo e a demanda de manutenção ou avaliação.`
- CTA: `Consultar atendimento para chiller`.
- Mensagem: `Olá! Vim pelo site da CM Ar-Condicionado e gostaria de consultar atendimento para um sistema de chiller industrial.`

### Climatização hospitalar, sala limpa e UTI
- Título: `Climatização em ambientes de requisitos específicos`
- Texto: `Ambientes como áreas hospitalares, salas limpas e UTIs possuem exigências próprias de operação e controle ambiental. Uma solicitação desse tipo deve começar pela identificação do ambiente, do sistema instalado e do escopo necessário.`
- Apoio: `Descreva o ambiente e a necessidade para verificar a possibilidade de atendimento.`
- CTA: `Consultar solução especializada`.
- Mensagem: `Olá! Vim pelo site da CM Ar-Condicionado e gostaria de consultar atendimento relacionado à climatização de ambiente hospitalar, sala limpa ou UTI.`

**Não prometer** conformidade regulatória, credenciamento hospitalar, resultados técnicos, atendimento 24h ou prazos sem comprovação. Se o design exigir apenas 4 cards, combinar manutenção preventiva/corretiva num card com abas/seções distintas dentro do modal, mantendo a especificidade.

## 6. WhatsApp — regras globais

- URL base `https://wa.me/5562993528692?text=${encodeURIComponent(message)}`.
- Botão flutuante fixo inferior direito em **todas as rotas**, desktop e mobile; ícone oficial do WhatsApp em SVG, rótulo acessível, foco visível, `safe-area-inset-bottom`, não cobrir CTAs, consent banners ou controles de galeria.
- Mensagem global: `Olá! Conheci a CM Ar-Condicionado pelo site e gostaria de solicitar atendimento.`
- Mensagens por serviço: ver seção 5.
- Por peça: `Olá! Vi a peça "{nome}" (código: {codigo se houver}) no site da CM Ar-Condicionado e gostaria de consultar disponibilidade e condições. Link: {URL canônica da peça}`. Se indisponível, trocar para consulta de alternativa; não oferecer compra direta.
- Por trabalho: `Olá! Vi o trabalho "{titulo}" no site da CM Ar-Condicionado e gostaria de conversar sobre um serviço semelhante. Link: {URL do trabalho}`.
- Todos os CTAs devem funcionar por teclado e em mobile.

## 7. Contratos WordPress reais

### Peças
Endpoint validado com resposta real:
`GET https://painel.cmarcondicionado.com.br/wp-json/wp/v2/pecas?_embed=wp:featuredmedia&acf_format=standard`

Campos observados:
- `id`, `slug`, `title.rendered`, `content.rendered`, `featured_media`, `categorias-pecas: number[]`.
- `_embedded['wp:featuredmedia'][0].source_url`, `media_details.sizes`, `alt_text`.
- `acf.codigo_referencia: string`, `marca_fabricante: string`, `compatibilidade: string`, `estado_peca: 'nova'|'usada'|'recondicionada'`, `preco: string|number`, `exibir_preco: boolean`, `disponibilidade: 'disponivel'|'sob_consulta'|'indisponivel'`, `galeria: {'1'..'5': imageObject|false}`.
- Galeria ACF com `acf_format=standard`: imagens já possuem `url`, `alt`, `width`, `height`, `sizes`; **não fazer consultas `/media/{id}` por imagem**.
- Categorias: `GET /wp-json/wp/v2/categorias-pecas`; filtrar usando parâmetro REST real `categorias-pecas={id}` (verificar).
- Exibir todas as peças publicadas no WordPress, independentemente de código ou ID. Não excluir referências iniciadas por `TESTE-CM-` nem IDs específicos. O status de publicação no WordPress determina a inclusão no catálogo; disponibilidade e preço seguem os campos cadastrados.
- Exibir preço **somente** quando `exibir_preco===true` e `preco` for número válido. Não inventar preço. Estado/disponibilidade devem ser visíveis; tratamento adequado para indisponível.
- Sanitizar HTML do editor se renderizado; nunca injetar HTML arbitrário sem política de sanitização.

### Trabalhos
Listagem com **capa incorporada** (não remover `featured_media`/`_links` de `_fields` quando usar `_embed`):
`GET https://painel.cmarcondicionado.com.br/wp-json/wp/v2/trabalhos?per_page=6&orderby=date&order=desc&_embed=wp:featuredmedia&_fields=id,slug,date,title,featured_media,tipos-trabalho,_links,_embedded`

Página todos: paginação `page`, `per_page`, `orderby=date`, `order=desc`, `_embed=wp:featuredmedia`; consultar `X-WP-Total`/`X-WP-TotalPages` quando expostos por CORS, com fallback seguro. Categoria `tipos-trabalho` pode estar vazia; omitir chip se não houver.

Trabalho individual: `GET /wp-json/wp/v2/trabalhos?slug={slug}&_embed=wp:featuredmedia&_fields=id,slug,title,content,featured_media,_embedded,cm_galeria` ou `/trabalhos/{id}` após resolução do slug. O campo `cm_galeria` vem do MU-plugin e retorna array de fotos com `id,url,width,height,alt,preview_url,srcset,sizes`. **Testar a resposta real antes de depender dela**.

**Atenção:** trabalho de teste `id=36` devolveu HTML de galeria **clássica**, não necessariamente bloco Gutenberg. O PHP anterior extraía apenas blocos. O pacote inclui `wordpress/cm-trabalhos-rest.php` versão 1.1 que também lê `[gallery ids="..."]` / `[gallery include="..."]`. Deve ser instalado/atualizado em `wp-content/mu-plugins/cm-trabalhos-rest.php` por pessoa com acesso ao WordPress; Codex não deve alegar instalação remota sem executar. Validar `GET /wp-json/wp/v2/trabalhos/36?_fields=id,title,cm_galeria` e conferir fotos 38 etc. Se a galeria clássica usa shortcode sem `ids/include`, avaliar caso real antes de adaptar. Evitar parse do HTML renderizado no React como integração principal.

### Resiliência e performance
- Usar `_embed=wp:featuredmedia` e `acf_format=standard` para resolver imagens sem N+1 chamadas.
- Não solicitar `cm_galeria` na listagem; só no detalhe/abertura de galeria.
- No frontend, cache por chave (TanStack Query opcional se justificado), stale time razoável e revalidação, sem fetch duplicado. Evitar re-fetch em cada hover/modal sem necessidade.
- Usar formatos/tamanhos responsivos WP (`medium`, `medium_large`, `full`), `srcSet`, `sizes`, `loading=lazy` fora da primeira dobra; definir `width/height` ou `aspect-ratio` para prevenir CLS.
- Tratamento para mídia faltante, arrays vazios, falha de API, paginação, buscas sem resultado, CORS e endpoints lentos.
- Busca via `search` da WP REST; filtros de categoria, estado e disponibilidade podem exigir filtro client-side sobre páginas carregadas ou endpoint customizado. **Não apresentar filtros locais como globais se a paginação omitir resultados**. Preferir solução server-side consistente e documentada para catálogo completo, sem plugin pesado.
- Não expor credenciais WP no frontend; API pública de leitura.

## 8. Catálogo de peças e detalhe

### `/pecas`
Hero compacto, busca com debounce, filtros acessíveis de categoria/estado/disponibilidade, ordenação (recentes padrão), cards com foto, nome, código quando disponível, estado, disponibilidade, preço condicional e link para detalhe. Paginação real e URL de filtros compartilhável quando possível (`?busca=&categoria=&estado=`). Layout responsivo, skeletons discretos, estado vazio e CTA alternativo WhatsApp.

### `/pecas/:slug`
Breadcrumbs, galeria de fotos (imagem destacada + ACF, deduplicadas), detalhes técnicos, compatibilidade como texto cadastrado, disponibilidade e preço condicional; CTA WhatsApp específico; SEO de produto **sem marcar como `Offer` de compra** quando não há checkout/estoque comprovado. Evitar botões “Comprar” e fluxo de carrinho.

## 9. Trabalhos realizados

### Home
Seis mais recentes; cards fotográficos com hover sutil, título e categoria se existir; link “Ver todos os trabalhos”. Não exibir obra inventada.

### `/trabalhos`
Grid responsivo de cards uniformes, lado a lado no desktop, com lista completa paginada e filtro por tipo se dados suportarem; foto de capa, título e acesso ao detalhe. Mesmo acabamento fotográfico dos serviços, sem primeiro card expandido nem layout especial para um único registro.

### `/trabalhos/:slug`
Capa + galeria de fotos reais, navegação acessível entre imagens, descrição se existir e CTA contextual para serviço semelhante. Se usar lightbox, foco preso, ESC para fechar, botões anterior/próximo, sem impedir acesso à URL individual.

## 10. Visual e assets

- **Referência principal:** `assets/referencia-visual-home-v1.png`. O mockup é somente guia de direção, não prova de equipe, obra ou estoque; **não usar como asset final da página**.
- **Logo:** preservar o arquivo original fornecido, sem redesenhar ou substituir por tipografia genérica. Se não estiver disponível no repositório, registrar pendência e solicitar; não inventar.
- Hero: foto realista de split hi-wall e/ou condensadora residencial/comercial, equipamento reconhecível, composição direita, espaço negativo à esquerda, desktop amplo e crop específico mobile. Pode usar imagem conceitual individual sem logomarca falsa; não representar obra real.
- Serviços: fotografias individuais coerentes com cada serviço, sem colagens de mockup.
- Trabalhos: fotos reais do WordPress apenas.
- Peças: fotos reais cadastradas no WordPress apenas.
- OG image 1200x630 com composição centrada na área segura 1:1 para WhatsApp; derivar da marca quando arquivo real disponível. Favicon da marca real.
- Tipografia Barlow Condensed + Inter, sistema de espaçamento consistente, alternância de fundos escuros/claros, ritmos editoriais, cards e divisores técnicos.
- Motion: hero em camadas (opacidade/transform leves), serviços com entrada escalonada e hover, transições de filtros e lightbox; `prefers-reduced-motion` desliga movimento não essencial. Sem scroll jank ou animações em excesso.
- QA visual: reprovar simples empilhamento de seções, falta de acabamento ou distância grande do mockup aprovado.

## 11. Engenharia, deploy e SEO

- Stack padrão: React + TypeScript + Tailwind CSS + pnpm; usar Vite SPA salvo justificativa documentada para SSR/SSG. Repositório existente prevalece sobre scaffolding.
- Cada seção em componente `.tsx` próprio (`Header`, `Hero`, `Services`, `About`, `WorksPreview`, `PartsPreview`, `FinalCTA`, `Footer`, `WhatsAppFloat`). `App.tsx` e rotas só compõem.
- Organização sugerida: `src/components/sections`, `src/components/ui`, `src/pages`, `src/data`, `src/lib`, `src/types`, `src/hooks`, `public` (somente pastas necessárias).
- Serviço REST tipado separado da UI; adaptadores `normalizePiece`, `normalizeWork`, URL builder WhatsApp; HTML de WP sanitizado.
- SEO: title/description/canonical por rota, OG/Twitter, favicon, robots, sitemap (inclusive URLs dinâmicas quando possível), headings semânticos, alt, JSON-LD somente com dados verificáveis; documentar limitações de SPA e implementar estratégia de indexação coerente.
- Vercel recomendado: build `pnpm build`, output `dist` se Vite, rewrite SPA, variáveis públicas apenas se necessárias; confirmar domínio e deployment target antes de publicar.
- Acessibilidade: teclado, foco, modal `role=dialog` com `aria-modal`, foco inicial/restauração, ESC, contraste, lightbox acessível, labels, tamanho dos alvos mobile.
- Footer em TODAS as rotas: crédito exato `Desenvolvido por Douglas Borges - Smart Local` com `https://smartlocal.com.br`, nova aba, `rel="noopener noreferrer"`.

## 12. Critérios de aceite V1

1. Home fiel ao **sistema visual** do mockup de referência, não à imagem rasterizada.
2. Nome oficial CM Ar-Condicionado consistente em header, SEO, footer, WhatsApp.
3. Modal individual para cada serviço, com copy distinta e CTA WhatsApp correto.
4. WhatsApp flutuante em todas as páginas, acessível e sem sobreposições.
5. Home mostra os seis trabalhos mais recentes automaticamente; `/trabalhos` permite acessar os demais.
6. Trabalho individual exibe galeria real; validar shortcode clássico e Gutenberg; falhas da API não quebram layout.
7. `/pecas` possui busca, filtros **corretos sobre catálogo completo**, paginação; `/pecas/:slug` funciona por URL direta.
8. Peça exibe imagens, preço condicional, disponibilidade e mensagem WhatsApp contextual; todos os cadastros publicados são elegíveis independentemente de código ou ID.
9. Sem consultas N+1 a mídias; medir rede e validar thumbnails responsivas.
10. `pnpm typecheck` (ou equivalente), lint, build e testes existentes executados; reportar resultados reais.
11. Desktop/tablet/mobile, overflow, links, foco/teclado, lightbox/modal, console, SEO e refresh de rotas verificados.
12. Nenhum commit/push/PR/merge/deploy sem autorização explícita do usuário; trabalhar em uma branch de implementação e entregar preview/relatório para aprovação.
