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
- `src/styles/global.css`: entrada do Tailwind CSS v4.
- `public/robots.txt`: instruções para rastreadores.
- `public/manifest.webmanifest`: metadados de instalação e ícones do site.
- `public/apple-touch-icon.svg`: ícone para atalhos em dispositivos Apple.
- `public/safari-pinned-tab.svg`: ícone monocromático para abas fixadas no Safari.

O site usa SSG (`output: 'static'`). O sitemap é gerado pelo `@astrojs/sitemap`
durante o build a partir de `https://useconfirma.com`.
