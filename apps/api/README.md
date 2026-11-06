# API do Confirma

API HTTP do Confirma, construída com Express, TypeScript, Prisma e PostgreSQL.
Este arquivo resume onde cada parte vive e como iniciar o serviço.

## Entrada da aplicação

O processo inicia em:

```text
src/shared/infrastructure/http/server.ts
```

Esse arquivo carrega o `.env`, valida as variáveis, importa o `app` e chama
`app.listen`.

O `app` é montado em:

```text
src/shared/infrastructure/http/app.ts
```

Ali são configurados CORS, JSON, cookies, OpenAPI, Swagger, rotas e o
middleware de erros.

## Organização das pastas

```text
src/
├── modules/                 # módulos por contexto de negócio
│   ├── auth/                # convites, login e autenticação
│   ├── accounts/            # leitura da account atual
│   ├── integrations/        # API Key, webhook, janela e Z-API
│   ├── appointments/        # reservado para o fluxo de agendamentos
│   └── webhooks/            # reservado para eventos e entregas
└── shared/                  # recursos compartilhados pela API
    ├── domain/              # erros e contratos de providers
    └── infrastructure/      # HTTP, Prisma, ambiente e adapters
```

Cada módulo segue, quando aplicável, três camadas:

- `domain/`: modelos, contratos de repositories/providers e erros do domínio;
- `application/`: casos de uso e suas regras de orquestração;
- `infrastructure/`: controllers, rotas, schemas Zod e implementações Prisma.

## Módulos

### `auth`

Fluxos de convite, criação de conta, login, logout e consulta do usuário atual.

- rotas: `modules/auth/infrastructure/http/routes/auth.routes.ts`;
- controllers: `modules/auth/infrastructure/http/controllers/`;
- casos de uso: `modules/auth/application/usecases/`;
- repositories Prisma: `modules/auth/infrastructure/repositories/prisma/`;
- schemas de entrada/saída: `modules/auth/infrastructure/schemas/zod/`.

As rotas usam JWT em cookie HttpOnly. O middleware de autenticação valida o
token e consulta o usuário no repository Prisma.
No cadastro, a resposta contém apenas o ID e e-mail do usuário e o ID e nome
da account.

### `accounts`

Expõe `GET /account`, protegido por autenticação e autorização da account.
O controller usa o caso de uso e o repository Prisma para retornar a account e
seus blocos de configuração sem expor segredos.

### `integrations`

Expõe as configurações de janela de envio, webhook, Z-API e geração de API Key.
As rotas são protegidas por autenticação e autorização. Os controllers ainda
possuem respostas mockadas; os casos de uso e contratos já estão separados.

### `appointments` e `webhooks`

As pastas existem como preparação para o processamento de agendamentos e a
entrega de eventos. Ainda não possuem rotas ou implementação funcional.

## Infraestrutura compartilhada

`src/shared` reúne capacidades transversais, usadas por mais de um módulo ou
necessárias à composição da aplicação. Contratos ficam no domínio consumidor
ou em `shared/domain` quando já forem comuns; implementações de bibliotecas,
serviços externos e HTTP ficam em `shared/infrastructure`.

Para criar um provider, defina primeiro uma interface pequena, implemente-a no
adapter compartilhado, traduza falhas externas para `AppError` e injete a
implementação no caso de uso. O caso de uso nunca deve depender do SDK ou da
classe concreta.

Regras de negócio, models, repositories, casos de uso e schemas específicos
permanecem dentro do módulo dono do domínio. Não use `shared` para antecipar
abstrações ou guardar utilitários sem consumidores reais.

## Banco de dados

Schema e migrations ficam em:

```text
prisma/schema.prisma
prisma/migrations/
```

O Prisma usa `prisma.config.ts` e `DATABASE_URL` para localizar o PostgreSQL.

Comandos úteis:

```bash
pnpm --filter @confirma/api prisma:generate
pnpm --filter @confirma/api exec prisma migrate dev
pnpm --filter @confirma/api exec prisma migrate deploy
```

## Variáveis de ambiente

Use `apps/api/.env.example` como referência. As principais variáveis são:

- `DATABASE_URL`;
- `JWT_SECRET`;
- `RESEND_API_KEY`;
- `RESEND_FROM_EMAIL`;
- `PUBLIC_APP_URL`;
- `PORT` e `NODE_ENV`.

Segredos não devem ser commitados.

## Comandos do pacote

```bash
pnpm --filter @confirma/api dev
pnpm --filter @confirma/api build
pnpm --filter @confirma/api start
pnpm --filter @confirma/api typecheck
pnpm --filter @confirma/api test
```

Na raiz do monorepo, `pnpm check` executa lint, typecheck, testes e verificação
de formatação.

## Documentação HTTP

Com a API em execução:

- OpenAPI: `GET /openapi.json`;
- Swagger UI: `GET /docs`.

Cada controller registra seu contrato no `OpenAPIRegistry` compartilhado. As
rotas apenas compõem os handlers e middlewares. Os DTOs de resposta são
construídos nos controllers, com os campos públicos de cada operação.
