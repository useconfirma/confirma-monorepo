# Guia de desenvolvimento da API

Este arquivo complementa o `AGENTS.md` da raiz. Ele descreve os padrões
específicos de `apps/api` para que novos módulos sejam construídos de forma
consistente.

## Fontes de verdade

Antes de mudar comportamento, consulte:

- `docs/specs/overview.md`: escopo do produto e do Beta;
- `docs/specs/domain.md`: entidades, regras e estados;
- `docs/specs/api.md`: contratos HTTP;
- código e testes existentes: detalhes técnicos já adotados.

Não invente endpoints, estados ou regras que não estejam especificados.

## Estrutura da API

```text
apps/api/
├── src/
│   ├── modules/                 # contextos de negócio
│   └── shared/                  # recursos realmente transversais
├── prisma/                      # schema e migrations
├── prisma.config.ts
├── vitest.config.ts
└── package.json
```

A aplicação inicia em:

```text
src/shared/infrastructure/http/server.ts
```

O `server.ts` carrega o ambiente e chama `listen`. O Express é montado em
`src/shared/infrastructure/http/app.ts`, que configura middlewares globais,
OpenAPI, Swagger, rotas e tratamento de erros.

## Como criar um módulo

Use um nome de domínio genérico, por exemplo `notifications`:

```text
src/modules/notifications/
├── application/
│   └── usecases/
├── domain/
│   ├── errors/
│   ├── models/
│   ├── providers/
│   └── repositories/
└── infrastructure/
    ├── http/
    │   ├── controllers/
    │   ├── routes/
    │   └── schemas/zod/
    └── repositories/prisma/
```

Crie somente as pastas necessárias ao comportamento solicitado. O módulo deve
ser registrado em `src/shared/infrastructure/http/routes.ts` através de seu
arquivo de rotas.

### `domain/`

Contém contratos e regras que não dependem de Express, Prisma ou bibliotecas
externas:

- `models/`: tipos e entidades do domínio;
- `repositories/`: interfaces consumidas pelos casos de uso;
- `providers/`: interfaces para capacidades externas;
- `errors/`: classes de erro reutilizáveis do módulo, estendendo `AppError`.

Não importe Prisma, Express, Zod ou SDKs externos no domínio.

### `application/usecases/`

Cada caso de uso deve ter uma classe com método `execute`, receber suas
dependências no construtor e concentrar a orquestração do fluxo.

Exemplo genérico:

```ts
export class CreateNotificationUseCase {
    constructor(
        private readonly repository: NotificationRepository,
        private readonly provider: NotificationProvider,
    ) {}

    async execute(input: CreateNotificationInput) {
        // validações e regras do caso de uso
    }
}
```

Regras de negócio pertencem ao caso de uso ou ao domínio, nunca ao controller
ou ao adapter de infraestrutura.

### `infrastructure/http/`

- `schemas/zod/`: validação de entrada e schemas de resposta/OpenAPI;
- `controllers/`: registra o contrato OpenAPI da operação, traduz HTTP para input
  do caso de uso e o resultado para o DTO público da resposta;
- `routes/`: composição das rotas, rate limit e autenticação/autorização.

O controller deve ser fino:

1. validar `req.body`, `req.params` ou `req.query` com `validateData`;
2. chamar o caso de uso;
3. construir o DTO de resposta com campos explícitos e retornar o status do
   contrato. Não repasse models completos do domínio ao HTTP.

Use `body` ou `params` para entradas validadas, `result` para o retorno do
caso de uso e `response` para o DTO enviado ao cliente. Nomeie o DTO como
`<Operação>ResponseDto`. Operações sem corpo retornam `res.status(204).send()`;
operações com corpo retornam `res.status(...).json(response)`.

Exemplo genérico de controller:

