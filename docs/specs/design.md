---
version: beta
name: 'confirma-design-system'
description: 'Sistema visual compartilhado do Confirma para landing, painel web e documentação técnica.'

colors:
    primary: '#0A7F50'
    primary-pressed: '#086640'
    on-primary: '#FFFFFF'
    secondary: '#E6F5EE'
    on-secondary: '#0B1F1A'
    link: '#08784D'
    canvas: '#FFFFFF'
    surface: '#F3F7F5'
    surface-soft: '#F8FAF9'
    surface-strong: '#E6ECE9'
    hairline: '#D5E1DC'
    hairline-strong: '#9DB5AC'
    ink: '#0B1F1A'
    ink-secondary: '#344A42'
    ink-muted: '#53665F'
    on-dark: '#FFFFFF'
    on-dark-muted: '#D5E1DC'
    semantic-success: '#176B45'
    semantic-warning: '#805000'
    semantic-error: '#A3232D'
    semantic-info: '#285E86'
    accent-mint: '#3DDC97'
    accent-amber: '#F5A524'
    semantic-success-bg: '#E6F5EE'
    semantic-warning-bg: '#FFF3D6'
    semantic-error-bg: '#FDECEE'
    semantic-info-bg: '#EAF3FA'

typography:
    hero-display:
        {
            fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
            fontSize: '56px',
            fontWeight: 600,
            lineHeight: '1.05',
            letterSpacing: '-1.8px',
        }
    display-lg:
        {
            fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
            fontSize: '40px',
            fontWeight: 600,
            lineHeight: '1.12',
            letterSpacing: '-1.2px',
        }
    heading-1:
        {
            fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
            fontSize: '32px',
            fontWeight: 600,
            lineHeight: '1.2',
            letterSpacing: '-0.8px',
        }
    heading-2:
        {
            fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: '1.3',
            letterSpacing: '-0.4px',
        }
    heading-3:
        {
            fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
            fontSize: '20px',
            fontWeight: 600,
            lineHeight: '1.35',
            letterSpacing: '-0.2px',
        }
    heading-4:
        {
            fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '1.4',
            letterSpacing: '0',
        }
    subtitle:
        {
            fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: '1.55',
        }
    body-md:
        {
            fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
            fontSize: '15px',
            fontWeight: 400,
            lineHeight: '1.55',
        }
    body-md-medium:
        {
            fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            lineHeight: '1.5',
        }
    body-sm:
        {
            fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '1.5',
        }
    caption:
        {
            fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: '1.4',
        }
    button-md:
        {
            fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '1.2',
            letterSpacing: '0',
        }

rounded:
    xs: '4px'
    sm: '6px'
    md: '8px'
    lg: '12px'
    xl: '16px'
    full: '9999px'

spacing:
    xxs: '2px'
    xs: '4px'
    sm: '8px'
    md: '12px'
    lg: '16px'
    xl: '24px'
    xxl: '32px'
    xxxl: '48px'
    section-sm: '64px'
    section: '80px'
    section-lg: '96px'
    hero: '112px'

