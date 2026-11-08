# Guia de desenvolvimento do site

Este arquivo complementa o `AGENTS.md` da raiz. Ele descreve os padrões
específicos de `apps/site` para que novas seções e páginas sejam construídas
de forma consistente.

## Fontes de verdade

Antes de mudar conteúdo ou comportamento, consulte:

- `docs/specs/overview.md`: produto, público, proposta de valor e escopo do
  Beta;
- `docs/specs/domain.md`: nomes de entidades e estados usados no texto e nas
  ilustrações;
- `docs/specs/api.md`: contratos HTTP consumidos pelo site e exemplos exibidos;
- `docs/product/assets/tokens.json`: paleta da marca;
- código existente: detalhes técnicos já adotados.

Não invente recursos, planos, preços, depoimentos, números ou integrações que
não estejam especificados. O site apresenta o Beta fechado: a única ação é
solicitar convite.

## Estrutura do site

```text
apps/site/
├── public/                      # fontes, ícones, logo, imagem OG, manifest
├── src/
│   ├── pages/                   # páginas (roteamento por arquivo)
│   ├── features/                # seções e comportamento por contexto
│   ├── components/              # layout e componentes usados por várias páginas
│   ├── config/site.config.ts    # identidade e metadados padrão
│   └── styles/global.css        # Design System do site
├── astro.config.mjs
├── nginx.conf
└── package.json
```

O site é estático (`output: 'static'`). Não há servidor, sessão nem rotas de
API no Astro; todo HTML é gerado no build.

## Convenções de arquivos

Arquivos usam kebab-case e um sufixo que indica o papel:

| Sufixo | Conteúdo | Exemplo |
| --- | --- | --- |
| `.astro` em `pages/` | página do site | `index.astro` |
| `.astro` em `components/` | componente ou seção | `landing-hero.astro` |
| `.api.ts` | uma chamada HTTP | `request-invitation.api.ts` |
| `.script.ts` | comportamento no navegador | `request-invitation.script.ts` |
| `.config.ts` | configuração estática | `site.config.ts` |

Imports usam caminhos relativos. Funções e constantes TypeScript usam exports
nomeados.

## Como criar uma seção

Seções da landing ficam na feature `landing`:

```text
src/features/landing/
├── api/
├── components/
└── scripts/
```

Crie somente as pastas necessárias. Depois, importe a seção na página dentro
de `<main>`.

Uma seção é um componente `.astro` com um único `h2` ligado por
`aria-labelledby`, usando `container-page` para alinhar à grade:

```astro
---
interface Props {
    class?: string;
}

const { class: className } = Astro.props;
---

<section
    aria-labelledby="how-it-works-title"
    class:list={['container-page py-section', className]}
>
    <p class="eyebrow">Como funciona</p>
    <h2 id="how-it-works-title" class="mt-4">
        Três passos até a confirmação
    </h2>
</section>
```

Regras:

- cada página tem um único `h1`, hoje no hero; seções usam `h2` e `h3`;
- props são declaradas em `interface Props`; aceite `class` e aplique com
  `class:list` quando a página precisar ajustar a disposição;
- texto é escrito em português, para clínicas e equipes técnicas, no tom do
  hero: frases curtas e concretas, sem promessas fora do escopo;
- exemplos de payload, eventos e estados seguem exatamente `docs/specs/api.md`
  e `docs/specs/domain.md`, com dados fictícios;
- componentes com papel não óbvio levam um comentário curto no topo explicando
  o que fazem e, quando aplicável, o ID da especificação (`API-01`, `UC-03`).
  Não comente o óbvio nem registre histórico de mudanças.

## Páginas

Cada arquivo em `src/pages/` gera uma URL. A página compõe `BaseLayout`,
o cabeçalho e as seções; ela não contém estilos nem lógica.

```astro
---
import BaseLayout from '../components/layout/base-layout.astro';
import LandingHeader from '../features/landing/components/landing-header.astro';
---

<BaseLayout
    title="Privacidade | Confirma"
    description="Como o Confirma trata os dados enviados pelas clínicas."
    canonical="/privacidade"
>
    <LandingHeader />
    <main>...</main>
</BaseLayout>
```

Regras:

- a página inicial usa o título e a descrição padrão de `site.config.ts`;
  outras páginas informam `title` no formato `<Página> | Confirma`,
  `description` e `canonical`;
- páginas que não devem ser indexadas usam `noindex`;
- identidade, URL, idioma, cores de tema e imagem OG ficam em
  `site.config.ts`. Não repita esses valores em componentes;
- o sitemap é gerado pela integração `@astrojs/sitemap`; não o mantenha à mão.

## Interatividade

