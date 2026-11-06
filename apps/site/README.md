# Site do Confirma

Landing page estática do Confirma, construída com Astro e Tailwind CSS v4.

## Comandos

```bash
pnpm --filter @confirma/site dev
pnpm --filter @confirma/site build
pnpm --filter @confirma/site preview
pnpm --filter @confirma/site typecheck
```

## Estrutura

- `src/layouts/BaseLayout.astro`: documento HTML base e composição global.
- `src/components/Seo.astro`: metatags, Open Graph, Twitter Cards e JSON-LD.
- `src/config/site.ts`: identidade e URLs canônicas do site.
- `src/styles/global.css`: entrada do Tailwind CSS v4 e Design System do site.
- `public/fonts/`: fontes auto-hospedadas e licença.
- `public/robots.txt`: instruções para rastreadores.
- `public/manifest.webmanifest`: metadados de instalação e ícones do site.
- `public/favicon.svg` e `public/favicon.ico`: favicon vetorial e fallback em 16, 32 e 48 px.
- `public/apple-touch-icon.png`: ícone de 180 px para atalhos em dispositivos Apple.
- `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png`: ícones do manifest.
- `public/safari-pinned-tab.svg`: símbolo monocromático para abas fixadas no Safari.
- `public/og/confirma-og.png`: imagem Open Graph de 1200 × 630 px.

O site usa SSG (`output: 'static'`). O sitemap é gerado pelo `@astrojs/sitemap`
durante o build a partir de `https://useconfirma.com`.

## Design System

`src/styles/global.css` concentra tokens, base e componentes globais. As cores
vêm de `docs/product/assets/tokens.json`; os ícones reproduzem o símbolo de
`docs/product/assets/confirma-icone-app.svg`.

- **Tokens (`@theme`)**: paleta da marca, papéis semânticos (`canvas`, `surface`,
  `ink`, `ink-muted`, `line`, `link`, `focus`, `action`, `confirmed`, `danger`),
  tipografia, escala fluida de `text-xs` a `text-5xl`, raios, sombras,
  breakpoints, larguras e animações. Viram utilitários do Tailwind, como
  `bg-surface`, `text-ink-muted` e `py-section`.
- **Variáveis em `:root`**: durações, camadas de `z-index`, grade e foco.
- **Base**: tipografia, links, foco visível, seleção, campos, botões nativos e
  código.
- **Componentes**: `.btn` (com `.btn-secondary`, `.btn-quiet` e `.btn-lg`),
  `.field`, `.eyebrow`, `.sheet`, `.status[data-state]` com os estados do
  agendamento e `.skip-link`.
- **Utilitários**: `container-page`, `grid-page`, `on-noite` (superfície escura),
  `check-draw` (traço do check, com `pathLength="1"`) e `tabular`.

Regras visuais: sem gradientes, sem desfoque e com sombra só em controles e
camadas sobrepostas. A ação primária usa Noite; o Verde marca identidade,
confirmação, links e foco. Animações são desativadas com
`prefers-reduced-motion`.

## Fontes

IBM Plex Sans (variável, pesos 100–700) e IBM Plex Mono (400 e 500), subconjunto
latin, em `public/fonts/`. Ambas usam a SIL Open Font License 1.1, incluída em
`public/fonts/OFL.txt`. Plex Mono é usada para chaves, IDs, URLs, estados e
código.