components:
    button-primary:
        {
            backgroundColor: '{colors.primary}',
            textColor: '{colors.on-primary}',
            typography: '{typography.button-md}',
            rounded: '{rounded.md}',
            padding: '12px 18px',
            minHeight: '44px',
        }
    button-primary-pressed:
        {
            backgroundColor: '{colors.primary-pressed}',
            textColor: '{colors.on-primary}',
        }
    button-primary-disabled:
        {
            backgroundColor: '{colors.surface-strong}',
            textColor: '{colors.ink-muted}',
        }
    button-secondary:
        {
            backgroundColor: '{colors.secondary}',
            textColor: '{colors.on-secondary}',
            typography: '{typography.button-md}',
            rounded: '{rounded.md}',
            padding: '12px 18px',
            border: '1px solid {colors.hairline}',
        }
    button-ghost:
        {
            backgroundColor: 'transparent',
            textColor: '{colors.ink}',
            typography: '{typography.button-md}',
            rounded: '{rounded.sm}',
            padding: '10px 12px',
        }
    button-link:
        {
            backgroundColor: 'transparent',
            textColor: '{colors.link}',
            typography: '{typography.body-sm}',
            padding: '0',
        }
    button-destructive:
        {
            backgroundColor: '{colors.semantic-error}',
            textColor: '{colors.on-primary}',
            typography: '{typography.button-md}',
            rounded: '{rounded.md}',
            padding: '12px 18px',
            minHeight: '44px',
        }
    card-base:
        {
            backgroundColor: '{colors.canvas}',
            rounded: '{rounded.lg}',
            padding: '{spacing.xl}',
            border: '1px solid {colors.hairline}',
            elevation: '1',
        }
    card-feature:
        {
            backgroundColor: '{colors.surface}',
            textColor: '{colors.ink}',
            rounded: '{rounded.lg}',
            padding: '{spacing.xxl}',
            border: '1px solid {colors.hairline}',
        }
    text-input:
        {
            backgroundColor: '{colors.canvas}',
            textColor: '{colors.ink}',
            typography: '{typography.body-md}',
            rounded: '{rounded.md}',
            padding: '10px 12px',
            border: '1px solid {colors.hairline-strong}',
            height: '44px',
        }
    text-input-focused:
        {
            border: '1px solid {colors.primary}',
            focusRing: '0 0 0 3px rgba(10,127,80,0.18)',
        }
    text-input-invalid: { border: '1px solid {colors.semantic-error}' }
    checkbox:
        {
            accentColor: '{colors.primary}',
            focusRing: '0 0 0 3px rgba(10,127,80,0.18)',
        }
    tab:
        {
            backgroundColor: 'transparent',
            textColor: '{colors.ink-secondary}',
            typography: '{typography.body-sm}',
            rounded: '{rounded.sm}',
            padding: '{spacing.sm} {spacing.md}',
        }
    tab-active:
        { backgroundColor: '{colors.secondary}', textColor: '{colors.ink}' }
    badge-neutral:
        {
            backgroundColor: '{colors.surface-strong}',
            textColor: '{colors.ink-secondary}',
            typography: '{typography.caption}',
            rounded: '{rounded.full}',
            padding: '4px 9px',
        }
    badge-success:
        {
            backgroundColor: '{colors.semantic-success-bg}',
            textColor: '{colors.semantic-success}',
            typography: '{typography.caption}',
            rounded: '{rounded.full}',
            padding: '4px 9px',
        }
    badge-warning:
        {
            backgroundColor: '{colors.semantic-warning-bg}',
            textColor: '{colors.semantic-warning}',
            typography: '{typography.caption}',
            rounded: '{rounded.full}',
            padding: '4px 9px',
        }
    badge-error:
        {
            backgroundColor: '{colors.semantic-error-bg}',
            textColor: '{colors.semantic-error}',
            typography: '{typography.caption}',
            rounded: '{rounded.full}',
            padding: '4px 9px',
        }
    alert-info:
        {
            backgroundColor: '{colors.semantic-info-bg}',
            textColor: '{colors.semantic-info}',
            border: '1px solid {colors.hairline}',
            rounded: '{rounded.md}',
            padding: '{spacing.md} {spacing.lg}',
        }
    alert-success:
        {
            backgroundColor: '{colors.semantic-success-bg}',
            textColor: '{colors.semantic-success}',
            rounded: '{rounded.md}',
            padding: '{spacing.md} {spacing.lg}',
        }
    alert-warning:
        {
            backgroundColor: '{colors.semantic-warning-bg}',
            textColor: '{colors.semantic-warning}',
            rounded: '{rounded.md}',
            padding: '{spacing.md} {spacing.lg}',
        }
    alert-error:
        {
            backgroundColor: '{colors.semantic-error-bg}',
            textColor: '{colors.semantic-error}',
            rounded: '{rounded.md}',
            padding: '{spacing.md} {spacing.lg}',
        }
    table-base:
        {
            backgroundColor: '{colors.canvas}',
            textColor: '{colors.ink}',
            typography: '{typography.body-sm}',
            rounded: '{rounded.md}',
            border: '1px solid {colors.hairline}',
        }
    table-row:
        {
            backgroundColor: '{colors.canvas}',
            textColor: '{colors.ink}',
            padding: '{spacing.md} {spacing.lg}',
            border: '1px solid {colors.hairline}',
        }
    navigation:
        {
            backgroundColor: '{colors.canvas}',
            textColor: '{colors.ink}',
            border: '1px solid {colors.hairline}',
            minHeight: '64px',
        }
    hero-section:
        {
            backgroundColor: '{colors.surface}',
            textColor: '{colors.ink}',
            padding: '{spacing.hero} {spacing.xxl}',
        }
    footer-region:
        {
            backgroundColor: '{colors.surface}',
            textColor: '{colors.ink-secondary}',
            typography: '{typography.body-sm}',
            padding: '{spacing.section} {spacing.xxl}',
        }

