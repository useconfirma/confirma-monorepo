---
version: beta
name: 'confirma-overview'
description: 'Visão funcional do Beta fechado do Confirma'
product:
    name: 'Confirma'
    audience:
        - 'Desenvolvedores de sistemas de gestão de clínicas convidados para o Beta'
    problem: 'Sistemas integrados precisam implementar filas, mensagens, respostas, retentativas e notificações para confirmar agendamentos pelo WhatsApp.'
    value-proposition: 'Delegar ao Confirma o fluxo de confirmação e receber seus resultados por webhook através de uma API única.'
mvp:
    objective: 'Validar, com dados fictícios, a integração ponta a ponta entre um sistema de origem, o Confirma e a Z-API.'
    primary-actor: 'ACT-01'
    main-flow:
        - 'O desenvolvedor convidado cria seu usuário e sua account e configura a integração.'
        - 'O sistema integrado cria um agendamento de teste autenticado e idempotente.'
        - 'O Confirma envia a mensagem, interpreta a resposta e notifica o sistema integrado.'
    capabilities:
        - {
              id: RF-01,
              description: 'Permitir acesso ao Beta por convite e autenticação do desenvolvedor.',
          }
        - {
              id: RF-02,
              description: 'Permitir consultar e configurar a integração pelo painel.',
          }
        - {
              id: RF-03,
              description: 'Permitir gerar a API Key do sistema integrado.',
          }
        - {
              id: RF-04,
              description: 'Receber e validar criações autenticadas e idempotentes de agendamentos de teste.',
          }
        - {
              id: RF-05,
              description: 'Processar os agendamentos aceitos de forma assíncrona dentro da janela permitida.',
          }
        - {
              id: RF-06,
              description: 'Enviar a mensagem fixa pela Z-API e aplicar retentativas elegíveis.',
          }
        - {
              id: RF-07,
              description: 'Receber, correlacionar e interpretar eventos da Z-API.',
          }
        - {
              id: RF-08,
              description: 'Manter o estado do agendamento até um resultado terminal.',
          }
        - {
              id: RF-09,
              description: 'Entregar ao sistema integrado webhooks assinados com os eventos essenciais.',
          }
    success-criterion: 'Um desenvolvedor convidado executa consistentemente o fluxo de teste desde a configuração até o recebimento, em seu webhook, do resultado de uma resposta pelo WhatsApp.'
---

# Overview — Confirma

## Visão geral

O Confirma é uma plataforma de confirmação de agendamentos via WhatsApp integrada, por API REST, a sistemas de gestão de clínicas. No Beta fechado, desenvolvedores convidados usam exclusivamente dados fictícios para validar o fluxo completo de envio, resposta e notificação.

## Problema e proposta de valor

- **Problema:** cada sistema precisaria implementar validação temporal, filas, comunicação com o provedor, correlação de respostas, retentativas e webhooks.
- **Solução:** o sistema de origem envia o agendamento uma vez e o Confirma coordena o restante do fluxo com a Z-API.
- **Resultado esperado:** o sistema integrado recebe por webhook o estado e o resultado da confirmação, sem consultar continuamente a API.

## Público e atores

- **ACT-01 — Desenvolvedor:** cria sua conta e configura a integração.
- **ACT-02 — Sistema integrado:** cria agendamentos e recebe notificações.
- **ACT-03 — Paciente de teste:** recebe a mensagem e responde `1` ou `2`.
- **ACT-04 — Z-API:** envia mensagens e comunica eventos do WhatsApp.

Os mesmos IDs são detalhados em `domain.md`.

## Fluxo principal

1. O desenvolvedor solicita um convite, cria sua conta, autentica-se e configura API Key, webhook, janela de envio, fuso e Z-API.
2. O sistema integrado solicita a criação de um agendamento com API Key e chave de idempotência.
3. O Confirma valida dados, antecedência máxima de 24 horas e existência de horário permitido para envio.
4. Uma solicitação válida recebe aceite assíncrono e entra em `queued`; uma inválida é rejeitada sincronamente.
5. Dentro da janela, o Confirma envia a mensagem fixa pela Z-API e trata as falhas elegíveis.
6. A Z-API comunica o envio e encaminha a resposta do paciente.
7. O Confirma correlaciona os eventos, atualiza o estado e envia os webhooks correspondentes.

## Capacidades do Beta

- **RF-01 — Acesso:** solicitar convite, verificar o convite, criar usuário e account (com nome) por convite válido e de uso único, entrar, sair e consultar o usuário. Casos: UC-01 a UC-04, UC-06 e UC-16.
- **RF-02 — Configuração:** consultar a account com toda a configuração em uma única requisição e definir janela diária, fuso IANA, webhook e instância Z-API. Casos: UC-05, UC-07, UC-09 e UC-10.
- **RF-03 — API Key:** gerar a credencial apresentada uma única vez. Caso: UC-08.
- **RF-04 — Criação:** aceitar ou rejeitar sincronamente uma criação autenticada e idempotente. Caso: UC-11.
- **RF-05 — Processamento:** encaminhar o agendamento aceito para o próximo instante permitido. Caso: UC-12.
- **RF-06 — Envio:** enviar a mensagem fixa e limitar retentativas às falhas e prazos definidos. Caso: UC-12.
- **RF-07 — Eventos:** receber callbacks e interpretar exclusivamente `1` e `2`. Caso: UC-13.
- **RF-08 — Ciclo de vida:** refletir envio, confirmação, recusa, expiração ou falha. Casos: UC-12 a UC-14.
- **RF-09 — Notificações:** entregar eventos assinados e aplicar retentativas. Caso: UC-15.

## Critério de validação

O Beta é funcional quando um desenvolvedor convidado consegue configurar a integração, criar um agendamento válido com dados fictícios, receber e responder à mensagem e receber em seu sistema um webhook assinado com o resultado. Rejeições síncronas, idempotência e falhas essenciais devem seguir os comportamentos especificados.

## Estágio da implementação

O acesso por convite, cadastro, login, logout, consulta do usuário e consulta da account já usa persistência e providers reais na API. As configurações de integração ainda possuem respostas simuladas. As rotas de criação de agendamento e callback da Z-API, assim como o processamento e a entrega de webhooks, ainda não estão implementados. O fluxo completo descrito acima é o objetivo de validação do Beta, não uma capacidade já concluída.
