# CM Ar-Condicionado — V2

Site institucional e catálogo consultivo em React, TypeScript, Tailwind CSS e Vite, com WordPress headless.

```sh
pnpm install
pnpm dev
```

Validações: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`. Preview do build: `pnpm preview`.

- [Especificação](docs/project.md)
- [Implementação, API e SEO](docs/implementation.md)
- [Assets oficiais e imagens conceituais](docs/assets.md)
- [Auditoria e direção de arte V2](docs/v2-audit.md)
- [Validação V2](docs/v2-validation.md)
- [Auditoria global de tipografia](docs/typography-audit.md)
- [Validação histórica V1](docs/validation.md)

A publicação depende da aprovação do usuário. Não há deploy realizado.

---
# Handoff CM Ar-Condicionado

Arquivos para colocar **na raiz do repositório**:
- `AGENTS.md` — instruções concisas de engenharia.
- `docs/project.md` — especificação autossuficiente.
- `assets/referencia-visual-home-v1.png` — último mockup visual aprovado; **somente referência**.
- `INSTRUCOES-CODEX.md` — ordem de execução / prompt de handoff.
- `wordpress/cm-trabalhos-rest.php` — versão atualizada do MU-plugin de galerias para **instalar separadamente** em `wp-content/mu-plugins/cm-trabalhos-rest.php` no WordPress.

O repositório remoto e o WordPress não foram alterados por este pacote. O Codex deve implementar em branch, validar e aguardar aprovação antes de operações Git/publicação.
