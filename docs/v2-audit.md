> Atualização de 30/10/2026: por instrução do proprietário, todas as exclusões de peças por código ou ID foram removidas. As observações sobre exclusão abaixo são históricas e não definem a regra atual. Consulte docs/catalog-refresh-audit.md.

# Auditoria e direção de arte V2

A V1 foi reprovada visualmente pelo usuário. Revisão na mesma branch `codex/implementacao-v1`, preservando os contratos e a navegação.

## Diagnóstico antes das alterações

- Serviços: cinco cartões brancos estreitos com miniaturas, corpo e rodapé iguais; a fotografia ocupava pouco espaço e não criava presença editorial.
- Ritmo: fundos claros alternados sem transições, títulos com pouca variação e repetição de cabeçalho + grade. As sombras e entradas não corrigiam a composição.
- Sobre: imagem do hero repetida e corte 50/50 previsível, sem plano dominante nem uma relação própria entre fotografia e texto.
- Trabalhos: um único registro ficava na metade esquerda de uma grade vazia. A quantidade real deveria determinar a apresentação.
- Header: fundo azul opaco, logo pequeno e ativo baseado apenas em pathname; as seções da Home nunca eram refletidas na navegação.
- Internas: blocos azul-claro de título e filtros em caixa lembravam uma interface administrativa.
- Assets: fotografias boas, mas pequenas e tratadas como ilustração auxiliar; não havia linguagem consistente de luz e fluxo de ar.

## Diagnóstico do catálogo

API consultada antes de alterar a UI: HTTP 200, CORS autorizado para localhost, campos ACF e mídia incorporada presentes. Único cadastro retornado: ID 29, código TESTE-CM-001, preço string "350", categoria 2, estado usada, disponibilidade disponivel. A ausência é provocada pela regra explícita de exclusão de cadastro fictício em `isPublicPiece`, aplicada também ao detalhe e ao sitemap. Não houve falha de parsing, mídia, preço, filtros padrão ou paginação.

O proprietário confirmou nesta conversa: “Agora é real; autorizo exibi-la”. O ID 29 passou a ser uma exceção pública explícita em `src/lib/piece-policy.mjs`, compartilhada entre normalização frontend e geração de sitemap/SEO. Demais códigos TESTE-CM-* continuam excluídos. A autorização atual substitui a classificação histórica desse item como fictício; não houve alteração remota no cadastro WordPress.

## Direção da V2

- Glass branco no header, logo em escala maior e navegação com indicador móvel por seção.
- Hero preservado, com luz e linhas de fluxo de ar, transição contínua para os serviços.
- Seis superfícies fotográficas amplas, em 3/2/1 colunas, texto sobreposto e profundidade controlada pelo ponteiro (apenas mouse e sem reduced-motion).
- Sobre como panorama técnico com título sobreposto e painel editorial deslocado, em vez de duas colunas iguais.
- Trabalhos com registro único em spread editorial preenchido e múltiplos registros em composição fotográfica; galeria segue sob demanda.
- Catálogo com barra integrada de pesquisa, filtros discretos, categorias em trilha horizontal e fotografia de produto dominante.
- Detalhes e cabeçalhos internos com linguagem editorial própria, tipografia ampliada e planos assimétricos.


## Novos assets conceituais V2

Criados com ImageGen integrado, salvos no projeto e comprimidos em WebP. Não representam obras cadastradas da empresa. Logo e favicon oficiais não foram alterados. Os rótulos visuais de ilustração foram removidos conforme instrução V2; os textos alternativos e esta documentação mantêm a origem clara.

- `public/v2-sobre.webp`: panorama técnico editorial.
- `public/v2-corretiva.webp`: diagnóstico de sistema, exclusivo do sexto serviço.

Prompts finais:

Sobre: “Very wide architectural editorial photograph of an elegant contemporary commercial building facade with a bank of clean white outdoor air conditioning condensers along the lower right, silver metal louvers, glass reflections, a few blue chilled-water pipes; at left deep navy structural beams with strong diagonal leading lines. No people, no signage, no logos. Air conditioning equipment recognizable. Bright cool daylight, cyan reflections, rich navy shadows, premium industrial look. Landscape 1536x1024, cinematic perspective and believable mechanical detail. Conceptual service illustration, not a completed company installation.”

Corretiva: “Photorealistic editorial photograph, close view of a technician's navy-sleeved hand holding digital HVAC diagnostic manifold near outdoor split air conditioner condenser with cover removed, realistic compressor service valves and copper pipes, no visible text, no logos, face not visible. Cinematic blue technical illumination mixed with daylight. Landscape 1536x1024, sharp central equipment, dark lower third for overlaid website heading. Conceptual service illustration, not a real company project.”
