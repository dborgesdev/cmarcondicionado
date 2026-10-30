# CM Ar-Condicionado — Instruções para agentes

- Leia **`docs/project.md` integralmente** antes de editar; referência visual: `assets/referencia-visual-home-v1.png`.
- Nome oficial: **CM Ar-Condicionado**. Não invente fatos, estoque, fotos de obras, credenciais ou promessas comerciais.
- Implementar V1 completa com React + TypeScript + Tailwind, `pnpm`, respeitando a stack existente. Seções principais em componentes `.tsx` separados; lógica de API separada de UI.
- WordPress é headless. Use `_embed=wp:featuredmedia`; nas peças use `acf_format=standard`. Não faça requisições de mídia por ID se a URL já vem no payload.
- Trabalhos: seis mais recentes na Home; todos em `/trabalhos`; detalhe e galeria sob demanda. **Sem destaque ACF**.
- Peças: `/pecas` com busca, filtros e paginação consistentes; `/pecas/:slug` individual. Exibir todas as peças publicadas no WordPress, independentemente de código ou ID. Não criar exclusões por prefixo de referência.
- Cada serviço abre modal persuasivo **específico**, com CTA WhatsApp personalizado; botão WhatsApp flutuante em todas as rotas. Destino confirmado `5562993528692`.
- Footer obrigatório, texto exato **“Desenvolvido por Douglas Borges - Smart Local”** com link `https://smartlocal.com.br`, `target="_blank" rel="noopener noreferrer"`.
- Mockup é guia, não asset final. Usar logo real e fotos reais do WP para obras/peças; hero com aparelho split reconhecível. Motion intencional, acessível, `prefers-reduced-motion`.
- O adaptador PHP `wordpress/cm-trabalhos-rest.php` é artefato de instalação no WordPress, não código frontend. Não afirmar que está instalado sem verificar.
- Rodar validações reais, reportar pendências. **Não fazer commit, push, PR, merge nem deploy sem autorização explícita.**
