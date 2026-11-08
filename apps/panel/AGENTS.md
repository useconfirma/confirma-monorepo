# Guia de desenvolvimento do painel

Este arquivo complementa o `AGENTS.md` da raiz. Ele descreve os padrões
específicos de `apps/panel` para que novas features sejam construídas de forma
consistente.

## Fontes de verdade

Antes de mudar comportamento, consulte:

- `docs/specs/overview.md`: escopo do produto e do Beta;
- `docs/specs/domain.md`: entidades, regras e estados;
- `docs/specs/api.md`: contratos HTTP consumidos pelo painel;
- `docs/product/assets/tokens.json`: paleta da marca;
- código existente: detalhes técnicos já adotados.

Não invente telas, estados, campos ou chamadas que não estejam especificados.
O painel consome a API; regras de negócio continuam na API.

## Estrutura do painel

```text
apps/panel/
├── public/                      # assets estáticos (logos, favicon)
├── src/
│   ├── routes/                  # rotas baseadas em arquivos
│   ├── features/                # features por contexto de negócio
│   ├── shared/                  # recursos usados por mais de uma feature
│   ├── main.tsx
│   ├── routeTree.gen.ts         # gerado; não editar
│   └── styles.css               # tema Tailwind
├── tsr.config.json
├── vite.config.ts
└── package.json
```

A aplicação inicia em `src/main.tsx`, que cria o router, monta o
`QueryProvider` e injeta o `queryClient` no contexto das rotas.

## Convenções de arquivos

Arquivos usam kebab-case e um sufixo que indica o papel:

| Sufixo | Conteúdo | Exemplo |
| --- | --- | --- |
| `.api.ts` | uma chamada HTTP | `create-notification.api.ts` |
| `.hook.ts` | um hook de query ou mutation | `use-create-notification.hook.ts` |
| `.schema.ts` | schema Zod de formulário | `create-notification.schema.ts` |
| `.screen.tsx` | página usada por uma rota | `notifications.screen.tsx` |
| `.layout.tsx` | layout de um grupo de rotas | `account.layout.tsx` |
| `.constant.ts` | valores fixos da feature | `channels.constant.ts` |
| `.tsx` sem sufixo | componente | `notification-list.tsx` |

Imports entre pastas diferentes usam o alias `@/` (`@/shared/...`,
`@/features/...`). Dentro da mesma feature, use caminhos relativos
(`../hooks/...`).

Screens usam `export default`; todo o resto usa exports nomeados.

## Como criar uma feature

Use o contexto de negócio como primeiro nível e a operação ou tela como
segundo, por exemplo `notifications/notification-list`:

```text
src/features/notifications/
└── notification-list/
    ├── api/
    ├── components/
    ├── constants/
    ├── hooks/
    ├── schemas/
    └── screens/
```

Crie somente as pastas necessárias ao comportamento solicitado. Depois:

1. crie o arquivo de rota em `src/routes/`, dentro do grupo correto;
2. se a tela fizer parte da navegação da account, adicione-a em
   `src/shared/components/layout/account/account-navigation-items.ts`, que
   alimenta sidebar e breadcrumb;
3. se a API mudou, regenere os tipos (ver "Comunicação com a API").

O fluxo de dependências é sempre:

```text
route → screen → hook → api → apiClient
            └──→ components (recebem dados e ações por props)
```

### `api/`

Cada arquivo exporta uma função assíncrona que faz uma única chamada com o
`apiClient`. Os tipos de corpo e resposta vêm de `paths`, gerado a partir do
OpenAPI da API. Não declare tipos de contrato à mão.

```ts
import { apiClient } from '@/shared/lib/api-client';
import type { paths } from '@/shared/@types/api';

type Body = NonNullable<
    paths['/notifications']['post']['requestBody']
>['content']['application/json'];
type Response =
    paths['/notifications']['post']['responses'][201]['content']['application/json'];

export const createNotification = async (data: Body) => {
    const { data: response } = await apiClient.post<Response>(
        '/notifications',
        data,
    );

    return response;
};
```

Regras:

- a função não conhece React, cache, formulário nem navegação;
- operações sem corpo de resposta apenas aguardam a chamada e não retornam
  nada;