elevation:
    level-0: 'none'
    level-1: '0 1px 2px rgba(11,31,26,0.06), 0 1px 1px rgba(11,31,26,0.04)'
    level-2: '0 8px 24px rgba(11,31,26,0.10), 0 2px 6px rgba(11,31,26,0.05)'
    level-3: '0 20px 48px rgba(11,31,26,0.18), 0 8px 16px rgba(11,31,26,0.08)'
---

# Design System — Confirma

## Overview

**Produto:** Confirma, plataforma B2B para confirmação de agendamentos via WhatsApp.  
**Público e propósito:** desenvolvedores que integram sistemas de gestão de clínicas e precisam delegar envio, respostas e notificações.  
**Superfícies:** landing institucional, painel web e documentação técnica.  
**Direção visual:** uma interface clara, precisa e acolhedora, ancorada no verde da marca e no símbolo de conversa com check.

A identidade parte dos assets existentes: verde `#0A7F50`, verde-noite `#0B1F1A`, névoa `#F3F7F5` e menta `#3DDC97`. O símbolo combina balão arredondado e check; esse contraste entre conversa e confirmação orienta uma linguagem de formas simples, cantos moderados e sinais de estado claros. A tipografia usa uma escala editorial legível, com títulos compactos e corpo confortável. Superfícies e bordas organizam o conteúdo sem depender de efeitos decorativos.

### Key Characteristics

- Verde da marca reservado para ações principais, foco e elementos de identidade.
- Verde-noite para texto de alta ênfase e superfícies escuras pontuais.
- Geometria de cantos moderados, inspirada no contorno do balão da marca.
- Hierarquia tipográfica e espaçamento generosos na landing; densidade funcional no painel e leitura linear na documentação.

## Colors

### Brand & Primary

- **Primary** (`{colors.primary}`): verde do símbolo e das ações principais. Texto branco sobre esta cor atende contraste AA para texto normal.
- **Primary pressed** (`{colors.primary-pressed}`): estado pressionado mais escuro, mantendo contraste com branco.
- **Secondary** (`{colors.secondary}`): verde-claro para ações secundárias discretas e seleções; usa texto verde-noite.
- **Links** (`{colors.link}`): verde escurecido para links em fundo claro, com sublinhado ou indicador não cromático em estados interativos.
- **Acentos:** `{colors.accent-mint}` retoma a menta do conjunto de marca para ilustrações e pequenos destaques; `{colors.accent-amber}` destaca informação pontual. Nenhum substitui a cor primária de ação.

### Surfaces & Borders

