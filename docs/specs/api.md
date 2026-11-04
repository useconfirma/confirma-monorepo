---
version: beta
name: 'confirma-api'
description: 'Contratos HTTP do painel, da API pública e dos webhooks do Confirma Beta'
api:
    base-path: '/v1'
    authentication: 'Cookie de sessão no painel; Bearer API Key na API pública; token secreto no caminho do callback Z-API.'
    error-format: 'JSON { error: { code, message } }'
endpoints:
    - {
          id: API-01,
          use-case: UC-01,
          method: POST,
          path: '/v1/invitations',
          authorization: 'Público',
          request: { params: [], query: [], body: ['email'] },
          response: { status: 202, body: ['accepted'] },
          errors: ['400: corpo inválido'],
      }
    - {
          id: API-14,
          use-case: UC-16,
          method: GET,
          path: '/v1/invitations/{invitationToken}',
          authorization: 'Público; token secreto no caminho',
          request: { params: ['invitationToken'], query: [], body: [] },
          response: { status: 200, body: ['email'] },
          errors: ['410: convite inválido, usado ou expirado'],
      }
    - {
          id: API-02,
          use-case: UC-02,
          method: POST,
          path: '/v1/accounts',
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
                  '409: e-mail existente',
                  '410: convite inválido, usado ou expirado',
                  '422: dados inválidos',
              ],
      }
    - {
          id: API-03,
          use-case: UC-03,
          method: POST,
          path: '/v1/sessions',
          authorization: 'Público',
          request: { params: [], query: [], body: ['email', 'password'] },
          response: { status: 204, body: [] },
          errors: ['401: credenciais inválidas'],
      }
    - {
          id: API-04,
          use-case: UC-04,
          method: DELETE,
          path: '/v1/sessions/current',
          authorization: 'Cookie de sessão válido',
          request: { params: [], query: [], body: [] },
          response: { status: 204, body: [] },
          errors: ['401: sessão ausente ou inválida'],
      }
    - {
          id: API-05,
          use-case: UC-05,
          method: GET,
          path: '/v1/account',
          authorization: 'Cookie de sessão',
          request: { params: [], query: [], body: [] },
          response: { status: 200, body: ['account'] },
          errors: ['401: sessão ausente ou inválida'],
      }
    - {
          id: API-06,
          use-case: UC-06,
          method: GET,
          path: '/v1/users/me',
          authorization: 'Cookie de sessão',
          request: { params: [], query: [], body: [] },
          response: { status: 200, body: ['user'] },
          errors: ['401: sessão ausente ou inválida'],
      }
    - {
          id: API-07,
          use-case: UC-07,
          method: PUT,
          path: '/v1/integration/send-window',
          authorization: 'Cookie de sessão válido',
          request:
              { params: [], query: [], body: ['start', 'end', 'timeZone'] },
          response: { status: 200, body: ['sendWindow'] },
          errors: ['422: janela ou fuso inválido'],
      }
    - {
          id: API-08,
          use-case: UC-08,
          method: POST,
          path: '/v1/integration/api-key',
          authorization: 'Cookie de sessão válido',
          request: { params: [], query: [], body: [] },
          response: { status: 201, body: ['apiKey', 'createdAt'] },
          errors: ['401: sessão inválida'],
      }
    - {
          id: API-09,
          use-case: UC-09,
          method: PUT,
          path: '/v1/integration/webhook',
          authorization: 'Cookie de sessão válido',
          request: { params: [], query: [], body: ['url', 'secret'] },
          response: { status: 200, body: ['url'] },
          errors: ['422: URL ou segredo inválido'],
      }
    - {
          id: API-10,
          use-case: UC-10,
          method: PUT,
          path: '/v1/integration/z-api',
          authorization: 'Cookie de sessão válido',
          request:
              {
                  params: [],
                  query: [],
                  body: ['instanceId', 'instanceToken', 'clientToken'],
              },
          response: { status: 200, body: ['instanceId'] },
          errors: ['422: credenciais rejeitadas ou callback não configurado'],
      }
    - {
          id: API-11,
          use-case: UC-11,
          method: POST,
          path: '/v1/appointments',
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
                  '400: formato inválido',
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

- **Prefixo:** `/v1` para endpoints do Confirma. A entrega de webhook usa a URL HTTPS configurada.
- **Mídia:** requisições e respostas com corpo usam `application/json; charset=utf-8`.
- **Datas:** ISO 8601; instantes incluem deslocamento UTC. Eventos emitidos pelo Confirma usam UTC.
- **Autenticação do painel:** JWT com duração de 8 horas no cookie HttpOnly `confirma_session`, `SameSite=Lax` e `Secure` em produção. O navegador envia o cookie nas operações do painel. Não existe refresh token.
- **API pública:** `Authorization: Bearer <api-key>`. A API Key identifica a conta e nunca é aceita por query string.
- **Erro:** `{ "error": { "code": "machine_readable_code", "message": "mensagem objetiva" } }`. Não há outros campos.
- **Segredos:** API Key é exibida somente ao gerar; senha, segredo de webhook e tokens Z-API nunca são retornados.

## Endpoints

### API-01 — Solicitar convite

`POST /v1/invitations`

- **Caso de uso:** UC-01; requisito RF-01.
- **Acesso:** público.
- **Entrada:** `{ "email": "dev@example.com" }`.
- **Resposta:** `202` com `{ "accepted": true }`; não revela se o e-mail já possui convite ou conta.
- **Comportamento:** envia automaticamente convite válido por 72 horas.

### API-14 — Verificar convite

`GET /v1/invitations/{invitationToken}`

- **Caso de uso:** UC-16; requisito RF-01.
- **Acesso:** público; o token secreto no caminho é a credencial.
- **Resposta:** `200` com `{ "email": "dev@example.com" }`, o e-mail autorizado pelo convite.
- **Erro:** `410 invitation_unavailable` para convite inexistente, usado ou expirado.
- **Comportamento:** somente leitura; não consome o convite. O token não deve ser registrado em logs.

### API-02 — Aceitar convite e criar conta

`POST /v1/accounts`

- **Caso de uso:** UC-02; requisito RF-01.
- **Entrada:** `invitationToken`, `password` e `accountName`, todos strings obrigatórios. O e-mail é o do convite.
- **Resposta:** `201` com `{ "user": { "id": "...", "email": "..." }, "account": { "id": "...", "name": "..." } }`.
- **Erros:** `409 email_already_registered`; `410 invitation_unavailable`; `422 validation_failed`.
- **Comportamento:** o e-mail do usuário é o do convite; sucesso cria o usuário e sua account e consome o convite atomicamente. No Beta, cada usuário possui uma única account, definida neste momento.

### API-03 — Login

`POST /v1/sessions`

- **Caso de uso:** UC-03; requisito RF-01.
- **Entrada:** `email` e `password`.
- **Resposta:** `204`, com `Set-Cookie` para a sessão.
- **Erro:** `401 invalid_credentials`.

### API-04 — Logout

`DELETE /v1/sessions/current`

- **Caso de uso:** UC-04; requisito RF-01.
- **Acesso:** cookie de sessão válido.
- **Resposta:** `204` e expiração do cookie.
- **Comportamento:** o JWT apresentado deixa de ser enviado pelo navegador; tokens copiados permanecem válidos até vencerem.

### API-05 — Consultar account

`GET /v1/account`

- **Caso de uso:** UC-05; requisitos RF-01 e RF-02.
- **Resposta:** `200` com a account completa, em uma única requisição:

```json
{
    "account": {
        "id": "acc_123",
        "name": "Clínica Teste",
        "sendWindow": {
            "configured": true,
            "start": "08:00",
            "end": "18:00",
            "timeZone": "America/Sao_Paulo",
            "updatedAt": "2026-11-04T12:00:00Z"
        },
        "apiKey": {
            "configured": true,
            "createdAt": "2026-11-04T12:05:00Z"
        },
        "webhook": {
            "configured": true,
            "url": "https://example.com/confirma",
            "updatedAt": "2026-11-04T12:10:00Z"
        },
        "zApi": {
            "configured": true,
            "instanceId": "instance-id",
            "updatedAt": "2026-11-04T12:15:00Z"
        }
    }
}
```

Bloco ainda não configurado mantém a mesma estrutura, com `configured: false` e os demais campos `null`:

```json
"webhook": { "configured": false, "url": null, "updatedAt": null }
```

- **Erro:** `401 unauthenticated`.
- **Comportamento:** `sendWindow`, `apiKey`, `webhook` e `zApi` estão sempre presentes e cada um traz `configured`, para que o cliente não precise testar `null`. `updatedAt` (`createdAt` na API Key) é o instante da última gravação. Segredos nunca são retornados. É a única leitura da configuração: não há consultas individuais por recurso.

### API-06 — Consultar usuário atual

`GET /v1/users/me`

- **Caso de uso:** UC-06; requisito RF-01.
- **Resposta:** `200` com `{ "user": { "id": "...", "email": "..." } }`.
- **Erro:** `401 unauthenticated`.

### API-07 — Configurar janela de envio

`PUT /v1/integration/send-window`

- **Caso de uso:** UC-07; requisito RF-02.
- **Entrada:** `{ "start": "08:00", "end": "18:00", "timeZone": "America/Sao_Paulo" }`.
- **Resposta:** `200` com o objeto `sendWindow` persistido.
- **Erro:** `422 invalid_send_window` se horários não forem `HH:mm`, início não anteceder fim ou fuso não for IANA válido.
- **Regras:** BR-03.

### API-08 — Gerar API Key

`POST /v1/integration/api-key`

- **Caso de uso:** UC-08; requisito RF-03.
- **Resposta:** `201` com `{ "apiKey": "<secret>", "createdAt": "..." }`.
- **Comportamento:** o valor é exibido uma vez e substitui imediatamente a chave anterior.

### API-09 — Configurar webhook de saída

`PUT /v1/integration/webhook`

- **Caso de uso:** UC-09; requisitos RF-02 e RF-09.
- **Entrada:** `{ "url": "https://example.com/confirma", "secret": "<secret>" }`.
- **Resposta:** `200` com `{ "url": "..." }`; o segredo não é retornado.
- **Erro:** `422 invalid_webhook` para URL não HTTPS ou segredo ausente.

### API-10 — Configurar Z-API

`PUT /v1/integration/z-api`

- **Caso de uso:** UC-10; requisitos RF-02 e RF-07.
- **Entrada:** `instanceId`, `instanceToken` e `clientToken`, strings obrigatórias.
- **Resposta:** `200` com `{ "instanceId": "..." }`; credenciais não são retornadas.
- **Erro:** `422 zapi_configuration_failed` quando as credenciais não forem aceitas ou não for possível registrar o callback.
- **Comportamento:** o Confirma registra na instância uma URL HTTPS no formato de API-12. Conforme a documentação oficial vigente, a Z-API usa `PUT /instances/{id}/token/{token}/update-every-webhooks`, corpo `value` e cabeçalho `Client-Token`; as credenciais permanecem somente no backend.

### API-11 — Criar agendamento

`POST /v1/appointments`

- **Caso de uso:** UC-11; requisitos RF-04 e RF-05.
- **Cabeçalhos:** `Authorization`, `Idempotency-Key` obrigatório e `Content-Type`.
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

`externalId`, `patientName`, `patientPhone` e `scheduledAt` são obrigatórios; os demais são opcionais. Não são aceitos dados clínicos sensíveis.

- **Resposta:** `202` com `{ "appointment": { "id": "...", "externalId": "...", "state": "queued", "scheduledAt": "...", "acceptedAt": "..." } }`.
- **Erros:** `400 invalid_request` ou `missing_idempotency_key`; `401 invalid_api_key`; `409 idempotency_key_reused` ou `external_id_conflict`; `422 appointment_not_in_allowed_period` ou `no_send_window_before_appointment`.
- **Idempotência:** mesma conta, chave e corpo retorna o mesmo `202` e corpo original durante 48 horas; mesma chave com corpo diferente retorna `409`. Rejeições não são armazenadas para replay.
- **Regras:** BR-05 a BR-10.

### API-12 — Receber callback da Z-API

`POST /v1/providers/z-api/callbacks/{callbackToken}`

- **Caso de uso:** UC-13; requisito RF-07.
- **Acesso:** `callbackToken` aleatório e exclusivo; o Confirma também exige que `instanceId` e dados da mensagem pertençam à integração. Não há presunção de assinatura criptográfica da Z-API.
- **Eventos consumidos:**
    - `MessageStatusCallback`: usa `instanceId`, `status`, `ids`, `phone` e `type`; somente status necessário para comprovar envio altera o agendamento.
    - `ReceivedCallBack`: usa `instanceId`, `phone`, `fromMe`, `isGroup`, `messageId`, `referenceMessageId`, `type` e `text.message`; somente texto recebido, não enviado pelo próprio número e fora de grupo é candidato a resposta.
    - callback de envio/falha documentado pela Z-API: usa identificadores da mensagem e resultado para confirmar envio ou falha elegível.
- **Resposta:** `204` para evento válido, inclusive duplicado ou irrelevante; `400` para estrutura desconhecida; `401` para token ou instância incompatível; `404` para integração inexistente.
- **Comportamento:** processamento é idempotente. Resposta `1` produz `confirmed`; `2`, `declined`; conteúdo diferente ou correlação ambígua não altera estado.
- **Referência externa:** os payloads devem acompanhar os contratos oficiais vigentes de callbacks recebidos e status da Z-API, sem ampliar os campos de domínio expostos pelo Confirma.

### API-13 — Entregar webhook do Confirma

`POST {configuredWebhookUrl}`

- **Caso de uso:** UC-15; requisito RF-09.
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
- **Verificação esperada:** calcular sobre os bytes exatos recebidos, comparar em tempo constante, tolerar no máximo 5 minutos de diferença no timestamp e deduplicar por `eventId`.
- **Entrega:** timeout de 5 segundos; tentativas imediata, +1 minuto, +5 minutos e +15 minutos. Qualquer 2xx conclui. Erro de conexão, timeout, 408, 429 e 5xx retentam; outros 4xx encerram. Falha não altera o agendamento.

## Regras compartilhadas

- Operações autenticadas por cookie validam a conta da sessão; operações com API Key validam a conta associada à chave.
- Respostas síncronas informam somente aceitação ou rejeição da solicitação. Envio, resposta e resultado são assíncronos e comunicados por API-13.
- O Confirma envia texto pela Z-API em `POST /instances/{id}/token/{token}/send-text`, com `Client-Token` e corpo `phone` sem formatação e `message`. A resposta de sucesso fornece identificadores para correlação, mas não produz `sent` sem callback.
- O telefone E.164 recebido em API-11 é convertido apenas no limite da Z-API para o formato numérico exigido pelo provedor.
- Eventos e callbacks podem ser repetidos; consumidores e o Confirma devem processá-los idempotentemente.
