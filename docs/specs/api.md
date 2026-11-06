---
version: beta
name: 'confirma-api'
description: 'Contratos HTTP do painel, da API pública e dos webhooks do Confirma Beta'
api:
    base-path: '/'
    authentication: 'JWT stateless em cookie HttpOnly nas rotas protegidas.'
    error-format: 'JSON { error: { code, message } }'
endpoints:
    - {
          id: API-01,
          use-case: UC-01,
          method: POST,
          path: '/invitations',
          authorization: 'Público',
          request: { params: [], query: [], body: ['email'] },
          response: { status: 202, body: ['accepted'] },
          errors: ['400: corpo inválido'],
      }
    - {
          id: API-14,
          use-case: UC-16,
          method: GET,
          path: '/invitations/{invitationToken}',
          authorization: 'Público; token secreto no caminho',
          request: { params: ['invitationToken'], query: [], body: [] },
          response: { status: 200, body: ['email'] },
          errors: ['410: convite inválido, usado ou expirado'],
      }
    - {
          id: API-02,
          use-case: UC-02,
          method: POST,
          path: '/accounts',
          authorization: 'Convite válido',
          request:
              {
                  params: [],
                  query: [],
                  body: ['invitationToken', 'password', 'accountName'],
              },
          response: { status: 201, body: ['user', 'account'] },
          errors:
              [
                  '400: dados inválidos',
                  '409: e-mail existente',
                  '410: convite inválido, usado ou expirado',
              ],
      }
    - {
          id: API-03,
          use-case: UC-03,
          method: POST,
          path: '/sessions',
          authorization: 'Público',
          request: { params: [], query: [], body: ['email', 'password'] },
          response: { status: 204, body: [] },
          errors: ['401: credenciais inválidas'],
      }
    - {
          id: API-04,
          use-case: UC-04,
          method: DELETE,
          path: '/sessions/current',
          authorization: 'Cookie de sessão válido',
          request: { params: [], query: [], body: [] },
          response: { status: 204, body: [] },
          errors: ['401: sessão ausente ou inválida'],
      }
    - {
          id: API-05,
          use-case: UC-05,
          method: GET,
          path: '/account',
          authorization: 'Cookie de sessão',
          request: { params: [], query: [], body: [] },
          response: { status: 200, body: ['account'] },
          errors: ['401: sessão ausente ou inválida', '403: account não autorizada'],
      }
    - {
          id: API-06,
          use-case: UC-06,
          method: GET,
          path: '/users/me',
          authorization: 'Cookie de sessão',
          request: { params: [], query: [], body: [] },
          response: { status: 200, body: ['user'] },
          errors: ['401: sessão ausente ou inválida'],
      }
    - {
          id: API-07,
          use-case: UC-07,
          method: PUT,
          path: '/integration/send-window',
          authorization: 'Cookie de sessão válido',
          request:
              { params: [], query: [], body: ['start', 'end', 'timeZone'] },
          response: { status: 200, body: ['configured', 'start', 'end', 'timeZone', 'updatedAt'] },
          errors: ['400: dados inválidos', '401: sessão ausente ou inválida'],
      }
    - {
          id: API-08,
          use-case: UC-08,
          method: POST,
          path: '/integration/api-key',
          authorization: 'Cookie de sessão válido',
          request: { params: [], query: [], body: [] },
          response: { status: 201, body: ['apiKey', 'createdAt'] },
          errors: ['401: sessão ausente ou inválida'],
      }
    - {
          id: API-09,
          use-case: UC-09,
          method: PUT,
          path: '/integration/webhook',
          authorization: 'Cookie de sessão válido',
          request: { params: [], query: [], body: ['url', 'secret'] },
          response: { status: 200, body: ['configured', 'url', 'updatedAt'] },
          errors: ['400: dados inválidos', '401: sessão ausente ou inválida'],
      }
    - {
          id: API-10,
          use-case: UC-10,
          method: PUT,
          path: '/integration/z-api',
          authorization: 'Cookie de sessão válido',
          request:
              {
                  params: [],
                  query: [],
                  body: ['instanceId', 'instanceToken', 'clientToken'],
              },
          response: { status: 200, body: ['configured', 'instanceId', 'updatedAt'] },
          errors: ['400: dados inválidos', '401: sessão ausente ou inválida'],
      }
    - {
          id: API-11,
          use-case: UC-11,
          method: POST,
          path: '/appointments',
          authorization: 'Bearer API Key e Idempotency-Key',
          request:
              {
                  params: [],
                  query: [],
                  body:
                      [
                          'externalId',
                          'patientName',
                          'patientPhone',
                          'scheduledAt',
                          'serviceName?',
                          'locationName?',
                      ],
              },
          response: { status: 202, body: ['appointment'] },
          errors:
              [
                  '400: formato inválido ou Idempotency-Key ausente',
                  '401: API Key inválida',
                  '409: conflito de idempotência ou externalId',
                  '422: regra temporal ou janela violada',
              ],
      }
    - {
          id: API-12,
          use-case: UC-13,
          method: POST,
          path: '/v1/providers/z-api/callbacks/{callbackToken}',
          authorization: 'Identificador secreto associado à integração',
          request:
              { params: ['callbackToken'], query: [], body: ['payload Z-API'] },
          response: { status: 204, body: [] },
          errors:
              [
                  '400: evento inválido',
                  '401: token ou instância incompatível',
                  '404: integração inexistente',
              ],
      }
    - {
          id: API-13,
          use-case: UC-15,
          method: POST,
          path: '{configuredWebhookUrl}',
          authorization: 'HMAC-SHA256',
          request:
              {
                  params: [],
                  query: [],
                  body:
                      [
                          'eventId',
                          'type',
                          'appointmentId',
                          'externalId',
                          'state',
                          'occurredAt',
                          'failureReason?',
                      ],
              },
          response: { status: '2xx', body: [] },
          errors:
              [
                  '408/429/5xx ou falha de transporte: retentativa',
                  'demais 4xx: falha permanente',
              ],
      }