- parâmetros de rota entram como argumentos da função;
- quando outro arquivo precisar do tipo de resposta, exporte-o como
  `<Operação>Response`.

### `hooks/`

Hooks conectam a função de API ao TanStack Query e, quando houver, ao
formulário. Um hook por operação, nomeado `use<Operação>`.

#### Queries

Exporte a chave, as `queryOptions` e o hook. As `queryOptions` são reutilizadas
pelos `beforeLoad` e `loader` das rotas.

```ts
import { queryOptions, useQuery } from '@tanstack/react-query';
import { getNotification } from '../api/get-notification.api';

export const notificationQueryKey = (notificationId: string) =>
    ['notifications', notificationId] as const;

export const notificationQueryOptions = (notificationId: string) =>
    queryOptions({
        queryKey: notificationQueryKey(notificationId),
        queryFn: () => getNotification(notificationId),
    });

export const useGetNotification = (notificationId: string) => {
    return useQuery(notificationQueryOptions(notificationId));
};
```

Queries sem parâmetro usam uma chave constante
(`['notifications'] as const`) e um objeto `queryOptions` direto.

#### Mutations com formulário

O hook monta o formulário com `react-hook-form` e `zodResolver`, executa a
mutation e atualiza o cache em `onSuccess`. Ele devolve somente o que o
componente precisa.

```ts
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { updateQueryCache } from '@/shared/lib/update-query-cache';
import { createNotification } from '../api/create-notification.api';
import type { ListNotificationsResponse } from '../api/list-notifications.api';
import { notificationsQueryKey } from './use-list-notifications.hook';
import {
    createNotificationSchema,
    type CreateNotificationFormData,
} from '../schemas/create-notification.schema';

export const useCreateNotification = () => {
    const {
        register,
        handleSubmit: formHandleSubmit,
        formState: { errors },
    } = useForm<CreateNotificationFormData>({
        resolver: zodResolver(createNotificationSchema),
    });
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createNotification,
        onSuccess: (response) => {
            updateQueryCache<ListNotificationsResponse>(
                queryClient,
                notificationsQueryKey,
                (currentData) => {
                    if (!currentData) return currentData;

                    return {
                        ...currentData,
                        notifications: [
                            ...currentData.notifications,
                            response.notification,
                        ],
                    };
                },
            );
        },
    });

    const handleSubmit = formHandleSubmit((data) => {
        mutation.mutate(data);
    });

    return {
        register,
        errors,
        isPending: mutation.isPending,
        handleSubmit,
    };
};
```

Regras:

- após uma mutation, atualize o cache com `updateQueryCache` usando a resposta
  da API; não invalide queries para forçar uma nova busca;
- navegação após sucesso (`useNavigate`) fica no hook, não no componente;
- mutations sem formulário expõem ações nomeadas pelo comportamento
  (`generate`, `reset`) em vez de `mutation.mutate`;
- valores sensíveis devolvidos pela API, como uma chave exibida uma única vez,
  ficam apenas no resultado da mutation e nunca entram no cache;
- não devolva o objeto `mutation` inteiro quando o componente usa só parte
  dele.

O `QueryProvider` define `staleTime: 'static'`, sem retry e sem refetch ao
focar a janela. Não sobrescreva esses padrões em hooks individuais sem
necessidade real.

### `schemas/`

Schemas Zod validam formulários. Exporte o schema e o tipo inferido como
`<Operação>FormData`. Mensagens de erro são escritas em português, para a
pessoa usuária.

```ts
import { z } from 'zod';

export const createNotificationSchema = z.object({
    recipient: z.email({ error: 'Informe um e-mail válido.' }),
    message: z.string().min(1, { error: 'Informe a mensagem.' }),
});

export type CreateNotificationFormData = z.infer<
    typeof createNotificationSchema
>;
```

O schema espelha as validações de entrada do contrato para dar retorno
imediato. A regra continua valendo na API; o painel não cria regras novas.

### `screens/`

A screen é a página de uma rota. Ela compõe a tela e não implementa detalhes.

Responsabilidades da screen:

