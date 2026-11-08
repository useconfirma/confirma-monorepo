# Painel do Confirma

Painel web do Confirma, construído com React, TypeScript, Vite, TanStack Router,
TanStack Query e Tailwind CSS. Este arquivo resume onde cada parte vive e como
iniciar a aplicação.

## Entrada da aplicação

A aplicação inicia em:

```text
src/main.tsx
```

Esse arquivo cria o router a partir de `routeTree.gen.ts`, envolve a árvore no
`QueryProvider` e no `ToastProvider` e injeta o `queryClient` no contexto do
router, disponível em `beforeLoad` e `loader` de todas as rotas.

A rota raiz fica em:

```text
src/routes/__root.tsx
```

Ali são importados os estilos globais, definido o redirecionamento de rotas
inexistentes para `/sign-in` e renderizado o `HeadContent`, que aplica ao
documento o título definido em `head` por cada rota de página. O título da rota
raiz é o padrão; o da rota mais interna prevalece.

## Organização das pastas

```text
public/                      # logos e favicon servidos estaticamente
src/
├── routes/                  # rotas baseadas em arquivos do TanStack Router
├── features/                # telas por contexto de negócio
│   ├── auth/                # convites, aceite de convite e login
│   ├── accounts/            # boas-vindas e visão geral da account
│   └── integrations/        # API Key, webhook, janela de envio e Z-API
├── shared/                  # recursos usados por mais de uma feature
│   ├── @types/              # tipos gerados a partir do OpenAPI da API
│   ├── api/                 # chamadas HTTP compartilhadas
│   ├── components/          # layouts, componentes de UI e de página
│   ├── hooks/               # queries e mutations compartilhadas
│   ├── lib/                 # cliente HTTP e utilitários de cache, erro e Tailwind
│   └── providers/           # QueryProvider e ToastProvider
├── main.tsx
└── styles.css               # tema Tailwind com os tokens da marca
```

Cada feature segue, quando aplicável, estas pastas:

- `api/`: funções que chamam a API com o `apiClient`, tipadas por `paths`;
- `hooks/`: queries, mutations e integração com formulários;
- `schemas/`: schemas Zod dos formulários;
- `components/`: componentes da tela;
- `screens/`: componente da página, usado pela rota;
- `constants/`: valores fixos da feature, quando necessários;
- `utils/`: funções auxiliares puras da feature, quando necessárias.

## Rotas

As rotas são geradas a partir de `src/routes/` pelo plugin do TanStack Router
no Vite. O arquivo `src/routeTree.gen.ts` é gerado automaticamente e não deve
ser editado. Arquivos `layout.tsx` definem o layout de um grupo de rotas
(`routeToken: 'layout'`).

### `_auth`

Rotas públicas, renderizadas no `AuthLayout`:

- `/sign-in`: login;
- `/request-invitation`: solicitação de convite;
- `/invitations/$invitationToken`: verificação e aceite de convite.

### `_protected`

O `beforeLoad` consulta o usuário atual. Sem sessão válida, redireciona para
`/sign-in`; com sessão, deixa o usuário no cache do TanStack Query e no
contexto das rotas filhas.

- `/welcome`: boas-vindas após a criação da conta.

### `_protected/_account`

O `loader` carrega a account atual antes de renderizar o `AccountLayout`, com
sidebar, cabeçalho e breadcrumb.

- `/overview`: visão geral da account e do estado da integração;
- `/api-key`: geração de API Key, com confirmação e exibição única;
- `/webhook`: configuração do webhook;
- `/send-window`: configuração da janela de envio;
- `/integrations`: configuração da Z-API.

A navegação da sidebar e do breadcrumb vem de uma única fonte:

```text
src/shared/components/layout/account/account-navigation-items.ts
```

## Comunicação com a API

O cliente HTTP fica em `src/shared/lib/api-client.ts`. Ele usa
`VITE_API_URL` (padrão `http://localhost:8080`) e envia cookies em todas as
requisições (`withCredentials`), pois a sessão é um JWT no cookie HttpOnly
`confirma_session` gravado pela API. O painel não lê nem armazena o token.

