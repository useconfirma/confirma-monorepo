# Documentação do projeto

Este diretório centraliza as especificações globais do Confirma: produto, domínio e contratos de API, além dos assets de marca.

- `specs/`: documentação funcional e de negócio
- `product/assets/`: logos, símbolos, ícone do app e tokens de marca

## Estrutura atual

```text
docs/
├── README.md
├── product/
│   └── assets/
│       ├── confirma-icone-app.svg
│       ├── confirma-logo-branco.svg
│       ├── confirma-logo-noite.svg
│       ├── confirma-logo-verde.svg
│       ├── confirma-simbolo-noite.svg
│       ├── confirma-simbolo-verde.svg
│       └── tokens.json
└── specs/
    ├── overview.md
    ├── domain.md
    └── api.md
```

## Descrição das pastas

### `specs/`

Contém as especificações globais de produto, domínio e API.

- `overview.md`: visão geral do produto, público, problema, proposta de valor e critérios do MVP.
- `domain.md`: atores, entidades, regras de negócio e casos de uso.
- `api.md`: contratos, endpoints e regras de integração da API.

### `product/assets/`

Contém os assets de marca do Confirma.

- `confirma-logo-branco.svg`, `confirma-logo-noite.svg`, `confirma-logo-verde.svg`: logotipo em três variações de cor.
- `confirma-simbolo-noite.svg`, `confirma-simbolo-verde.svg`: símbolo isolado.
- `confirma-icone-app.svg`: ícone do aplicativo (símbolo branco sobre fundo verde).
- `tokens.json`: paleta de cores da marca (marca, apoio e acentos).

## Como usar essa estrutura

1. Consulte `docs/specs/overview.md` para entender o produto.
2. Consulte `docs/specs/domain.md` para regras e casos de uso.
3. Consulte `docs/specs/api.md` para os contratos HTTP.
4. Consulte `docs/product/assets/` para logos, ícones e a paleta de marca.

## Observações

- `docs/specs/` contém requisitos, domínio e contratos.
- `docs/product/assets/` contém apenas assets e tokens de marca; não é uma especificação de interface.
- Design System, protótipos e especificações de interface (`ui.md`) não fazem parte da documentação atual.
