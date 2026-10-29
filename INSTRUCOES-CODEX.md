# Instruções de execução — Codex

Implemente a V1 completa do site **CM Ar-Condicionado** no repositório `dborgesdev/cmarcondicionado` seguindo `docs/project.md` e `AGENTS.md`. A imagem `assets/referencia-visual-home-v1.png` é a **referência visual principal aprovada**; reproduza seu sistema de design, composição e acabamento em React, não a imagem como página.

## Ordem de trabalho
1. Inspecione o repositório e preserve qualquer código/stack existente. Crie **uma branch de implementação**, sem alterar `main` diretamente.
2. Verifique endpoints WordPress reais e o contrato descrito em `docs/project.md`. Valide capa com `_embed=wp:featuredmedia` e `_fields` que mantenha `featured_media`, `_links`, `_embedded`. Confirme `cm_galeria` para trabalho 36. O PHP atualizado está em `wordpress/cm-trabalhos-rest.php` e requer instalação no WP; se não estiver instalado, registre bloqueio parcial e implemente o frontend com fallback honesto.
3. Faça a V1 **inteira**, responsiva, com Home, serviços/modal específicos, `/trabalhos`, `/trabalhos/:slug`, `/pecas`, `/pecas/:slug`, header/footer, WhatsApp contextual, SEO e assets individuais.
4. Utilize dados reais do WP, evitando que o produto de teste `TESTE-CM-001` apareça como oferta pública. Não invente endereço, anos de experiência, certificações, equipe, depoimentos ou imagens de trabalhos.
5. Configure deploy alvo Vercel sem publicar; valide rotas profundas e build de produção.
6. Execute lint/typecheck/build/testes disponíveis, faça QA de desktop/tablet/mobile, acessibilidade, interações, rede/REST, SEO e qualidade visual. Relate evidências, lacunas e URLs de preview se houver.
7. **Pare para aprovação visual do usuário antes de commit/push/PR/merge/deploy.**

## Atenção especial
- Busca e filtros precisam cobrir o catálogo inteiro, não só a página atual; avalie o comportamento real da REST API e proponha extensão mínima se necessário.
- Galerias de trabalhos podem estar em bloco Gutenberg ou shortcode clássico. Evitar parse de HTML renderizado como estratégia primária.
- O texto dos modais em `docs/project.md` é base editorial específica, refinável sem criar promessas não verificadas.
- Priorize o acabamento visual: ritmo, contraste, fotografia de aparelhos reconhecíveis, microinterações e composição marcante. Não aceite apenas seções empilhadas.