```ts
import type { Request, Response } from 'express';
import { openApiRegistry } from '../../../../shared/infrastructure/http/docs/openapi.js';
import { validateData } from '../../../../shared/infrastructure/validation/zod/data-validation.js';
import { createNotificationRequestSchema } from '../../schemas/zod/create-notification.schema.js';
import { createNotificationResponseSchema } from '../../schemas/zod/create-notification.schema.js';

type CreateNotificationResponseDto = {
    notification: { id: string; status: string };
};

openApiRegistry.registerPath({
    method: 'post',
    path: '/notifications',
    tags: ['Notifications'],
    summary: 'Criar notificação',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: createNotificationRequestSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Notificação criada',
            content: {
                'application/json': {
                    schema: createNotificationResponseSchema,
                },
            },
        },
    },
});

const createNotification = new CreateNotificationUseCase(
    notificationRepository,
    notificationProvider,
);

export const createNotificationController = async (
    req: Request,
    res: Response,
) => {
    const body = validateData(req.body, createNotificationRequestSchema);
    const result = await createNotification.execute(body);
    const response: CreateNotificationResponseDto = {
        notification: {
            id: result.id,
            status: result.status,
        },
    };

    return res.status(201).json(response);
};
```

O registro OpenAPI, o DTO e o handler pertencem ao mesmo controller. O
controller projeta os campos públicos, mesmo que `result` contenha campos
internos do domínio ou da persistência.

### Nomes padronizados

Use estes nomes para manter o fluxo legível e uniforme:

| Nome | Conteúdo | Uso |
| --- | --- | --- |
| `body` | corpo validado da requisição | entrada de `POST`, `PUT` e `PATCH` |
| `params` | parâmetros de rota validados | valores de `req.params` |
| `query` | parâmetros de consulta validados | valores de `req.query` |
| `result` | retorno do caso de uso | valor interno antes da resposta HTTP |
| `response` | DTO público da resposta | objeto enviado por `.json(response)` |
| `<Operation>ResponseDto` | tipo do DTO público | declaração local do controller |
| `repository` | contrato de persistência | dependência de caso de uso ou teste |
| `provider` | contrato de serviço externo | dependência de caso de uso ou teste |
| `useCase` | instância do caso de uso em exemplos | unidade que orquestra a operação |
| `<operation>` | instância concreta do caso de uso no controller | nome em camelCase derivado da operação |

Use nomes específicos para valores de domínio (`invitation`, `account`,
`notification`, `user`) e reserve `data`, `value` ou `item` para estruturas
realmente genéricas. Não use `response` para o retorno do caso de uso nem
`result` para o DTO HTTP.

### Cookies e detalhes de transporte HTTP

Cookies, headers e status são detalhes de transporte e pertencem ao
controller ou ao middleware, nunca ao caso de uso. Não crie providers para
envolver `req`/`res`.

- O caso de uso produz o dado de que o transporte precisa, como
  `sessionToken` e `expiresAt`, e o devolve no `result`. Ele não conhece
  cookies nem Express.
- O controller grava o cookie diretamente com `res.cookie(...)` ou o remove
  com `res.clearCookie(...)`, usando as opções do cookie de sessão:
  `httpOnly`, `secure` em produção, `sameSite: 'lax'` e `path: '/'`.
- Middlewares leem cookies diretamente em `req.cookies`, preenchido pelo
  `cookie-parser` configurado em `app.ts`.
- Valores do transporte, como o token, nunca entram no DTO de resposta.

```ts
export const loginController = async (req: Request, res: Response) => {
    const body = validateData(req.body, loginRequestSchema);
    const result = await login.execute(body);

    res.cookie('confirma_session', result.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: result.expiresAt.getTime() - Date.now(),
    });

    return res.status(204).send();
};
```

Não coloque consultas Prisma, regras de negócio ou chamadas diretas de SDK em
controllers.

Os controllers podem construir diretamente suas dependências locais enquanto
não houver uma composição compartilhada definida para o módulo.

### `infrastructure/repositories/prisma/`

Cada repository Prisma implementa uma interface de `domain/repositories`.

Responsabilidades:

- executar queries Prisma;
- preservar transações e constraints do schema;
- validar pré-condições de persistência quando necessário;
- traduzir falhas conhecidas para `AppError` ou erros do domínio;
- retornar os modelos definidos pelo domínio.