O padrão é HTML sem JavaScript. Quando uma seção precisar de comportamento, use
um `<script>` do Astro que importe uma função de `scripts/`. Não adicione
frameworks de UI (React, Vue, Svelte) nem ilhas sem necessidade real.

O fluxo de dependências é:

```text
page → component → <script> → script → api → fetch
```

### `scripts/`

O script localiza elementos por atributos `data-*`, nunca por classes de
estilo, e funciona com várias instâncias do mesmo componente:

```ts
export const setupNewsletterForm = () => {
    const forms = document.querySelectorAll<HTMLFormElement>(
        '[data-newsletter-form]',
    );

    forms.forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            // ler o FormData, desabilitar o botão, chamar a API e
            // anunciar o resultado em [data-form-status]
        });
    });
};
```

Regras:

- durante o envio, desabilite o botão e informe o progresso;
- anuncie o resultado numa região com `role="status"` e `aria-live="polite"`;
- mensagens para a pessoa usuária ficam no script, em português;
- respostas que poderiam revelar dados de terceiros, como a existência de um
  convite ou conta, usam mensagem neutra.

### `api/`

Cada arquivo exporta uma função assíncrona que faz uma única chamada com
`fetch`, usando `import.meta.env.PUBLIC_API_URL`:

```ts
const apiUrl = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8080';

export const requestInvitation = async (email: string) => {
    const response = await fetch(`${apiUrl}/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error('Não foi possível solicitar o convite.');
    }
};
```

Regras:

- a função não conhece DOM nem mensagens de interface;
- os tipos de corpo e resposta espelham `docs/specs/api.md`;
- o site só consome endpoints públicos; não envie cookies nem credenciais;
- falhas viram exceção para o script decidir a mensagem.

## Estilos

O Design System fica em `src/styles/global.css`, com Tailwind CSS 4 e
`@theme static`.

- cores vêm exclusivamente de `docs/product/assets/tokens.json`; uma cor nova
  só entra no tema depois de existir nos tokens;
- componentes usam os papéis semânticos (`text-ink`, `text-ink-muted`,
  `bg-surface`, `border-line`, `text-danger`...) em vez de cores de fundação,
  salvo quando o próprio componente define o material, como as ilustrações;
- não use valores de cor hexadecimais soltos nas classes;
- superfícies escuras usam o utilitário `on-noite`, que remapeia os papéis;
- reutilize os componentes globais (`.btn`, `.btn-secondary`, `.btn-quiet`,
  `.field`, `.eyebrow`, `.sheet`, `.status`) antes de criar estilos novos;
- o estado de um agendamento usa `.status` com `data-state` e o nome exato
  do estado em `docs/specs/domain.md`; um estado sem variante em
  `global.css` ganha a sua antes de ser exibido;
- o material é esmalte: superfícies sólidas, sem gradientes nem desfoque, com
  sombra apenas em controles e camadas sobrepostas;
- estilos específicos de um componente ficam no `<style>` do próprio arquivo,
  usando as variáveis do tema (`var(--color-line)`, `var(--radius-md)`);
- estilo usado por mais de uma feature vai para `global.css`, em `@layer
  components` ou como `@utility`;
- animações ficam dentro de `prefers-reduced-motion: no-preference` ou usam
  `motion-safe:`;
- estado nunca é comunicado só por cor: acompanhe de texto e, quando houver,
  ícone;
- ilustrações em SVG têm `role="img"`, `title` e `desc`; SVGs decorativos usam
  `aria-hidden="true"`.

## Assets e SEO

- assets estáticos ficam em `public/` e são referenciados por `/arquivo`;
- fontes são auto-hospedadas em `public/fonts/`; não carregue fontes ou
  scripts de terceiros;
- imagens têm `width` e `height` explícitos e `alt` descritivo, ou `alt=""`
  quando decorativas;
- ao mudar nome, título, descrição ou imagem OG, atualize `site.config.ts` e,
  quando afetados, `public/manifest.webmanifest` e `public/og/`;
- ao mudar o domínio, atualize `site` em `astro.config.mjs`,
  `site.config.ts` e `public/robots.txt`.

## Segurança e privacidade

- o site não armazena dados no navegador (`localStorage`, `sessionStorage`,
  cookies);
- não adicione rastreadores, pixels ou analytics sem decisão aprovada;
- e-mails e outros dados digitados nunca vão para logs, `console` ou URLs.

## Comandos de verificação

Depois de uma alteração de implementação, execute na raiz:

```bash
pnpm check
```

Esse comando cobre lint, typecheck, testes e formatação. Para trabalhar apenas
no site:

```bash
pnpm --filter @confirma/site dev
pnpm --filter @confirma/site typecheck
pnpm --filter @confirma/site build
```

Não afirme que uma verificação passou sem executá-la. Ao entregar uma mudança,
liste arquivos afetados, verificações realizadas e pendências conhecidas.
