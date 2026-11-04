---
version: beta
name: 'confirma-domain'
description: 'Domínio e regras do fluxo de confirmação do Confirma Beta'
actors:
    - {
          id: ACT-01,
          name: 'Desenvolvedor',
          responsibility: 'Criar a conta e configurar a integração.',
      }
    - {
          id: ACT-02,
          name: 'Sistema integrado',
          responsibility: 'Criar agendamentos e consumir webhooks.',
      }
    - {
          id: ACT-03,
          name: 'Paciente de teste',
          responsibility: 'Responder à confirmação pelo WhatsApp.',
      }
    - {
          id: ACT-04,
          name: 'Z-API',
          responsibility: 'Enviar mensagens e comunicar eventos.',
      }
entities:
    - {
          id: ENT-01,
          name: 'Convite',
          purpose: 'Autorizar uma criação de conta.',
          attributes: ['e-mail', 'token', 'expiração', 'situação'],
          relationships: ['Autoriza uma Conta.'],
      }
    - {
          id: ENT-02,
          name: 'Conta',
          purpose: 'Delimitar o participante e seus dados.',
          attributes: ['identificador', 'e-mail', 'credencial'],
          relationships: ['Possui Configuração, API Key e Agendamentos.'],
      }
    - {
          id: ENT-03,
          name: 'Configuração de integração',
          purpose: 'Reunir parâmetros de envio e notificações.',
          attributes:
              [
                  'janela',
                  'fuso IANA',
                  'webhook',
                  'credenciais Z-API',
                  'identificador secreto do callback',
              ],
          relationships: ['Pertence a uma Conta.'],
      }
    - {
          id: ENT-04,
          name: 'API Key',
          purpose: 'Autenticar o sistema integrado.',
          attributes: ['valor secreto', 'data de geração'],
          relationships: ['Pertence a uma Conta.'],
      }
    - {
          id: ENT-05,
          name: 'Agendamento',
          purpose: 'Representar a solicitação e seu resultado.',
          attributes:
              [
                  'id',
                  'externalId',
                  'patientName',
                  'patientPhone',
                  'scheduledAt',
                  'serviceName',
                  'locationName',
                  'estado',
                  'correlação do provedor',
                  'motivo de falha',
              ],
          relationships: ['Pertence a uma Conta e origina Eventos.'],
      }
    - {
          id: ENT-06,
          name: 'Registro de idempotência',
          purpose: 'Preservar o resultado de uma criação aceita.',
          attributes: ['chave', 'conteúdo', 'resposta', 'expiração'],
          relationships: ['Pertence a uma Conta e referencia um Agendamento.'],
      }
    - {
          id: ENT-07,
          name: 'Evento de webhook',
          purpose: 'Comunicar um fato essencial.',
          attributes:
              [
                  'id',
                  'tipo',
                  'estado',
                  'instante',
                  'motivo',
                  'situação da entrega',
              ],
          relationships: ['Referencia um Agendamento.'],
      }