---

# API — Confirma

## Convenções

- **Prefixo:** as rotas atuais não usam prefixo global. A API também expõe `GET /openapi.json` e a interface em `/docs`.
- **Mídia:** requisições e respostas com corpo usam `application/json; charset=utf-8`.
- **Datas:** ISO 8601; instantes incluem deslocamento UTC. Eventos emitidos pelo Confirma usam UTC.
- **Autenticação do painel:** JWT stateless com duração de 8 horas no cookie HttpOnly `confirma_session`, `SameSite=Lax` e `Secure` em produção. O navegador envia o cookie nas operações do painel. Não existe tabela de sessão nem refresh token. O logout limpa o cookie; o token emitido continua válido até expirar caso seja reutilizado fora do navegador.
- **API pública:** `Authorization: Bearer <api-key>` nas rotas previstas do Beta. A API Key identifica a account e nunca é aceita por query string.
- **Erro:** `{ "error": { "code": "machine_readable_code", "message": "mensagem objetiva" } }`. Não há outros campos.
- **Segredos:** API Key é exibida somente ao gerar; senha, segredo de webhook e tokens Z-API nunca são retornados.

## Endpoints

### API-01 — Solicitar convite

`POST /invitations`

- **Caso de uso:** UC-01; requisito RF-01.
- **Acesso:** público.
- **Entrada:** `{ "email": "dev@example.com" }`.
- **Resposta atual:** `202` com `{ "accepted": true }`. O controller valida o corpo e executa o caso de uso com repository Prisma e envio de convite pelo Resend.

### API-14 — Verificar convite

`GET /invitations/{invitationToken}`

- **Caso de uso:** UC-16; requisito RF-01.
- **Acesso:** público; o token secreto no caminho é a credencial.
- **Resposta:** `200` com `{ "email": "dev@example.com" }`, o e-mail autorizado pelo convite.
- **Resposta atual:** `200` com o e-mail associado ao token do convite persistido. O convite usado ou expirado retorna `410`.

### API-02 — Aceitar convite e criar conta

`POST /accounts`

- **Caso de uso:** UC-02; requisito RF-01.
- **Entrada:** `invitationToken`, `password` e `accountName`, todos strings obrigatórios. O e-mail é o do convite.
- **Resposta:** `201` com `{ "user": { "id": "...", "email": "..." }, "account": { "id": "...", "name": "..." } }`.
- **Erro de validação:** `400` com `VALIDATION_ERROR`.
- **Comportamento atual:** o controller executa o caso de uso, consome o convite e cria usuário e account em uma transação Prisma. O DTO público é construído no controller com somente `id` e `email` do usuário e `id` e `name` da account; hash de senha e campos internos de persistência não são retornados.

### API-03 — Login

`POST /sessions`

- **Caso de uso:** UC-03; requisito RF-01.
- **Entrada:** `email` e `password`.
- **Resposta atual:** `204`, sem corpo, com `Set-Cookie` para `confirma_session` após validar a senha e assinar um JWT de 8 horas.
- **Erros:** `400` com `VALIDATION_ERROR` para corpo inválido; `401` com `INVALID_CREDENTIALS` para e-mail ou senha inválidos.

### API-04 — Logout

`DELETE /sessions/current`

