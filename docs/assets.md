# Assets da V1

Identidade oficial fornecida pelo usuário em `public/logo-cm-arcondicionado.webp` e `public/favicon.ico`. Usados diretamente pelos caminhos públicos, sem recortes, distorções ou recriação. O nome textual e os metadados continuam CM Ar-Condicionado, independentemente da inscrição presente na imagem.

As imagens conceituais abaixo foram criadas com a ferramenta integrada ImageGen, convertidas para WebP e salvas no repositório. Não são apresentadas como fotografias de trabalhos da empresa. Os registros de trabalhos e peças vêm exclusivamente do WordPress. Os avisos visuais de ilustração foram removidos a pedido do usuário na V2; os assets continuam conceituais, com origem documentada. Novos assets e prompts estão em `docs/v2-audit.md`.

- `public/hero-climatizacao.webp`: hero e ilustração institucional; 1536 × 1024, aproximadamente 124 KB.
- `public/servico-manutencao.webp`: ilustração de limpeza de filtros.
- `public/servico-conserto.webp`: ilustração de inspeção de componentes.
- `public/servico-chiller.webp`: ilustração de sistema industrial.
- `public/servico-hospitalar.webp`: ilustração de ambiente hospitalar vazio.
- `public/og-cm.jpg`: composição HTML/CSS capturada em 1200 × 630 com o logo oficial intacto, título central e hero. Fonte em `scripts/og-source.html` (para recapturar, servir o HTML com acesso aos assets públicos). Elementos principais dentro da área central de 630 pixels.

## Prompts finais usados com ImageGen integrado

Hero: “Use case: ads-marketing. Asset type: premium air conditioning website hero photographic conceptual illustration, wide 1536x1024. Photorealistic white hi-wall split air conditioner mounted on warm concrete architectural wall at upper right, realistic outdoor condenser directly below on right, contemporary residential facade with glass and very subtle greenery. Left half dark deep navy negative space for website typography. Cool blue technical lighting, soft daylight across white equipment, sophisticated industrial premium mood. Recognizable everyday split and condenser, technically plausible equipment, no people, no logos, no text, no watermark. Single coherent photograph, no collage. This is a conceptual illustration, not a real completed installation.”

Base dos serviços: “Use case: photorealistic-natural. Asset type: conceptual service illustration for air conditioning company, landscape photograph. [CENA] Cool navy and ice blue grading, premium natural lighting, technically plausible, no text no logos no watermark. This is conceptual illustrative photography, not a real company project.”

Cenas:
- Manutenção: “Close up technician hands cleaning the air filters of a white wall mounted split air conditioner, realistic professional maintenance, navy work clothes no visible logos, face outside frame.”
- Conserto: “Macro editorial photo of technician hands using a multimeter to inspect the electronics inside an air conditioner, realistic circuit board copper cables, clean precise detail, face outside frame.”
- Chiller: “Industrial chiller outdoor cooling units in a modern plant, metal fan grilles and blue pipes, realistic technical editorial architectural photography.”
- Hospitalar: “Clean contemporary empty hospital corridor with ceiling cassette air conditioning vents, blue and white palette, realistic architectural editorial photograph, no people.”