- chamar os hooks da feature ou ler o contexto da rota (`getRouteApi`);
- repassar dados e ações aos componentes por props;
- definir o cabeçalho e a disposição das seções;
- decidir o que renderizar enquanto não há dado.

A screen não chama `apiClient`, não monta formulário, não atualiza cache e não
contém regras de exibição complexas; isso pertence ao hook ou ao componente.

```tsx
import { PageHeader } from '@/shared/components/page-header';
import { CreateNotificationForm } from '../components/create-notification-form';
import { NotificationList } from '../components/notification-list';
import { useCreateNotification } from '../hooks/use-create-notification.hook';
import { useListNotifications } from '../hooks/use-list-notifications.hook';

const NotificationsScreen = () => {
    const { data } = useListNotifications();
    const createNotification = useCreateNotification();

    return (
        <>
            <PageHeader
                title="Notificações"
                description="Mensagens enviadas aos seus contatos."
            />

            <CreateNotificationForm {...createNotification} />

            {data && <NotificationList notifications={data.notifications} />}
        </>
    );
};

export default NotificationsScreen;
```

Telas das rotas protegidas usam `PageHeader`, que contém o único `h1` da
página.

### `components/`

Componentes da feature são apresentacionais: recebem dados e ações por props
e não buscam nem gravam dados.

Um formulário recebe o retorno do hook como props, tipado com `ReturnType`:

```tsx
import { useId } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { useCreateNotification } from '../hooks/use-create-notification.hook';

type CreateNotificationFormProps = ReturnType<typeof useCreateNotification>;

export const CreateNotificationForm = ({
    register,
    errors,
    isPending,
    handleSubmit,
}: CreateNotificationFormProps) => {
    const recipientId = useId();
    const recipientErrorId = useId();

    return (
        <form onSubmit={handleSubmit} noValidate aria-busy={isPending}>
            <div className="space-y-2">
                <Label htmlFor={recipientId}>E-mail</Label>
                <Input
                    id={recipientId}
                    type="email"
                    disabled={isPending}
                    aria-invalid={errors.recipient ? true : undefined}
                    aria-describedby={
                        errors.recipient ? recipientErrorId : undefined
                    }
                    {...register('recipient')}
                />
                {errors.recipient && (
                    <p id={recipientErrorId} className="text-danger text-xs">
                        {errors.recipient.message}
                    </p>
                )}
            </div>

            <Button type="submit" disabled={isPending} className="mt-6">
                {isPending ? 'Enviando…' : 'Enviar'}
            </Button>
        </form>
    );
};
```

Regras:

- IDs de campos, erros e títulos vêm de `useId`;
- o estado de erro do campo é `aria-invalid`, ligado à mensagem por
  `aria-describedby`;
- enquanto `isPending`, campos e botões ficam desabilitados;
- estado local de interface (mostrar senha, diálogo aberto) pode ficar no
  componente com `useState`;
- tipos de dados vindos da API são derivados de `paths` ou do tipo de
  resposta exportado pela função de API;
- aceite `className` na raiz quando a screen precisar ajustar a disposição.

## Rotas

As rotas ficam em `src/routes/` e são geradas pelo plugin do TanStack Router.
Nunca edite `routeTree.gen.ts`. Arquivos `layout.tsx` definem o layout de um
grupo; pastas com `_` agrupam rotas sem alterar a URL.

- `_auth/`: rotas públicas, no `AuthLayout`;
- `_protected/`: exige sessão; o `beforeLoad` carrega o usuário atual;
- `_protected/_account/`: carrega a account e renderiza o `AccountLayout`.

O arquivo de rota conecta a URL à screen e carrega os dados de que a tela
precisa antes de renderizar:

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { notificationsQueryOptions } from '@/features/notifications/notification-list/hooks/use-list-notifications.hook';
import NotificationsScreen from '@/features/notifications/notification-list/screens/notifications.screen';

