---
version: beta
name: 'confirma-landing-ui'
description: 'Especificação funcional da landing page institucional e do formulário de acesso ao Beta.'

screens:
    - id: LANDING-UI-01
      name: 'Hero — apresentação do produto'
      path: '/#hero'
      purpose: 'Explicar o que é o Confirma, o problema que resolve e como o desenvolvedor solicita acesso ao Beta.'
      actors: [ACT-01]
      access: 'Público.'
      requirements: []
      use-cases: []
      data:
          - 'Título principal e descrição da proposta do Confirma.'
          - 'CTA principal que leva ao formulário de acesso na mesma página.'
      actions:
          - name: 'Ir para solicitação de acesso'
            endpoint: 'Sem requisição'
            trigger: 'Ativação do CTA principal.'
            result: 'Navegar para a seção LANDING-UI-03 na mesma página.'
      states:
          - 'Inicial: conteúdo informativo disponível.'
      navigation:
          - 'CTA aponta para LANDING-UI-03.'
    - id: LANDING-UI-02
      name: 'Como funciona'
      path: '/#como-funciona'
      purpose: 'Resumir em três etapas o fluxo de integração.'
      actors: [ACT-01]
      access: 'Público.'
      requirements: []
      use-cases: []
      data:
          - 'Enviar o agendamento à API.'
          - 'O Confirma valida, organiza o processamento e envia a mensagem respeitando a configuração.'
          - 'O Confirma processa a resposta e notifica o sistema por webhook.'
      actions: []
      states:
          - 'Inicial: conteúdo estático e informativo, sem operação de teste.'
      navigation:
          - 'A navegação da página pode apontar para a seção LANDING-UI-03.'
    - id: LANDING-UI-03
      name: 'Acesso ao Beta'
      path: '/#beta'
      purpose: 'Permitir que o desenvolvedor solicite convite para o Beta.'
      actors: [ACT-01]
      access: 'Público.'
      requirements: [RF-01]
      use-cases: [UC-01]
      data:
          - 'Endereço de e-mail fornecido pelo interessado.'
          - 'Mensagem de confirmação genérica após a solicitação.'
      actions:
          - name: 'Solicitar acesso'
            endpoint: 'API-01'
            trigger: 'Envio do formulário com e-mail preenchido e válido.'
            result: 'Enviar somente email; após HTTP 202, orientar a verificar o e-mail sem revelar se já existe conta ou convite.'
      states:
          - 'Inicial: campo email obrigatório e botão de envio.'
          - 'Carregamento: impedir envio repetido e indicar processamento.'
          - 'Sucesso: HTTP 202 exibe confirmação neutra para verificar o e-mail.'
          - 'Erro: erro de formato é indicado junto ao campo; HTTP 400 e falha de transporte informam que a solicitação não foi concluída e permitem nova tentativa. Preservar o e-mail.'
      navigation:
          - 'A solicitação bem-sucedida mantém o visitante nesta seção.'
          - 'O convite enviado por e-mail conduz ao fluxo de aceite documentado na interface do painel.'
---

# UI — Landing do Confirma

## Página e seções

A landing é uma única página pública, composta somente pelas três seções abaixo. O conteúdo apresenta o Beta de teste; não deve sugerir que agendamentos reais de clínicas são processados.

| ID            | Seção                          | Âncora           | Objetivo                                        | Referências            |
| ------------- | ------------------------------ | ---------------- | ----------------------------------------------- | ---------------------- |
| LANDING-UI-01 | Hero — apresentação do produto | `#hero`          | Explicar produto, problema e proposta de valor. | Overview               |
| LANDING-UI-02 | Como funciona                  | `#como-funciona` | Resumir o fluxo em três passos.                 | RF-04 a RF-09          |
| LANDING-UI-03 | Acesso ao Beta                 | `#beta`          | Solicitar convite por e-mail.                   | RF-01 · UC-01 · API-01 |

### LANDING-UI-01 — Hero — apresentação do produto

- **Objetivo:** comunicar que o Confirma integra a confirmação de agendamentos de teste via WhatsApp a sistemas de gestão de clínicas por API, reduzindo o trabalho de implementar e manter filas, envio, processamento de respostas e notificações.
- **Conteúdo:** título principal, descrição breve e CTA para acesso ao Beta.
- **Alinhamento requerido:** conteúdo centralizado.
- **Comportamento:** o CTA navega à seção `#beta` na mesma página; não solicita dados nem chama a API.
- **Referências:** `docs/specs/overview.md`.

### LANDING-UI-02 — Como funciona

- **Objetivo:** tornar o fluxo compreensível sem explicar detalhes de implementação da API.
- **Conteúdo em três etapas:**
    1. **Envie o agendamento:** o sistema integrado envia os dados necessários à API do Confirma.
    2. **O Confirma processa:** valida o agendamento, organiza o processamento e envia a mensagem ao paciente pelo WhatsApp respeitando a configuração da integração.
    3. **Receba o resultado:** o Confirma processa a resposta e notifica o sistema integrado por webhook.
- **Interações:** nenhuma; seção apenas informativa.
- **Referências:** RF-04 a RF-09 em `docs/specs/overview.md`.

### LANDING-UI-03 — Acesso ao Beta

- **Objetivo:** solicitar convite para o Beta.
- **Dados coletados:** somente `email`, obrigatório e validado quanto ao formato antes do envio. A validação do backend continua definitiva.
- **Ação e API:** `API-01 — POST /api/v1/invitations`, enviando `{ "email": "..." }` conforme `docs/specs/api.md`.
- **Sucesso:** HTTP 202 mostra uma confirmação neutra e instrui verificar o e-mail. O visitante permanece na página; a API envia o convite automaticamente conforme seu contrato.
- **Erro:** HTTP 400 é associado ao campo de e-mail/corpo; erro de transporte permite nova tentativa. Preservar o e-mail. A interface não informa se o endereço já possui convite ou conta.
- **Referências:** RF-01, UC-01 e API-01.

## Fluxo de navegação

1. **LANDING-UI-01 → LANDING-UI-03:** o CTA principal leva ao formulário de acesso na mesma página.
2. **LANDING-UI-02 → LANDING-UI-03:** um link de navegação, se apresentado, aponta para a mesma seção de acesso.
3. **LANDING-UI-03 → fluxo do painel:** o desenvolvedor segue o link recebido por e-mail para aceitar o convite.

## Limites

A página contém apenas Hero, Como funciona e Acesso ao Beta. Não inclui cadastro direto, login, demonstração de API, formulário adicional ou conteúdo comercial.