- **Canvas** (`{colors.canvas}`): fundo padrão das aplicações e áreas de leitura.
- **Surface** (`{colors.surface}`): névoa de marca para agrupamentos, faixas e áreas de apoio.
- **Surface soft / strong** (`{colors.surface-soft}`, `{colors.surface-strong}`): separação sutil e fundos de controle desabilitado, respectivamente.
- **Hairlines** (`{colors.hairline}`, `{colors.hairline-strong}`): divisores e bordas de controles; reforçar a borda em campos editáveis.

### Text

- **Primary** (`{colors.ink}`): texto principal em verde-noite.
- **Secondary** (`{colors.ink-secondary}`): texto de apoio e rótulos de navegação.
- **Muted** (`{colors.ink-muted}`): metadados e instruções auxiliares; evitar em texto pequeno sobre fundos coloridos sem verificação de contraste.
- **On dark** (`{colors.on-dark}`, `{colors.on-dark-muted}`): texto principal e secundário em superfícies escuras da marca.

### Semantic

- **Success** (`{colors.semantic-success}`): sucesso, confirmação e estado positivo, com fundo `{colors.semantic-success-bg}`.
- **Warning** (`{colors.semantic-warning}`): atenção e estados pendentes, com fundo `{colors.semantic-warning-bg}`.
- **Error** (`{colors.semantic-error}`): erro e ação destrutiva, com fundo `{colors.semantic-error-bg}`.
- **Info** (`{colors.semantic-info}`): orientação informativa, com fundo `{colors.semantic-info-bg}`.

### Color Rules

- Verde primário expressa ação ou identidade; não deve colorir grandes áreas de conteúdo por padrão.
- Fundos coloridos usam texto da respectiva cor semântica escura. Não usar branco sobre menta ou âmbar.
- Não comunicar estado apenas pela cor: incluir rótulo, ícone ou texto e manter contraste WCAG AA para texto normal (4,5:1) e grande (3:1).
- A paleta semântica tem função de estado e não cria uma segunda identidade de marca.

## Typography

### Font Family

**Principal:** Inter, com fallbacks `"Segoe UI", system-ui, -apple-system, sans-serif`.  
**Monoespaçada:** `"SFMono-Regular", Consolas, "Liberation Mono", monospace` para trechos de código, chaves, rotas e valores técnicos.

Inter oferece leitura consistente em interfaces web sem depender de uma fonte proprietária. Títulos usam pesos semibold e leve tracking negativo; o texto de interface permanece regular. A fonte monoespaçada fica restrita a conteúdo técnico.

### Hierarchy

| Token                         | Tamanho | Peso | Entrelinha | Tracking | Uso                                                        |
| ----------------------------- | ------: | ---: | ---------: | -------: | ---------------------------------------------------------- |
| `{typography.hero-display}`   |    56px |  600 |       1.05 |   -1.8px | Título principal da landing; reduzir responsivamente.      |
| `{typography.display-lg}`     |    40px |  600 |       1.12 |   -1.2px | Abertura de seção institucional.                           |
| `{typography.heading-1}`      |    32px |  600 |        1.2 |   -0.8px | Título de página.                                          |
| `{typography.heading-2}`      |    24px |  600 |        1.3 |   -0.4px | Título de seção.                                           |
| `{typography.heading-3}`      |    20px |  600 |       1.35 |   -0.2px | Título de card ou subseção.                                |
| `{typography.heading-4}`      |    16px |  600 |        1.4 |        0 | Título compacto e grupos de formulário.                    |
| `{typography.subtitle}`       |    18px |  400 |       1.55 |        0 | Introdução, descrição de seção ou lead.                    |
| `{typography.body-md}`        |    15px |  400 |       1.55 |        0 | Corpo padrão do painel e da documentação.                  |
| `{typography.body-md-medium}` |    15px |  600 |        1.5 |        0 | Ênfase curta dentro do corpo.                              |
| `{typography.body-sm}`        |    14px |  400 |        1.5 |        0 | Navegação, controles e texto secundário.                   |
| `{typography.caption}`        |    12px |  500 |        1.4 |        0 | Legendas e metadados; não usar para instruções essenciais. |
| `{typography.button-md}`      |    14px |  600 |        1.2 |        0 | Rótulos de botões.                                         |