export const Route = createFileRoute('/_protected/_account/notifications')({
    loader: async ({ context }) => {
        await context.queryClient.query({
            ...notificationsQueryOptions,
        });
    },
    component: NotificationsScreen,
});
```

Regras:

- busque dados com `context.queryClient.query(queryOptions)`, reaproveitando
  as `queryOptions` do hook, para que a screen leia o mesmo cache;
- use `beforeLoad` para guardas e redirecionamentos (`throw redirect(...)`) e
  para expor valores no contexto das rotas filhas;
- use `loader` para pré-carregar dados da tela;
- falhas esperadas de carregamento vão para `errorComponent`;
- a rota não contém JSX de página, formulário nem chamada direta à API.

## Comunicação com a API

Toda chamada usa `apiClient` (`src/shared/lib/api-client.ts`), que aplica
`VITE_API_URL` e envia cookies (`withCredentials`).

- a sessão é um JWT em cookie HttpOnly gravado pela API; o painel nunca lê,
  armazena nem envia o token manualmente;
- não use `localStorage` ou `sessionStorage` para sessão, segredos ou dados de
  pacientes;
- os tipos de contrato ficam em `src/shared/@types/api.d.ts`, gerado a partir
  do OpenAPI. Com a API em execução, regenere após mudanças de contrato:

```bash
pnpm --filter @confirma/panel generate:types
```

Não edite o arquivo gerado.

## Componentes de UI

Componentes reutilizáveis de interface ficam em `src/shared/components/ui/`.
Eles não conhecem features, API nem regras de negócio.

### `cn` e `tv`

`src/shared/lib/tailwind.ts` exporta:

- `cn`: combina classes com `tailwind-merge`, resolvendo conflitos;
- `tv`: cria variantes com `tailwind-variants`, usando o mesmo `twMerge`;
- `VariantProps`: tipo das props de variantes.

Use `cn` quando o componente tem um único estilo e só precisa aceitar
`className`. Use `tv` quando houver variantes (`variant`, `size`). Sempre
importe de `@/shared/lib/tailwind`, nunca direto das bibliotecas, pois o
`twMerge` foi estendido com os tokens customizados do tema.

Ao criar um token de raio, sombra, espaçamento, animação ou similar em
`styles.css`, registre-o também no `extendTailwindMerge` de `tailwind.ts`.
Caso contrário, o merge pode descartar a classe.

### Componente com estilo único

```tsx
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/tailwind';

export const Panel = ({ className, ...props }: ComponentProps<'div'>) => (
    <div
        className={cn(
            'rounded-card border-border bg-surface border p-4',
            className,
        )}
        {...props}
    />
);
```

### Componente com variantes

```tsx
import type { ComponentProps } from 'react';
import { tv, type VariantProps } from '@/shared/lib/tailwind';

export const tagVariants = tv({
    base: 'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
    variants: {
        variant: {
            success: 'bg-success-soft text-success border-success/20',
            neutral: 'text-muted border-border-strong border-dashed',
        },
        size: {
            sm: 'h-5',
            md: 'h-6',
        },
    },
    defaultVariants: {
        variant: 'neutral',
        size: 'md',
    },
});

type TagProps = ComponentProps<'span'> & VariantProps<typeof tagVariants>;

export const Tag = ({ variant, size, className, ...props }: TagProps) => (
    <span className={tagVariants({ variant, size, className })} {...props} />
);
```

Regras:

- props estendem `ComponentProps<'elemento'>` (ou
  `ComponentProps<typeof Primitive.X>`) e repassam `...props`;
- `className` vai por último em `cn(...)` ou como argumento do `tv`, para que
  quem usa possa sobrescrever;
- exporte as variantes como `<nome>Variants` quando outro componente precisar
  do mesmo estilo;
- estados visuais vêm de atributos (`disabled`, `aria-invalid`,
  `aria-pressed`, `data-[state=open]`), não de props booleanas paralelas;
- classes longas podem ser divididas em array de strings no `base` ou nas
  variantes;
- quando o componente puder trocar o elemento renderizado, ofereça `asChild`
  com `Slot.Root` do Radix:

```tsx
import { Slot } from 'radix-ui';

type PanelProps = ComponentProps<'div'> & { asChild?: boolean };