business-rules:
    - { id: BR-01, description: 'Convite expira em 72 horas e tem uso único.' }
    - {
          id: BR-02,
          description: 'Somente sessão válida opera a própria configuração e API Key.',
      }
    - {
          id: BR-03,
          description: 'A janela diária tem início inclusivo, fim exclusivo, fuso IANA e não atravessa meia-noite.',
      }
    - { id: BR-04, description: 'Webhooks de entrada e saída usam HTTPS.' }
    - {
          id: BR-05,
          description: 'scheduledAt deve ser futuro, ter deslocamento explícito e não superar 24 horas do recebimento; o limite é aceito e comparado em UTC.',
      }
    - {
          id: BR-06,
          description: 'patientPhone usa E.164 e externalId é único por conta.',
      }
    - {
          id: BR-07,
          description: 'A criação exige Idempotency-Key por conta; somente aceites são retidos por 48 horas.',
      }
    - {
          id: BR-08,
          description: 'Mesma chave e conteúdo retorna a resposta original; mesma chave com outro conteúdo ou novo chave para externalId existente retorna conflito.',
      }
    - {
          id: BR-09,
          description: 'O aceite é atômico quanto a agendamento e trabalho de envio.',
      }
    - {
          id: BR-10,
          description: 'Sem instante permitido antes de scheduledAt, a criação é rejeitada.',
      }
    - {
          id: BR-11,
          description: 'Tentativas não começam fora da janela nem em scheduledAt ou depois.',
      }
    - {
          id: BR-12,
          description: 'A mensagem fixa inclui nome, data e hora; serviço e local são incluídos quando informados.',
      }
    - {
          id: BR-13,
          description: 'Há até três tentativas: primeira no instante permitido, segunda 30 segundos depois e terceira 2 minutos após a segunda, respeitando BR-11.',
      }
    - {
          id: BR-14,
          description: 'Somente HTTP 429, 5xx, falha transitória explícita ou falha confirmada por callback permitem retentativa.',
      }
    - {
          id: BR-15,
          description: 'Aceite do provedor impede reenvio por callback ausente; timeout de resultado desconhecido não é reenviado.',
      }
    - {
          id: BR-16,
          description: 'Aceite da Z-API não confirma envio; sent depende de callback de envio.',
      }
    - {
          id: BR-17,
          description: 'Somente texto exatamente 1 ou 2 produz confirmed ou declined.',
      }
    - {
          id: BR-18,
          description: 'Resposta é correlacionada por instância, telefone e, quando disponível, mensagem original; ambiguidade não altera estado.',
      }
    - {
          id: BR-19,
          description: 'Resposta desconhecida não altera estado, não reenvia, não conversa e não gera confirmação ou recusa.',
      }
    - {
          id: BR-20,
          description: 'Resposta válida pode concluir antes do callback de envio; estados terminais não mudam.',
      }
    - {
          id: BR-21,
          description: 'Em scheduledAt, envio sem resposta produz expired; ausência de envio produz failed.',
      }
    - {
          id: BR-22,
          description: 'Rejeição da API não gera webhook; queued, sent e cada resultado terminal geram seu evento correspondente.',
      }
    - {
          id: BR-23,
          description: 'Webhook usa HMAC-SHA256 de timestamp + ponto + rawBody e mantém eventId entre entregas duplicadas.',
      }
    - {
          id: BR-24,
          description: 'Entrega tem até quatro tentativas: imediata, após 1 minuto, mais 5 minutos e mais 15 minutos; timeout de 5 segundos.',
      }
    - {
          id: BR-25,
          description: 'HTTP 2xx conclui; conexão, timeout, 408, 429 e 5xx retentam; demais 4xx encerram.',
      }
    - { id: BR-26, description: 'Falha do webhook não altera o agendamento.' }
    - {
          id: BR-27,
          description: 'Segredos não são retornados depois de configurados nem armazenados em texto puro.',
      }
    - {
          id: BR-28,
          description: 'Callback Z-API é associado por identificador secreto e conferido contra instância e mensagem; isso não é assinatura da origem.',
      }