### Principles

- A escala separa títulos por tamanho, peso e espaço antes/depois; evitar vários níveis em um mesmo bloco curto.
- Corpo em 15px ou maior nas tarefas centrais; documentação pode usar largura de leitura limitada para reduzir linhas longas.
- Aplicar peso semibold para hierarquia, sem transformar parágrafos em blocos pesados. Evitar caixa alta extensa.

## Layout

### Spacing System

- **Unidade-base:** 4px, com passos principais de 8px.
- **Escala:** `{spacing.xxs}` 2px, `{spacing.xs}` 4px, `{spacing.sm}` 8px, `{spacing.md}` 12px, `{spacing.lg}` 16px, `{spacing.xl}` 24px, `{spacing.xxl}` 32px, `{spacing.xxxl}` 48px, `{spacing.section-sm}` 64px, `{spacing.section}` 80px, `{spacing.section-lg}` 96px e `{spacing.hero}` 112px.
- **Ritmo:** usar 8–24px entre elementos relacionados, 32–48px entre grupos e 64–112px entre seções institucionais. No painel, preferir intervalos de 16–32px.

### Grid & Container

- **Largura máxima:** 1200px para landing; 1120px para painel; 760px para coluna principal da documentação.
- **Margens laterais:** mínimo 24px em desktop e 16px em telas estreitas.
- **Grade:** até 12 colunas na landing, com gaps de 24px; painel usa coluna lateral e área principal quando houver espaço; documentação combina navegação lateral, conteúdo e índice contextual em telas largas.
- **Variações:** compartilhar largura, cor, tipografia e componentes. Landing usa composições abertas; painel prioriza agrupamentos e densidade moderada; documentação privilegia largura de leitura e blocos de código.

### Whitespace Philosophy

Espaço em branco separa contexto, ações e conteúdo. Na landing, reservar respiro generoso ao redor do título e das seções. No painel, manter a informação visível sem comprimir controles. Na documentação, separar texto, exemplos e navegação sem interromper a leitura.

## Elevation & Depth

| Nível       | Tratamento                                                       | Uso                                    |
| ----------- | ---------------------------------------------------------------- | -------------------------------------- |
| 0 — plano   | sem sombra; canvas e borda `{colors.hairline}` quando necessário | página, seção e controles comuns       |
| 1 — sutil   | `{elevation.level-1}`                                            | card sobre canvas e barra de navegação |
| 2 — card    | `{elevation.level-2}`                                            | menu, popover e superfície flutuante   |
| 3 — overlay | `{elevation.level-3}`                                            | diálogo sobre scrim neutro             |

### Decorative Depth

Profundidade deve indicar sobreposição, não decorar. Preferir borda e diferença tonal antes de sombra. Gradientes não são parte obrigatória da marca; quando usados em ilustração institucional, devem ser discretos e derivados de verde e menta, sem reduzir a legibilidade.

## Shapes

### Border Radius Scale

| Token            |  Valor | Uso                                         |
| ---------------- | -----: | ------------------------------------------- |
| `{rounded.xs}`   |    4px | pequenos indicadores e recortes             |
| `{rounded.sm}`   |    6px | código inline e controles compactos         |
| `{rounded.md}`   |    8px | botões, campos e tabs                       |
| `{rounded.lg}`   |   12px | cards e alertas                             |
| `{rounded.xl}`   |   16px | agrupamentos destacados ou mockups          |
| `{rounded.full}` | 9999px | badges em formato cápsula e avatar circular |

### Geometry Principles

Cantos moderados ecoam o balão arredondado do símbolo. Botões e campos não são cápsulas; o formato completo fica restrito a indicadores compactos. Bordas são finas e neutras. Usar formas do símbolo original em aplicações de marca sem redesenhar ou distorcer o logo.