- **Caso de uso:** UC-04; requisito RF-01.
- **Acesso:** cookie `confirma_session` válido.
- **Resposta atual:** `204`, sem corpo; o controller remove o cookie. Não há revogação do JWT no servidor.
- **Erros:** `401` com `UNAUTHENTICATED` para cookie ausente, inválido ou usuário inexistente.

### API-05 — Consultar account

`GET /account`

- **Caso de uso:** UC-05; requisitos RF-01 e RF-02.
- **Resposta atual:** `200` com a account e seus blocos de configuração, em uma única requisição. Blocos sem configuração mantêm `configured: false` e os campos opcionais como `null`:

```json
{
    "account": {
        "id": "account_123",
        "name": "Clínica Teste",
        "sendWindow": {
            "configured": false,
            "start": null,
            "end": null,
            "timeZone": null,
            "updatedAt": null
        },
        "apiKey": {
            "configured": false,
            "createdAt": null
        },
        "webhook": {
            "configured": false,
            "url": null,
            "updatedAt": null
        },
        "zApi": {
            "configured": false,
            "instanceId": null,
            "updatedAt": null
        }
    }
}
```

O formato dos blocos é estável: enquanto não configurados, usam `configured: false` e os demais campos `null`, como neste exemplo:

```json
"webhook": { "configured": false, "url": null, "updatedAt": null }
```

- **Erros:** `401` com `UNAUTHENTICATED`; `403` com `ACCOUNT_ACCESS_DENIED`.
- **Comportamento:** `sendWindow`, `apiKey`, `webhook` e `zApi` estão sempre presentes e cada um traz `configured`, para que o cliente não precise testar `null`. `updatedAt` (`createdAt` na API Key) é o instante da última gravação. Segredos nunca são retornados. É a única leitura da configuração: não há consultas individuais por recurso.

### API-06 — Consultar usuário atual

`GET /users/me`

- **Caso de uso:** UC-06; requisito RF-01.
- **Resposta atual:** `200` com `{ "user": { "id": "...", "email": "..." } }`, obtido do usuário autenticado no Prisma.
- **Erros:** `401` com `UNAUTHENTICATED` para cookie ausente, inválido ou usuário inexistente.

### API-07 — Configurar janela de envio

`PUT /integration/send-window`

- **Caso de uso:** UC-07; requisito RF-02.
- **Entrada:** `{ "start": "08:00", "end": "18:00", "timeZone": "America/Sao_Paulo" }`.
- **Resposta atual:** `200` com a janela persistida e `configured: true`. O caso de uso valida formato, ordem dos horários e fuso IANA antes de gravar no Prisma.
- **Erros:** `400` com `VALIDATION_ERROR`; `401` com `UNAUTHENTICATED`; `422` com `INVALID_SEND_WINDOW`.

### API-08 — Gerar API Key

`POST /integration/api-key`

- **Caso de uso:** UC-08; requisito RF-03.
- **Resposta atual:** `201` com a API Key gerada e `createdAt`. A chave em texto puro é retornada somente nessa resposta; o hash é persistido e as chaves ativas anteriores são revogadas.
- **Erros:** `401` com `UNAUTHENTICATED`.

### API-09 — Configurar webhook de saída

`PUT /integration/webhook`

- **Caso de uso:** UC-09; requisitos RF-02 e RF-09.
- **Entrada:** `{ "url": "https://example.com/confirma", "secret": "<secret>" }`.
- **Resposta atual:** `200` com `{ "configured": true, "url": "https://example.com/confirma", "updatedAt": "..." }`. O segredo é protegido antes de ser persistido e nunca é retornado.
- **Erros:** `400` com `VALIDATION_ERROR`; `401` com `UNAUTHENTICATED`; `422` com `INVALID_WEBHOOK`.

### API-10 — Configurar Z-API

`PUT /integration/z-api`

- **Caso de uso:** UC-10; requisitos RF-02 e RF-07.
- **Entrada:** `instanceId`, `instanceToken` e `clientToken`, strings obrigatórias.
- **Resposta atual:** `200` com `{ "configured": true, "instanceId": "instance-id", "updatedAt": "..." }`. O callback é registrado na Z-API antes de persistir as credenciais protegidas.
- **Erros:** `400` com `VALIDATION_ERROR`; `401` com `UNAUTHENTICATED`; `422` com `ZAPI_CONFIGURATION_FAILED`; `503` se o registro do callback falhar.

### API-11 — Criar agendamento

`POST /appointments`

- **Caso de uso:** UC-11; requisitos RF-04 e RF-05.
- **Implementação:** endpoint previsto para o Beta e ainda não presente na API atual.
- **Cabeçalhos:** `Authorization: Bearer <api-key>`, `Idempotency-Key` obrigatório e `Content-Type: application/json`.
- **Entrada:**

