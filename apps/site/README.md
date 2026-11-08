# Site do Confirma

Landing page pública do Confirma, construída com Astro, TypeScript e Tailwind
CSS. O site é gerado como HTML estático e apresenta o produto e o formulário
de solicitação de convite para o Beta. Este arquivo resume onde cada parte vive
e como iniciar a aplicação.

## Entrada da aplicação

O Astro gera uma página para cada arquivo em `src/pages/`. A única página atual
é:

```text
src/pages/index.astro
```

Ela compõe o `BaseLayout` com o cabeçalho e o hero da landing.

O layout base fica em:

```text
src/components/layout/base-layout.astro
```

Ali são importados os estilos globais, definidos idioma, `theme-color`,
pré-carregamento da fonte, favicons e manifest, e renderizado o componente
`Seo`, que gera título, descrição, canonical, Open Graph, Twitter Card e dados
estruturados (JSON-LD).

## Organização das pastas

```text
public/                      # fontes, ícones, logo, imagem OG, manifest e robots.txt
src/
├── pages/                   # páginas do site (roteamento por arquivo)
├── features/                # seções e comportamento por contexto
│   └── landing/             # cabeçalho, hero, ilustração e formulário de convite
├── components/              # componentes usados por mais de uma página
│   ├── layout/              # BaseLayout
│   └── seo.astro            # metadados, Open Graph e JSON-LD
├── config/
│   └── site.config.ts       # nome, URL, título, descrição e imagem OG
└── styles/
    └── global.css           # Design System do site: tokens, base e componentes
```

Cada feature segue, quando aplicável, estas pastas:

- `components/`: componentes `.astro` da seção;
- `api/`: funções que chamam a API com `fetch`;
- `scripts/`: comportamento no navegador, ativado pelos componentes.

## Páginas

- `/`: landing page com a proposta do Confirma, a ilustração do fluxo de
  confirmação e o formulário de solicitação de convite.

O sitemap é gerado no build pela integração `@astrojs/sitemap`, a partir de
`site` em `astro.config.mjs`. O `public/robots.txt` aponta para
`/sitemap-index.xml`.

## Solicitação de convite

O formulário `request-invitation-form.astro` envia o e-mail para
`POST /invitations` da API (API-01). O script
`request-invitation.script.ts` intercepta o submit, chama
`request-invitation.api.ts`, desabilita o botão durante o envio e anuncia o
resultado numa região `aria-live`.

A mensagem de sucesso é sempre neutra, para não revelar se o e-mail já possui
convite ou conta. A chamada não envia cookies: o site não usa sessão.

## Estilos

O Design System do site fica em `src/styles/global.css`, com Tailwind CSS 4
configurado por `@theme static`:

- cores da paleta de `docs/product/assets/tokens.json` e papéis semânticos
  (`canvas`, `surface`, `ink`, `ink-muted`, `line`, `action`, `confirmed`,
  `danger`...);
- tipografia IBM Plex Sans e IBM Plex Mono, auto-hospedadas em
  `public/fonts/` (licença em `public/fonts/OFL.txt`);
- escala tipográfica e espaçamentos fluidos, breakpoints, raios, sombras e
  animações;
- componentes globais (`.btn`, `.field`, `.eyebrow`, `.sheet`, `.status`,
  `.skip-link`) e utilitários (`container-page`, `grid-page`, `on-noite`,
  `check-draw`, `tabular`).

Animações respeitam `prefers-reduced-motion`, e há ajustes para
`forced-colors`.

## Variáveis de ambiente

Use `apps/site/.env.example` como referência.

- `PUBLIC_API_URL`: URL base da API, embutida no build. Opcional; usa
  `http://localhost:8080` quando ausente.

## Comandos do pacote

```bash
pnpm --filter @confirma/site dev          # servidor local na porta 4321
pnpm --filter @confirma/site build        # gera o HTML estático em dist/
pnpm --filter @confirma/site preview
pnpm --filter @confirma/site typecheck    # astro check
```

Na raiz do monorepo, `pnpm check` executa lint, typecheck, testes e verificação
de formatação.

## Docker

O `Dockerfile` usa a raiz do monorepo como contexto. Ele gera o `dist/` (com
os arquivos de `public/`) e o serve com Nginx, configurado em `nginx.conf` com
gzip, cache de um ano para `/_astro/`, cache de uma semana para fontes e
imagens, revalidação das páginas e cabeçalhos básicos de segurança.

```bash
docker build -f apps/site/Dockerfile -t confirma-site .
docker run -p 4321:80 confirma-site
```