export const Panel = ({ asChild, className, ...props }: PanelProps) => {
    const Comp = asChild ? Slot.Root : 'div';
    return <Comp className={cn('...', className)} {...props} />;
};
```

### Primitivos com Radix

Componentes com comportamento interativo e acessibilidade não triviais
(diálogo, menu, select, popover, tooltip, tabs, progress) são montados sobre
Radix UI. Não reimplemente foco, teclado, portal ou ARIA desses padrões.

O pacote `radix-ui` já está instalado e reúne todos os primitivos. Importe o
primitivo pelo nome e reexporte as partes estilizadas:

```tsx
import { Popover as PopoverPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/tailwind';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export const PopoverContent = ({
    className,
    sideOffset = 6,
    ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            sideOffset={sideOffset}
            className={cn(
                'rounded-card border-border bg-surface shadow-popover data-[state=open]:animate-fade-in border p-4',
                className,
            )}
            {...props}
        />
    </PopoverPrimitive.Portal>
);
```

Regras:

- partes sem estilo próprio (`Root`, `Trigger`, `Close`) são reexportadas
  diretamente;
- partes estilizadas usam `cn` ou `tv` e aceitam `className`;
- animações usam os atributos `data-[state=...]` do Radix;
- antes de instalar uma dependência nova, verifique se o primitivo já existe
  em `radix-ui`. Instale outra biblioteca somente quando o Radix não oferecer
  o comportamento e a tarefa realmente precisar dele:

```bash
pnpm --filter @confirma/panel add <pacote>
```

### Componentes compartilhados que não são UI

- `src/shared/components/`: componentes de página reutilizados entre
  features, como `PageHeader` e `ConfirmDialog`;
- `src/shared/components/layout/<layout>/`: o layout e os arquivos usados
  apenas por ele, lado a lado, sem subpasta `components/`.

## Estilos

- Tailwind CSS 4, configurado em `src/styles.css` com `@theme`;
- cores vêm exclusivamente de `docs/product/assets/tokens.json`; uma cor nova
  só entra no tema depois de existir nos tokens;
- componentes usam os papéis semânticos do tema (`text-foreground`,
  `text-muted`, `bg-surface`, `border-border`, `text-danger`...) em vez de
  cores de fundação, salvo quando o próprio componente define o material;
- não use valores de cor hexadecimais soltos nas classes;
- animações respeitam `motion-safe:`;
- ícones vêm de `lucide-react`, com `aria-hidden="true"` quando decorativos;
- estado nunca é comunicado só por cor: acompanhe de texto e, quando houver,
  ícone;
- assets estáticos (logos, favicon) ficam em `public/` e são referenciados
  por `/arquivo.svg`.

## Como usar `shared`

`shared` contém somente o que é usado por mais de uma feature ou que é
infraestrutura transversal do painel:

- `@types/`: tipos gerados do OpenAPI;
- `api/` e `hooks/`: chamadas e queries usadas por várias features, como
  usuário atual e account;
- `components/`: UI, layouts e componentes de página;
- `lib/`: cliente HTTP e utilitários de Tailwind e cache;
- `providers/`: providers globais.

Mantenha na feature qualquer chamada, hook, schema ou componente usado por um
único contexto. Antes de mover algo para `shared`, verifique se há mais de um
consumidor real. Não crie abstrações antecipadas nem use `shared` como
depósito de utilitários genéricos.

## Comentários

Componentes, hooks e rotas com papel não óbvio levam um comentário curto no
topo explicando o que fazem e, quando aplicável, o ID da especificação
atendida (`UC-03`, `API-08`, `ENT-03`). Não comente o óbvio nem registre
histórico de mudanças.

## Segurança e privacidade

- tokens, API Keys, segredos e dados de pacientes nunca vão para logs,
  `console`, URLs de terceiros ou armazenamento do navegador;
- segredos exibidos uma única vez ficam apenas em memória e são descartados
  ao fechar a tela ou o diálogo;
- o painel não confia em dados do usuário para autorização; a API decide.

## Comandos de verificação

Depois de uma alteração de implementação, execute na raiz:

```bash
pnpm check
```

Esse comando cobre lint, typecheck, testes e formatação. Para trabalhar apenas
no painel:

```bash
pnpm --filter @confirma/panel dev
pnpm --filter @confirma/panel typecheck
```

Não afirme que uma verificação passou sem executá-la. Ao entregar uma mudança,
liste arquivos afetados, verificações realizadas e pendências conhecidas.
