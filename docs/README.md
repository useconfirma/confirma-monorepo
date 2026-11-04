# Documentação do projeto

Este diretório centraliza as especificações globais do Confirma, as especificações funcionais das interfaces por aplicação e os protótipos visuais.

- `specs/`: documentação funcional e de negócio
- `design/`: protótipos visuais, assets e tokens de interface

## Estrutura atual

```text
docs/
├── README.md
├── specs/
│   ├── overview.md
│   ├── domain.md
│   ├── api.md
│   └── design.md
└── design/
    ├── apps/
    │   ├── documentation/
    │   │   ├── ui.md
    │   │   ├── index.html
    │   │   ├── main.js
    │   │   └── styles.css
    │   ├── landing/
    │   │   ├── ui.md
    │   │   ├── index.html
    │   │   ├── main.js
    │   │   └── styles.css
    │   └── web/
    │       ├── ui.md
    │       ├── index.html
    │       ├── main.js
    │       └── styles.css
    └── assets/
        ├── confirma-icone-app.svg
        ├── confirma-logo-branco.svg
        ├── confirma-logo-noite.svg
        ├── confirma-logo-verde.svg
        ├── confirma-simbolo-noite.svg
        ├── confirma-simbolo-verde.svg
        └── tokens.json
```

## Descrição das pastas

### `specs/`

Contém as especificações globais de produto, domínio, API e identidade visual.

- `overview.md`: visão geral do produto, público, problema, proposta de valor e critérios do MVP.
- `domain.md`: atores, entidades, regras de negócio e casos de uso.
- `api.md`: contratos, endpoints e regras de integração da API.
- `design.md`: Design System compartilhado pelas aplicações.

### `design/`

Contém as especificações funcionais de interface por aplicação, os protótipos visuais e os assets compartilhados.

- `apps/web/ui.md`: páginas, fluxos e interações do painel central.
- `apps/landing/ui.md`: página institucional e solicitação de acesso ao Beta.
- `apps/documentation/ui.md`: páginas e navegação do portal técnico.
- `apps/<aplicação>/index.html`, `main.js` e `styles.css`: protótipos visuais da aplicação correspondente.
- `assets/`: logos, ícones e tokens compartilhados.

## Como usar essa estrutura

1. Consulte `docs/specs/overview.md` para entender o produto.
2. Consulte `docs/specs/domain.md` para regras e casos de uso.
3. Consulte `docs/specs/api.md` para os contratos HTTP.
4. Leia `docs/specs/design.md` para o Design System compartilhado.
5. Consulte `docs/design/apps/<aplicação>/ui.md` para os comportamentos funcionais daquela aplicação.
6. Acesse `docs/design/apps/<aplicação>/` para os protótipos existentes.

## Observações

- `docs/specs/` contém requisitos, domínio, contratos e Design System global.
- Cada `docs/design/apps/<aplicação>/ui.md` especifica somente o comportamento funcional da aplicação.
- Os arquivos HTML, CSS e JavaScript são protótipos; não substituem as especificações funcionais.