use-cases:
    - {
          id: UC-01,
          actor: ACT-01,
          goal: 'Solicitar convite.',
          preconditions: ['E-mail válido.'],
          main-flow: ['Enviar e-mail.', 'Enviar convite.'],
          outcome: 'Convite válido por 72 horas.',
      }
    - {
          id: UC-02,
          actor: ACT-01,
          goal: 'Criar conta.',
          preconditions: ['Convite válido.'],
          main-flow:
              [
                  'Informar token, e-mail e senha.',
                  'Criar conta e consumir convite.',
              ],
          outcome: 'Conta criada.',
      }
    - {
          id: UC-03,
          actor: ACT-01,
          goal: 'Entrar.',
          preconditions: ['Conta existente.'],
          main-flow: ['Informar credenciais.', 'Criar sessão de 8 horas.'],
          outcome: 'Cookie de sessão emitido.',
      }
    - {
          id: UC-04,
          actor: ACT-01,
          goal: 'Sair.',
          preconditions: ['Cookie presente.'],
          main-flow: ['Solicitar logout.', 'Remover cookie.'],
          outcome: 'Cookie removido.',
      }
    - {
          id: UC-05,
          actor: ACT-01,
          goal: 'Consultar usuário.',
          preconditions: ['Sessão válida.'],
          main-flow: ['Solicitar usuário.', 'Retornar identidade.'],
          outcome: 'Usuário identificado.',
      }
    - {
          id: UC-06,
          actor: ACT-01,
          goal: 'Consultar configuração.',
          preconditions: ['Sessão válida.'],
          main-flow:
              ['Solicitar configuração.', 'Retornar dados não secretos.'],
          outcome: 'Configuração consultada.',
      }
    - {
          id: UC-07,
          actor: ACT-01,
          goal: 'Definir janela.',
          preconditions: ['Sessão válida.'],
          main-flow: ['Informar horários e fuso.', 'Validar e salvar.'],
          outcome: 'Janela configurada.',
      }
    - {
          id: UC-08,
          actor: ACT-01,
          goal: 'Gerar API Key.',
          preconditions: ['Sessão válida.'],
          main-flow: ['Solicitar geração.', 'Exibir nova chave uma vez.'],
          outcome: 'Nova chave ativa; anterior invalidada.',
      }
    - {
          id: UC-09,
          actor: ACT-01,
          goal: 'Configurar webhook.',
          preconditions: ['Sessão válida.'],
          main-flow: ['Informar URL e segredo.', 'Validar e salvar.'],
          outcome: 'Destino configurado.',
      }
    - {
          id: UC-10,
          actor: ACT-01,
          goal: 'Configurar Z-API.',
          preconditions: ['Sessão e credenciais válidas.'],
          main-flow: ['Informar credenciais.', 'Registrar callback secreto.'],
          outcome: 'Instância configurada.',
      }
    - {
          id: UC-11,
          actor: ACT-02,
          goal: 'Criar agendamento.',
          preconditions: ['API Key, integração e Idempotency-Key válidas.'],
          main-flow:
              ['Enviar dados.', 'Validar regras.', 'Criar queued e aceitar.'],
          outcome: 'Aceite único ou rejeição síncrona.',
      }
    - {
          id: UC-12,
          actor: ACT-04,
          goal: 'Enviar mensagem.',
          preconditions: ['queued e instante permitido.'],
          main-flow:
              [
                  'Enviar texto.',
                  'Retentar se elegível.',
                  'Confirmar sent por callback.',
              ],
          outcome: 'sent ou failed.',
      }
    - {
          id: UC-13,
          actor: ACT-04,
          goal: 'Processar callback.',
          preconditions: ['URL secreta válida.'],
          main-flow:
              [
                  'Validar e classificar.',
                  'Correlacionar.',
                  'Aplicar transição.',
              ],
          outcome: 'Evento processado uma vez.',
      }
    - {
          id: UC-14,
          actor: ACT-02,
          goal: 'Obter resultado temporal.',
          preconditions: ['Não terminal em scheduledAt.'],
          main-flow:
              ['Verificar envio e resposta.', 'Marcar expired ou failed.'],
          outcome: 'Estado terminal.',
      }
    - {
          id: UC-15,
          actor: ACT-02,
          goal: 'Receber evento.',
          preconditions: ['Webhook configurado.'],
          main-flow: ['Assinar e enviar.', 'Retentar falha transitória.'],
          outcome: 'Entrega concluída ou encerrada.',
      }
states:
    - entity: ENT-05
      transitions:
          [
              'aceite -> queued',
              'queued -> sent',
              'queued -> confirmed',
              'queued -> declined',
              'queued -> failed',
              'sent -> confirmed',
              'sent -> declined',
              'sent -> expired',
          ]
---

# Domínio — Confirma

## Atores

- **ACT-01 — Desenvolvedor:** solicita convite, cria a conta e administra a própria integração.
- **ACT-02 — Sistema integrado:** cria agendamentos e recebe eventos assinados.
- **ACT-03 — Paciente de teste:** responde à mensagem com dados fictícios.
- **ACT-04 — Z-API:** provedor exclusivo de envio e callbacks do Beta.

## Entidades e relacionamentos

- **ENT-01 — Convite:** autorização temporária, vinculada ao e-mail, para criar uma ENT-02 uma vez.
- **ENT-02 — Conta:** limite de isolamento que possui ENT-03, uma ENT-04 ativa, ENT-05 e ENT-06.
- **ENT-03 — Configuração de integração:** janela, fuso, webhook, Z-API e identificador secreto pertencentes à conta.
- **ENT-04 — API Key:** segredo que autentica ACT-02 em nome da conta.
- **ENT-05 — Agendamento:** solicitação de confirmação com identificadores, dados do paciente, horário, estado e correlação externa.
- **ENT-06 — Registro de idempotência:** chave, conteúdo e resposta aceita preservados por 48 horas.
- **ENT-07 — Evento de webhook:** fato associado à ENT-05 e entregue conforme ENT-03.

## Regras de negócio

As regras normativas BR-01 a BR-28 estão no frontmatter. Elas regem acesso, configuração, tempo, unicidade, idempotência, janela, retentativas, correlação, estados e webhooks.

## Casos de uso

### UC-01 a UC-05 — Acesso ao Beta