## Components

### Buttons

**`button-primary`** — ação principal de uma região. Fundo `{colors.primary}`, texto `{colors.on-primary}`, `{typography.button-md}`, raio `{rounded.md}`, padding `12px 18px` e altura mínima de 44px. O estado pressionado usa `{colors.primary-pressed}`; o desabilitado usa `{colors.surface-strong}` com `{colors.ink-muted}`.

**`button-secondary`** — ação alternativa sobre fundo `{colors.secondary}`, texto `{colors.on-secondary}`, borda `{colors.hairline}` e as mesmas dimensões da ação primária.

**`button-ghost` / `button-link`** — ações de baixa ênfase; fundo transparente, área de clique confortável e indicador de foco visível.

**`button-destructive`** — ação irreversível ou destrutiva; usa `{colors.semantic-error}` e texto branco. Não usar como ação primária cotidiana.

### Cards & Containers

**`card-base`** — agrupamento de conteúdo sobre canvas, raio `{rounded.lg}`, padding `{spacing.xl}`, borda `{colors.hairline}` e elevação 1. **`card-feature`** é uma superfície `{colors.surface}` com padding `{spacing.xxl}`, para destacar uma capacidade ou bloco institucional. Não usar cartões aninhados sem necessidade hierárquica.

### Inputs & Forms

**`text-input`** — fundo canvas, texto `{colors.ink}`, `{typography.body-md}`, raio `{rounded.md}`, 44px de altura e borda `{colors.hairline-strong}`. Em foco, borda primária e anel de 3px; em erro, borda semântica e mensagem textual associada. Labels usam `{typography.body-md-medium}`; ajuda usa `{typography.body-sm}`. Inputs de senha e selects mantêm a mesma geometria. Checkbox usa o acento primário e um alvo clicável acessível.

### Tabs & Navigation Controls

**`tab` / `tab-active`** — rótulos em `{typography.body-sm}`; ativo com fundo secundário ou indicador de borda inferior, sem depender apenas de mudança de cor. Navegação usa canvas, texto de alta ênfase e borda inferior discreta.

### Badges & Status

**`badge-neutral`**, **`badge-success`**, **`badge-warning`** e **`badge-error`** apresentam estados curtos com fundo e texto semânticos, raio `{rounded.full}` e padding `4px 9px`. O rótulo permanece explícito; cor sozinha não representa estado.

### Tables & Data Display

**`table-base` / `table-row`** — texto `{typography.body-sm}`, bordas horizontais finas e padding vertical de 12px. Cabeçalhos devem ser distinguíveis por peso e alinhamento; dados técnicos podem usar fonte monoespaçada sem alterar o texto geral.

### Navigation

**`navigation`** — barra de navegação clara com altura mínima de 64px e divisor neutro. Landing e documentação podem compartilhar links no cabeçalho; o painel pode usar navegação lateral em desktop. A estrutura não altera tokens da marca.

### Feedback

Alertas informativos, positivos, de atenção e erro usam as respectivas superfícies semânticas e texto escuro. Loading usa indicador simples acompanhado de rótulo quando a espera não for imediata. Empty state usa título, explicação curta e, quando houver, uma ação relacionada. Dialog usa elevação 3, fundo canvas, raio `{rounded.lg}` e scrim neutro; foco deve permanecer perceptível.

### Signature Components

**`hero-section`** — título `{typography.hero-display}`, texto de apoio `{typography.subtitle}` e espaço `{spacing.hero}` em desktop; composição pode usar mockup de produto e o logo oficial. **`footer-region`** usa superfície de névoa, texto secundário e links agrupados. Exemplos de código na documentação usam bloco de alto contraste moderado, fonte monoespaçada e realce pontual em verde.

## Imagery & Iconography