Os tipos de requisição e resposta vêm de `src/shared/@types/api.d.ts`, gerado
a partir do OpenAPI da API em execução. Depois de uma mudança de contrato na
API, regenere os tipos:

```bash
pnpm --filter @confirma/panel generate:types
```

## Estado do servidor: cache first

O painel trata o cache do TanStack Query como a fonte dos dados da tela. Cada
dado é buscado na API uma vez e, a partir daí, só muda pelo próprio painel.
O objetivo é evitar novas buscas sempre que possível.

O `QueryProvider` sustenta esse padrão:

- `staleTime: 'static'`: dados em cache nunca ficam obsoletos, então
  montar uma tela ou navegar de volta não dispara nova busca;
- `refetchOnWindowFocus: false`: voltar à aba não refaz a busca;
- `retry: false`: falhas não são repetidas automaticamente;
- `gcTime` de 5 minutos: uma query sem nenhuma tela usando é removida do
  cache e buscada de novo quando uma tela voltar a precisar dela.

O ciclo de um dado é:

1. **Carregamento:** o `beforeLoad` ou o `loader` da rota chama
   `context.queryClient.query(queryOptions)`. Se o dado já está em cache, ele
   é devolvido sem chamar a API.
2. **Leitura:** a screen usa o hook com as mesmas `queryOptions` e lê o mesmo
   cache.
3. **Alteração:** depois de uma mutation, o `onSuccess` grava a resposta da
   API no cache com `updateQueryCache`
   (`src/shared/lib/update-query-cache.ts`). As queries não são invalidadas
   e nada é buscado de novo.
4. **Descarte:** no logout, o cache inteiro é limpo com `queryClient.clear()`
   depois da saída das rotas protegidas.

As queries usadas por mais de uma tela, como usuário atual e account, ficam em
`src/shared/hooks/` e exportam a chave e as `queryOptions`, reutilizadas pelos
loaders e pelas mutations que atualizam o cache.

Valores sensíveis que a API mostra uma única vez, como uma API Key recém-gerada,
ficam apenas no resultado da mutation e nunca são gravados no cache.

## Estilos e componentes

Os estilos usam Tailwind CSS 4. O tema em `src/styles.css` define as cores a
partir de `docs/product/assets/tokens.json` e a tipografia do painel.

Componentes de UI reutilizáveis ficam em `src/shared/components/ui/`, montados
sobre Radix UI e `tailwind-variants`. Ícones vêm de `lucide-react`. Logos e
favicon ficam em `public/`.

Toasts usam Sonner. O `ToastProvider` monta o `Toaster` com o visual do
painel: folha Noite no canto inferior direito, ícone e texto indicando o
estado (Menta para sucesso, Coral para erro, Âmbar para alerta). Para exibir
um toast, importe `toast` de `sonner`.

## Variáveis de ambiente

- `VITE_API_URL`: URL base da API, lida no build. Opcional; usa
  `http://localhost:8080` quando ausente.

## Comandos do pacote

```bash
pnpm --filter @confirma/panel dev              # servidor local na porta 3000
pnpm --filter @confirma/panel build
pnpm --filter @confirma/panel preview
pnpm --filter @confirma/panel typecheck        # gera as rotas e roda o tsc
pnpm --filter @confirma/panel generate-routes
pnpm --filter @confirma/panel generate:types   # requer a API em execução
```

Na raiz do monorepo, `pnpm check` executa lint, typecheck, testes e verificação
de formatação.

## Docker

O `Dockerfile` usa a raiz do monorepo como contexto. Ele gera o `dist/` (com
os arquivos de `public/`) e o serve com Nginx, configurado em `nginx.conf` com
gzip, cache longo para `/assets/`, fallback de SPA para `index.html` e
cabeçalhos básicos de segurança.

`VITE_API_URL` é embutida no bundle, por isso é informada no build:

```bash
docker build -f apps/panel/Dockerfile --build-arg VITE_API_URL=https://api.exemplo.com -t confirma-panel .
docker run -p 3000:80 confirma-panel
```