Evite `try/catch` genérico. Use consultas condicionais, `updateMany` com
checagem de `count` e transações. Capture uma exceção somente quando for a
única forma segura de traduzir uma falha inevitável do driver.

Quando uma operação envolver várias gravações que precisam ser atômicas, use
`prisma.$transaction`.

## Como usar `shared`

`shared` contém somente capacidades transversais da API. Ele não é um módulo de
negócio e não deve conhecer regras de `auth`, `accounts`, `integrations` ou de
qualquer outro contexto.

### O que deve ir para `shared`

Coloque um recurso em `shared` quando ele for usado por mais de um módulo ou
quando representar infraestrutura transversal da aplicação. Contratos comuns
ficam em `shared/domain`; adapters de bibliotecas, serviços externos e HTTP
ficam em `shared/infrastructure`.

### O que não deve ir para `shared`

Mantenha no módulo qualquer regra, model, repository, caso de uso, schema ou
provider específico de um único domínio. Por exemplo, o contrato de um
provider usado apenas por `auth` continua em `modules/auth/domain/providers/`,
mesmo que sua implementação concreta seja colocada em `shared` por ser uma
integração externa reutilizável.

Antes de mover algo, verifique se há mais de um consumidor real. Não crie
abstrações em `shared` antecipadamente, não use a pasta como depósito de
utilitários genéricos e não mova uma regra de negócio para evitar decidir o
dono correto.

O contrato continua no domínio que o consome quando a capacidade é específica
do módulo. A implementação compartilhada pode importar esse contrato sem
mover a regra para `shared`.

### Como implementar um provider compartilhado

1. Defina a interface no domínio que possui a necessidade. Se a capacidade já
   for transversal, use `shared/domain/providers`; se for específica, mantenha
   o contrato no módulo consumidor.
2. Defina métodos pequenos, orientados ao comportamento, sem expor tipos do
   SDK usado na implementação.
3. Implemente a interface em `shared/infrastructure/providers`, adaptando o SDK
   ou a API externa.
4. Converta falhas do SDK em `AppError` ou em um erro de domínio conhecido
   dentro do provider. Não deixe exceções cruas chegarem ao caso de uso.
5. Injete a implementação no caso de uso a partir do controller ou da
   composição da aplicação. O caso de uso conhece apenas a interface.

Exemplo genérico:

```ts
// domain/providers/notification.provider.ts
export interface NotificationProvider {
    send(input: { recipient: string; message: string }): Promise<void>;
}

// shared/infrastructure/providers/external-notification.provider.ts
export class ExternalNotificationProvider implements NotificationProvider {
    constructor(private readonly client: ExternalClient) {}

    async send(input: { recipient: string; message: string }): Promise<void> {
        try {
            await this.client.sendMessage(input);
        } catch {
            throw new AppError(
                'NOTIFICATION_UNAVAILABLE',
                'Não foi possível enviar a notificação.',
                503,
            );
        }
    }
}
```

O `try/catch` fica restrito ao adapter quando é necessário traduzir a falha
inevitável da dependência externa. Não coloque regras do domínio, decisões de
fluxo ou validações específicas do módulo no provider compartilhado.

## Erros

Use `AppError` para erros conhecidos e respostas HTTP esperadas.

Quando o mesmo erro for reutilizado em mais de um ponto do módulo, crie um
arquivo próprio em `domain/errors/`:

```ts
export class ResourceUnavailableError extends AppError {
    constructor() {
        super('RESOURCE_UNAVAILABLE', 'Recurso indisponível.', 404);
    }
}
```

Repositories e providers devem traduzir falhas de persistência ou SDK dentro
da própria classe. Não exponha erros crus de Prisma, bcrypt, JWT ou serviços
externos para controllers.

## Rotas e OpenAPI

Cada controller registra seu caminho no `openApiRegistry` compartilhado,
importado de `shared/infrastructure/http/docs/openapi.ts`. Mantenha o registro
ao lado do DTO e do handler da operação para que contrato e resposta evoluam
juntos.

O arquivo de rotas deve reunir:

- imports dos controllers;
- middlewares da rota;
- criação e exportação do `Router`.

O `app.ts` gera `/openapi.json` e `/docs` a partir do registry compartilhado.

Exemplo genérico de routes:

```ts
import { Router } from 'express';
import { authenticate } from '../../../../shared/infrastructure/http/middlewares/authenticate.middleware.js';
import { createNotificationController } from '../controllers/create-notification.controller.js';
import { listNotificationsController } from '../controllers/list-notifications.controller.js';

export const notificationRoutes = Router();

notificationRoutes.post(
    '/notifications',
    authenticate,
    createNotificationController,
);
notificationRoutes.get(
    '/notifications',
    authenticate,
    listNotificationsController,
);
```

A rota conecta middlewares e controllers. Ela não executa caso de uso, monta
DTO, registra OpenAPI nem acessa Prisma.

## Autenticação e autorização

- autenticação usa JWT em cookie HttpOnly;
- `authenticate` valida o token e carrega o usuário;
- autorização de account ocorre em middleware separado;
- não crie tabela de sessão para esse fluxo stateless;
- controllers não devem confiar em IDs vindos do corpo quando o usuário já foi
  identificado pelo middleware.

Segredos, hashes, tokens e dados de pacientes nunca devem aparecer em logs ou
respostas HTTP.

## Padrão dos testes

Os testes usam Vitest e ficam próximos do caso de uso:

```text
application/usecases/create-notification.usecase.ts
application/usecases/create-notification.usecase.spec.ts
```

Padrão esperado:

- `describe` nomeando o caso de uso;
- `it` descrevendo comportamento observável;
- setup com `beforeEach`;
- mocks com `vi.fn()` que satisfazem a interface do domínio;
- dependências injetadas no construtor;
- `vi.useFakeTimers()` somente quando tempo fizer parte do cenário;
- `vi.useRealTimers()` em `afterEach` quando necessário;
- verificar resultado, erro e chamadas relevantes das dependências.

Exemplo genérico de resultado e dependência:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const repository = {
    create: vi.fn(),
} satisfies NotificationRepository;
const provider = {
    send: vi.fn(),
} satisfies NotificationProvider;

describe('CreateNotificationUseCase', () => {
    let useCase: CreateNotificationUseCase;

    beforeEach(() => {
        vi.resetAllMocks();
        useCase = new CreateNotificationUseCase(repository, provider);
    });

    it('cria a notificação e retorna o registro', async () => {
        const input = { message: 'Lembrete' };
        const notification = { id: 'notification-1', ...input };
        vi.mocked(repository.create).mockResolvedValue(notification);

        const result = await useCase.execute(input);

        expect(result).toEqual(notification);
        expect(repository.create).toHaveBeenCalledWith(input);
        expect(provider.send).toHaveBeenCalled();
    });

    it('propaga um erro conhecido do repository', async () => {
        vi.mocked(repository.create).mockRejectedValue(
            new ResourceUnavailableError(),
        );

        await expect(
            useCase.execute({ message: 'Lembrete' }),
        ).rejects.toMatchObject({ code: 'RESOURCE_UNAVAILABLE' });
    });
});
```

Nos exemplos, `input` representa a entrada, `notification` o valor esperado,
`result` o retorno observado e `useCase` a instância sob teste. Adapte os
campos e os erros ao contrato real, sem copiar nomes de outro domínio.

Prefira testar casos de uso isoladamente, sem banco, HTTP ou SDK real. Testes
de integração só devem ser adicionados quando forem solicitados explicitamente.

## Comandos de verificação

Depois de uma alteração de implementação, execute na raiz:

```bash
pnpm check
```

Esse comando cobre lint, typecheck, testes e formatação. Para trabalhar apenas
na API:

```bash
pnpm --filter @confirma/api dev
pnpm --filter @confirma/api typecheck
pnpm --filter @confirma/api test
```

Não afirme que uma verificação passou sem executá-la. Ao entregar uma mudança,
liste arquivos afetados, verificações realizadas e pendências conhecidas.