- **Ícones:** traço simples, espessura visual uniforme e tamanho alinhado à tipografia; priorizar conjunto consistente. O símbolo do Confirma fica reservado à marca.
- **Ilustrações e fotografia:** preferir diagramas de integração e imagens de produto que expliquem o fluxo; evitar banco de imagens genérico e elementos clínicos que sugiram uso com dados reais.
- **Mockups:** apresentar interfaces reais ou esquemáticas em moldura neutra e com proporção preservada; não inventar métricas ou telas que impliquem funcionalidades ausentes.
- **Decoração:** usar acentos menta com parcimônia. O logo mantém os SVGs aprovados e suas variações claras/escuras.

## Do's and Don'ts

### Do

- Manter o verde da marca para ações principais e foco, com texto de alto contraste.
- Usar escala tipográfica e espaçamento consistentes nas três superfícies.
- Explicar estados com rótulo e sinal visual redundante.

### Don't

- Criar uma paleta independente para landing, painel ou documentação.
- Aplicar menta como fundo de botão com texto branco ou usar sombras para decorar.
- Alterar proporções, cores internas ou geometria dos logos existentes.

## Responsive Behavior

### Breakpoints

| Nome            |        Largura | Mudanças principais                                               |
| --------------- | -------------: | ----------------------------------------------------------------- |
| Mobile compacto |      até 479px | uma coluna; margens 16px; título de destaque reduzido             |
| Mobile amplo    |      480–767px | uma coluna; ações podem ficar lado a lado quando couberem         |
| Tablet          |     768–1023px | grade de 2 colunas quando o conteúdo permitir; navegação compacta |
| Desktop         |    1024–1439px | composição completa; navegação lateral disponível no painel/docs  |
| Desktop amplo   | 1440px ou mais | limitar largura de leitura; não esticar texto ou controles        |

### Touch Targets

- **Alvo mínimo:** 44×44px para controles acionáveis.
- **Altura de controle:** 44px como padrão.
- **Controles adjacentes:** manter ao menos 8px de separação.

### Collapsing Strategy

- **Navegação:** recolher navegação lateral em menu compacto; preservar acesso ao título e à localização atual.
- **Grades/cards:** reduzir colunas progressivamente até uma coluna.
- **Tabelas e dados densos:** permitir rolagem horizontal contida ou reorganizar em linhas rotuladas; preservar todos os campos.
- **Tipografia:** reduzir hero-display para 40px em tablet e 32px em mobile; manter corpo em 14px ou maior.
- **Overlays:** manter margem mínima de 16px, altura limitada à viewport e rolagem interna quando necessário.

### Image Behavior

- Preservar proporção dos logos e ilustrações; não esticar SVGs.
- Reduzir mockups em telas estreitas ou substituir por recorte que preserve o conteúdo explicativo.

## Interaction & Accessibility

- **Foco:** indicador persistente de 3px com contraste visível; não remover outline sem substituição.
- **Estados:** hover, pressed, selecionado, inválido e desabilitado devem ter sinais próprios e legíveis.
- **Movimento:** transições curtas de até 200ms; respeitar `prefers-reduced-motion` e remover movimento não essencial.
- **Contraste:** WCAG AA para texto e controles essenciais; validar pares semânticos e não confiar apenas em cor.
- **Feedback:** erros devem identificar o campo e sugerir correção; sucesso deve ser anunciado por texto visível e, quando aplicável, por região acessível.

## Iteration Guide

1. Consulte o contexto de produto, os assets e este documento antes de alterar a linguagem visual.
2. Reutilize tokens e componentes; mantenha a mesma identidade nas três aplicações.
3. Atualize os tokens estruturados e a documentação juntos quando uma decisão mudar.
4. Verifique responsividade, contraste, teclado e estados de interação ao implementar interfaces.

## Known Gaps

- As especificações funcionais por aplicação estão em `docs/design/apps/landing/ui.md`, `docs/design/apps/web/ui.md` e `docs/design/apps/documentation/ui.md`; este documento permanece a referência das decisões visuais compartilhadas.
