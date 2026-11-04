---
version: beta
name: 'confirma-documentation-ui'
description: 'Especificação funcional do portal estático de documentação da API Confirma Beta.'

screens:
    - id: DOCS-UI-01
      name: 'Introdução'
      path: '/docs'
      purpose: 'Explicar a proposta do Confirma e apresentar o fluxo geral da integração.'
      actors: [ACT-01]
      access: 'Público e estático.'
      requirements: []
      use-cases: []
      data:
          - 'Descrição do serviço e público-alvo.'
          - 'Visão resumida do fluxo sistema integrado → Confirma → WhatsApp → webhook.'
      actions:
          - name: 'Navegar para conteúdo técnico'
            endpoint: 'Sem requisição'
            trigger: 'Ativação de item de navegação ou link contextual.'
            result: 'Abrir a página técnica correspondente.'
      states: ['Conteúdo estático disponível; não exige login.']
      navigation: ['Liga a DOCS-UI-02 e às páginas da navegação técnica.']
    - id: DOCS-UI-02
      name: 'Primeiros passos'
      path: '/docs/quickstart'
      purpose: 'Orientar a sequência mínima de preparação e primeira chamada à API.'
      actors: [ACT-01]
      access: 'Público e estático.'
      requirements: [RF-01, RF-02, RF-03, RF-04]
      use-cases: [UC-01, UC-02, UC-03, UC-06, UC-07, UC-08, UC-09, UC-10, UC-11]
      data:
          - 'Passos para obter convite, criar conta e entrar no painel.'
          - 'Passos para configurar a integração e gerar a API Key no painel.'
          - 'Sequência de configuração do webhook antes de testar agendamentos.'
          - 'Exemplo de primeira criação conforme API-11 e link ao tópico de autenticação.'
      actions:
          - name: 'Abrir referência relacionada'
            endpoint: 'Sem requisição'
            trigger: 'Ativação de link para autenticação, agendamentos ou webhooks.'
            result: 'Abrir a página de referência correspondente.'
      states:
          [
              'Conteúdo estático; links levam a páginas relacionadas e às instruções do painel.',
          ]
      navigation:
          ['Retorna à DOCS-UI-01; liga a DOCS-UI-03, DOCS-UI-04 e DOCS-UI-05.']
    - id: DOCS-UI-03
      name: 'Autenticação'
      path: '/docs/authentication'
      purpose: 'Explicar a autenticação de chamadas públicas com API Key.'
      actors: [ACT-01]
      access: 'Público e estático.'
      requirements: [RF-03, RF-04]
      use-cases: [UC-08, UC-11]
      data:
          - 'Uso do cabeçalho Authorization Bearer com a API Key gerada no painel.'
          - 'Cuidados de tratamento e não exposição da chave.'
          - 'Interpretação do erro 401 definido para a API de agendamentos.'
      actions: []
      states:
          [
              'Conteúdo estático; nenhum segredo é solicitado ou armazenado pela documentação.',
          ]
      navigation: ['Liga a DOCS-UI-02 e DOCS-UI-04.']
    - id: DOCS-UI-04
      name: 'Agendamentos'
      path: '/docs/appointments'
      purpose: 'Descrever criação de agendamento, validações e natureza assíncrona do aceite.'
      actors: [ACT-01]
      access: 'Público e estático.'
      requirements: [RF-04, RF-05, RF-06, RF-08]
      use-cases: [UC-11, UC-12, UC-14]
      data:
          - 'Campos obrigatórios e opcionais, regras de validação e janela de envio referenciadas a API-11 e domain.md.'
          - 'Exemplo de request e resposta HTTP 202 conforme API-11.'
          - 'Explicação da Idempotency-Key e respostas síncronas de erro documentadas em API-11.'
          - 'Distinção entre aceite para processamento e resultado final comunicado por webhook.'
      actions: []
      states: ['Conteúdo estático; exemplos não executam requisições.']
      navigation: ['Liga a DOCS-UI-03, DOCS-UI-05 e DOCS-UI-06.']
    - id: DOCS-UI-05
      name: 'Webhooks'
      path: '/docs/webhooks'
      purpose: 'Explicar eventos de saída, assinatura, verificação e política de entrega.'
      actors: [ACT-01]
      access: 'Público e estático.'
      requirements: [RF-09]
      use-cases: [UC-09, UC-15]
      data:
          - 'Eventos, payload comum, cabeçalhos e assinatura de API-13.'
          - 'Procedimento de verificação do HMAC-SHA256 e deduplicação por eventId, conforme API-13.'
          - 'Códigos HTTP que confirmam entrega e condições documentadas para retentativas.'
          - 'Referência à configuração do webhook no painel e API-09.'
      actions: []
      states:
          [
              'Conteúdo estático; exemplos são ilustrativos e não recebem eventos.',
          ]
      navigation: ['Liga a DOCS-UI-02, DOCS-UI-04 e DOCS-UI-06.']
    - id: DOCS-UI-06
      name: 'Erros'
      path: '/docs/errors'
      purpose: 'Ajudar a interpretar os erros síncronos e as respostas de entrega de webhook.'
      actors: [ACT-01]
      access: 'Público e estático.'
      requirements: [RF-04, RF-09]
      use-cases: [UC-11, UC-15]
      data:
          - 'Formato comum de erro definido em api.md.'
          - 'Erros HTTP 400, 401, 409 e 422 de API-11 e seus significados documentados.'
          - 'Respostas HTTP 2xx, falhas transitórias e falhas permanentes de API-13.'
      actions: []
      states:
          [
              'Conteúdo estático, sem envio de requisições. Usar apenas códigos e condições definidos nos contratos.',
          ]
      navigation: ['Liga a DOCS-UI-03, DOCS-UI-04 e DOCS-UI-05.']