```json
{
    "externalId": "clinic-appointment-123",
    "patientName": "Paciente Teste",
    "patientPhone": "+5511999999999",
    "scheduledAt": "2026-11-04T18:00:00-03:00",
    "serviceName": "Consulta de teste",
    "locationName": "Unidade de teste"
}
```

`externalId`, `patientName`, `patientPhone` e `scheduledAt` são obrigatórios; `serviceName` e `locationName` são opcionais. Não são aceitos dados clínicos sensíveis.

- **Resposta:** `202` com `{ "appointment": { "id": "...", "externalId": "...", "state": "queued", "scheduledAt": "...", "acceptedAt": "..." } }`.
- **Erros:** `400 invalid_request` ou `missing_idempotency_key`; `401 invalid_api_key`; `409 idempotency_key_reused` ou `external_id_conflict`; `422 appointment_not_in_allowed_period` ou `no_send_window_before_appointment`.
- **Idempotência:** mesma account, chave e corpo retorna o mesmo `202` e corpo original durante 48 horas; mesma chave com corpo diferente retorna `409`. Rejeições não são armazenadas para replay.
- **Regras:** BR-05 a BR-10.

### API-12 — Receber callback da Z-API

`POST /providers/z-api/callbacks/{callbackToken}`

- **Caso de uso:** UC-13; requisito RF-07.
- **Implementação:** endpoint previsto para o Beta e ainda não presente na API atual.
- **Acesso:** `callbackToken` aleatório e exclusivo; o Confirma também exige que `instanceId` e os dados da mensagem pertençam à integração. Não há presunção de assinatura criptográfica da Z-API.
- **Eventos consumidos:** `MessageStatusCallback`, `ReceivedCallBack` e callback documentado de envio ou falha da Z-API, conforme os campos necessários à correlação do agendamento.
- **Resposta:** `204` para evento válido, inclusive duplicado ou irrelevante; `400` para estrutura desconhecida; `401` para token ou instância incompatível; `404` para integração inexistente.
- **Comportamento:** processamento idempotente. Texto exatamente `1` produz `confirmed`; texto exatamente `2`, `declined`; conteúdo diferente ou correlação ambígua não altera estado.

### API-13 — Entregar webhook do Confirma

`POST {configuredWebhookUrl}`

- **Caso de uso:** UC-15; requisito RF-09.
- **Implementação:** entrega prevista para o Beta e ainda não presente na API atual.
- **Cabeçalhos:**
    - `X-Confirma-Event-Id`: mesmo valor de `eventId` em todas as tentativas;
    - `X-Confirma-Timestamp`: Unix timestamp em segundos, recalculado por tentativa;
    - `X-Confirma-Signature`: `sha256=<hex(HMAC-SHA256(secret, timestamp + "." + rawBody))>`;
    - `Content-Type: application/json`.
- **Payload comum:**

```json
{
    "eventId": "evt_123",
    "type": "appointment.confirmed",
    "appointmentId": "apt_123",
    "externalId": "clinic-appointment-123",
    "state": "confirmed",
    "occurredAt": "2026-11-04T20:15:00Z",
    "failureReason": null
}
```

- **Eventos:** `appointment.accepted` (`queued`), `appointment.sent` (`sent`), `appointment.confirmed` (`confirmed`), `appointment.declined` (`declined`), `appointment.expired` (`expired`) e `appointment.failed` (`failed`). `failureReason` só é preenchido quando aplicável.
- **Verificação:** calcular sobre os bytes exatos recebidos, comparar em tempo constante, tolerar no máximo 5 minutos de diferença no timestamp e deduplicar por `eventId`.
- **Entrega:** timeout de 5 segundos; tentativas imediata, +1 minuto, +5 minutos e +15 minutos. Qualquer 2xx conclui. Erro de conexão, timeout, 408, 429 e 5xx retentam; outros 4xx encerram. Falha não altera o agendamento.

## Regras compartilhadas

- Operações protegidas usam o cookie `confirma_session`; as rotas de account e integração também exigem autorização da account associada ao usuário.
- A validação de corpos inválidos retorna `400` com `{ "error": { "code": "VALIDATION_ERROR", "message": "Dados inválidos." } }`.
- O middleware de autenticação usa diretamente o repository Prisma e o provider JWT. A autorização consulta a account do usuário no repository Prisma e retorna `403` quando ela não existe.
- API-11, API-12 e API-13 permanecem contratos do Beta mesmo enquanto suas rotas ainda não estiverem implementadas.