- **Ator:** ACT-01
- **Objetivo:** solicitar convite, criar conta, entrar, sair e consultar o usuário.
- **Pré-condições:** credencial correspondente válida.
- **Fluxo principal:** validar convite, credenciais ou sessão e executar a operação sobre a conta.
- **Fluxos alternativos essenciais:** convite expirado/usado, e-mail já cadastrado e credenciais inválidas são rejeitados sem alterar a conta.
- **Pós-condições:** convite enviado/consumido ou sessão criada/removida/consultada.
- **Regras relacionadas:** BR-01, BR-02.

### UC-06 a UC-10 — Configuração

- **Ator:** ACT-01
- **Objetivo:** consultar e configurar janela, API Key, webhook e Z-API.
- **Pré-condições:** sessão válida e dados exigidos.
- **Fluxo principal:** validar e substituir a configuração correspondente.
- **Fluxos alternativos essenciais:** janela, fuso, HTTPS ou credenciais inválidas impedem a alteração.
- **Pós-condições:** integração apta ao teste sem exposição posterior dos segredos.
- **Regras relacionadas:** BR-02 a BR-04, BR-27, BR-28.

### UC-11 — Criar agendamento

- **Ator:** ACT-02
- **Objetivo:** submeter um agendamento ao processamento assíncrono.
- **Pré-condições:** API Key, configuração e Idempotency-Key válidas.
- **Fluxo principal:** validar, criar uma ENT-05 em `queued`, registrar ENT-06 e retornar aceite.
- **Fluxos alternativos essenciais:** validação retorna erro; conflito retorna 409; replay idêntico retorna a resposta original.
- **Pós-condições:** agendamento e trabalho criados uma vez, ou nenhuma criação.
- **Regras relacionadas:** BR-05 a BR-10.

### UC-12 — Enviar mensagem

- **Ator:** ACT-04, acionado pelo Confirma.
- **Objetivo:** entregar a solicitação fixa.
- **Pré-condições:** `queued` e instante permitido.
- **Fluxo principal:** enviar texto, guardar identificadores e aguardar callback para `sent`.
- **Fluxos alternativos essenciais:** falha elegível retenta; resultado desconhecido não reenvia; esgotamento ou prazo produz `failed`.
- **Pós-condições:** `sent`, tentativa pendente ou `failed`.
- **Regras relacionadas:** BR-11 a BR-16.

### UC-13 — Processar callback Z-API

- **Ator:** ACT-04
- **Objetivo:** refletir envio ou resposta no agendamento correto.
- **Pré-condições:** URL secreta associada.
- **Fluxo principal:** validar, classificar, correlacionar e transicionar.
- **Fluxos alternativos essenciais:** duplicata é inócua; instância divergente é rejeitada; resposta desconhecida ou ambígua não altera estado.
- **Pós-condições:** evento processado uma vez.
- **Regras relacionadas:** BR-16 a BR-20, BR-28.

### UC-14 — Encerrar no limite temporal

- **Ator:** ACT-02, beneficiário do resultado.
- **Objetivo:** obter resultado terminal em `scheduledAt`.
- **Pré-condições:** agendamento não terminal.
- **Fluxo principal:** envio sem resposta produz `expired`.
- **Fluxo alternativo essencial:** ausência de envio produz `failed`.
- **Pós-condições:** estado terminal e evento criado.
- **Regras relacionadas:** BR-20 a BR-22.

### UC-15 — Entregar webhook

- **Ator:** ACT-02
- **Objetivo:** receber fatos sem polling.
- **Pré-condições:** evento e webhook configurado.
- **Fluxo principal:** assinar, enviar e aceitar HTTP 2xx.
- **Fluxos alternativos essenciais:** falha transitória retenta; falha permanente ou esgotamento encerra.
- **Pós-condições:** entrega concluída ou encerrada sem mudar o agendamento.
- **Regras relacionadas:** BR-22 a BR-26.

## Estados e transições

- `queued`: aceito, aguardando envio ou callback conclusivo.
- `sent`: envio confirmado pelo provedor.
- `confirmed`: resposta `1`; terminal.
- `declined`: resposta `2`; terminal, sem cancelar no sistema de origem.
- `expired`: enviado sem resposta válida até `scheduledAt`; terminal.
- `failed`: envio não concluído antes do limite; terminal.

Uma resposta válida pode causar `queued → confirmed` ou `queued → declined` antes do callback de envio. Eventos posteriores não retiram um estado terminal.