---

# UI — Documentação técnica do Confirma

## Mapa de páginas

| ID         | Página           | Rota                   | Conteúdo principal                                    | Contratos referenciados           |
| ---------- | ---------------- | ---------------------- | ----------------------------------------------------- | --------------------------------- |
| DOCS-UI-01 | Introdução       | `/docs`                | Proposta e fluxo geral.                               | Overview                          |
| DOCS-UI-02 | Primeiros passos | `/docs/quickstart`     | Acesso, configuração e primeira chamada.              | API-01 a API-11, conforme o passo |
| DOCS-UI-03 | Autenticação     | `/docs/authentication` | API Key e cabeçalho Bearer.                           | API-11                            |
| DOCS-UI-04 | Agendamentos     | `/docs/appointments`   | Criação, validação, idempotência e aceite assíncrono. | API-11                            |
| DOCS-UI-05 | Webhooks         | `/docs/webhooks`       | Eventos, assinatura e entrega.                        | API-09, API-13                    |
| DOCS-UI-06 | Erros            | `/docs/errors`         | Erros da API e respostas de entrega.                  | API-11, API-13                    |

## Especificação das páginas

### DOCS-UI-01 — Introdução

- **Objetivo:** orientar o desenvolvedor sobre o que o Confirma faz e como os sistemas se integram.
- **Conteúdo obrigatório:** público do Beta, dados de teste e fluxo geral desde a chamada do sistema integrado até a notificação por webhook.
- **Interações:** links estáticos para Primeiros passos, Autenticação, Agendamentos e Webhooks.
- **Referências:** `docs/specs/overview.md`.

### DOCS-UI-02 — Primeiros passos

- **Objetivo:** ordenar a preparação mínima da integração.
- **Conteúdo obrigatório:** solicitar convite e aceitar convite, autenticar-se no painel, configurar janela e fuso, webhook e Z-API, gerar API Key, enviar uma primeira criação e preparar o receptor de webhook.
- **Exemplos:** link para o exemplo de criação/202 documentado em API-11; não duplicar schema completo.
- **Referências:** UC-01 a UC-11; API-01 a API-11; `docs/specs/domain.md` e `docs/specs/api.md`.
- **Interações:** links para as páginas de Autenticação, Agendamentos e Webhooks. Não executa chamadas.

### DOCS-UI-03 — Autenticação

- **Objetivo:** permitir que o desenvolvedor reproduza a autenticação exigida pela API pública.
- **Conteúdo obrigatório:** obtenção da API Key no painel e envio no cabeçalho Bearer; tratar a chave como segredo e não expô-la em clientes públicos.
- **Exemplos:** exemplo do cabeçalho `Authorization: Bearer <api-key>` usado com API-11.
- **Erros:** explicar HTTP 401 conforme API-11.
- **Referências:** UC-08, UC-11 e API-08, API-11.

### DOCS-UI-04 — Agendamentos

- **Objetivo:** documentar a operação de criação e deixar explícito que HTTP 202 significa aceite assíncrono.
- **Conteúdo obrigatório:** campos requeridos e opcionais, formato temporal, antecedência, janela, unicidade de `externalId`, `Idempotency-Key`, replay e conflitos. As regras devem apontar para domain.md e o contrato para API-11.
- **Exemplos:** exemplo de request e resposta `202` usando somente campos e formatos de API-11.
- **Respostas:** distinguir rejeições síncronas `400`, `401`, `409`, `422` de estados posteriores, recebidos via eventos de webhook.
- **Referências:** RF-04 a RF-08, UC-11, UC-12, UC-14, BR-05 a BR-16 e BR-21 a BR-22, API-11, API-13.

### DOCS-UI-05 — Webhooks

- **Objetivo:** permitir que o integrador receba e verifique eventos enviados pelo Confirma.
- **Conteúdo obrigatório:** lista de tipos de evento, corpo comum, cabeçalhos, assinatura sobre timestamp e raw body, tolerância temporal, comparação segura, deduplicação e política de retentativas.
- **Exemplos:** payload de API-13 e exemplo de formação do valor assinado, sem adicionar campos ou eventos.
- **Referências:** UC-09, UC-15, BR-23 a BR-26, API-09 e API-13.
- **Limite:** esta página documenta webhook de saída do Confirma. Callback da Z-API é integração interna e não gera configuração adicional ao sistema integrado.

### DOCS-UI-06 — Erros

- **Objetivo:** tornar recuperáveis os erros descritos nos contratos.
- **Conteúdo obrigatório:** formato comum de erro; significado das respostas de criação de agendamento API-11; e códigos de resposta esperados pelo Confirma ao entregar API-13.
- **Exemplos:** erros derivados de respostas documentadas em API-11 e API-13. Não inferir códigos que não estejam nos contratos.
- **Referências:** API-11 e API-13.

## Navegação

A navegação persistente do portal oferece seis destinos: Introdução, Primeiros passos, Autenticação, Agendamentos, Webhooks e Erros. Links contextuais entre páginas levam a pré-requisitos ou explicações relacionadas. A navegação é estática e não exige conta do Confirma.

## Limites

O portal é predominantemente estático. Não executa requisições, não autentica usuários e não inclui playground, console, busca avançada nem gerenciamento de conteúdo. Exemplos são derivados exclusivamente de `docs/specs/api.md`; regras são referenciadas em `docs/specs/domain.md`.
