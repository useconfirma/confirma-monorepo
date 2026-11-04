---
version: beta
name: 'confirma-web-ui'
description: 'Especificação funcional do painel web para acesso e configuração da integração Confirma.'

application:
    id: 'web'
    name: 'Painel web'
    audience: 'Desenvolvedores convidados do Beta'

screens:
    - id: WEB-UI-01
      name: 'Login'
      path: '/login'
      purpose: 'Autenticar um desenvolvedor com conta existente.'
      actors: [ACT-01]
      access: 'Público; usuário autenticado que acessa a tela pode seguir para WEB-UI-04.'
      requirements: [RF-01]
      use-cases: [UC-03]
      data:
          - 'E-mail e senha informados pelo desenvolvedor.'
          - 'Cookie de sessão recebido pelo navegador após autenticação.'
      actions:
          - name: 'Entrar'
            endpoint: 'API-03'
            trigger: 'Envio de e-mail e senha preenchidos.'
            result: 'HTTP 204 estabelece a sessão pelo cookie e direciona para WEB-UI-04 ou para a rota protegida solicitada originalmente.'
      states:
          - 'Inicial: formulário de login.'
          - 'Carregamento: impedir submissões repetidas enquanto aguarda a resposta.'
          - 'Sucesso: seguir ao painel após HTTP 204.'
          - 'Erro: HTTP 401 informa credenciais inválidas; preservar e-mail, limpar senha e permitir nova tentativa. Erro de transporte não deve ser apresentado como autenticação concluída.'
      navigation:
          - 'Acesso direto ou redirecionamento de rota protegida sem sessão.'
          - 'Login concluído leva a WEB-UI-04; login após WEB-UI-03 segue o fluxo de primeiro acesso.'
    - id: WEB-UI-02
      name: 'Criar conta'
      path: '/signup?token={invitationToken}'
      purpose: 'Criar uma conta usando um convite válido recebido por e-mail.'
      actors: [ACT-01]
      access: 'Público com token de convite.'
      requirements: [RF-01]
      use-cases: [UC-02]
      data:
          - 'Token do convite obtido da query string.'
          - 'E-mail associado ao convite e senha escolhida pelo desenvolvedor.'
      actions:
          - name: 'Criar conta'
            endpoint: 'API-02'
            trigger: 'Envio após preenchimento do token, e-mail e senha obrigatórios.'
            result: 'HTTP 201 confirma a criação e encaminha para WEB-UI-03; o contrato não estabelece sessão automática.'
      states:
          - 'Inicial: formulário com token presente na URL; sem token, não enviar e informar que o link está incompleto.'
          - 'Carregamento: impedir submissões repetidas.'
          - 'Sucesso: conta criada; navegar para WEB-UI-03.'
          - 'Erro: HTTP 409 informa que o e-mail já está cadastrado e oferece login; HTTP 410 informa convite inválido, usado ou expirado e oferece retorno ao login/contato para novo convite; HTTP 422 apresenta os erros de validação retornados. Preservar e-mail e senha enquanto a tela permanecer aberta.'
      navigation:
          - 'Entrada pelo link de convite recebido por e-mail.'
          - 'HTTP 201 leva a WEB-UI-03; convite indisponível pode retornar a WEB-UI-01.'
    - id: WEB-UI-03
      name: 'Boas-vindas'
      path: '/welcome'
      purpose: 'Confirmar a criação da conta e explicar o próximo passo para iniciar a configuração.'
      actors: [ACT-01]
      access: 'Público; a tela é aberta após sucesso de WEB-UI-02 e não exige endpoint nem estado persistente próprio.'
      requirements: [RF-01, RF-02, RF-03]
      use-cases: [UC-02, UC-07, UC-08, UC-09, UC-10]
      data:
          - 'Confirmação de conta criada e, se disponível na navegação atual, e-mail retornado por API-02.'
          - 'Próximas configurações necessárias: API Key, webhook, janela de envio e instância Z-API.'
      actions:
          - name: 'Continuar para login'
            endpoint: 'Sem requisição'
            trigger: 'Ação principal após a mensagem de boas-vindas.'
            result: 'Navegar para WEB-UI-01, pois API-02 não documenta autenticação automática.'
      states:
          - 'Inicial: confirmação de cadastro e orientação sobre as configurações seguintes.'
          - 'Sucesso: ação de continuar direciona ao login; a tela não salva estado de onboarding.'
      navigation:
          - 'Entrada após API-02 retornar HTTP 201.'
          - 'Continuar leva a WEB-UI-01; após login o desenvolvedor chega a WEB-UI-04.'
    - id: WEB-UI-04
      name: 'Painel de integração'
      path: '/dashboard'
      purpose: 'Consultar e configurar os elementos necessários para integrar o sistema ao Confirma.'
      actors: [ACT-01]
      access: 'Sessão autenticada pelo cookie HttpOnly; sessão inválida encaminha a WEB-UI-01.'
      requirements: [RF-02, RF-03]
      use-cases: [UC-04, UC-05, UC-06, UC-07, UC-08, UC-09, UC-10]
      data:
          - 'Identidade da conta obtida por API-05.'
          - 'Janela de envio, fuso e indicadores de configuração obtidos por API-06.'
          - 'Valores digitados para janela, webhook e credenciais Z-API.'
          - 'API Key apresentada somente na resposta imediata a API-08.'
          - 'Nenhum estado agregado de prontidão, métricas ou informação de agendamentos.'
      actions:
          - name: 'Carregar usuário e integração'
            endpoint: 'API-05, API-06'
            trigger: 'Entrada no painel ou retorno a ele.'
            result: 'Exibir usuário e valores não secretos; indicadores false/null mostram configuração pendente. HTTP 401 redireciona ao login.'
          - name: 'Salvar janela de envio'
            endpoint: 'API-07'
            trigger: 'Envio com início, fim e fuso IANA preenchidos.'
            result: 'HTTP 200 atualiza os valores apresentados; HTTP 422 indica janela ou fuso inválido e mantém os valores digitados.'
          - name: 'Gerar ou substituir API Key'
            endpoint: 'API-08'
            trigger: 'Solicitação explícita; se já existir chave, confirmar antes que ela será invalidada.'
            result: 'HTTP 201 mostra a nova chave uma vez. Não é possível consultar a chave depois; se a resposta se perder, uma nova geração substitui a anterior. HTTP 401 encaminha ao login.'
          - name: 'Salvar webhook'
            endpoint: 'API-09'
            trigger: 'Envio da URL HTTPS e do segredo preenchidos.'
            result: 'HTTP 200 atualiza URL e indicador de segredo configurado e limpa o campo secreto; HTTP 422 aponta URL/segredo inválido e mantém a tentativa na tela.'
          - name: 'Configurar instância Z-API'
            endpoint: 'API-10'
            trigger: 'Envio do ID da instância, token da instância e Client-Token.'
            result: 'HTTP 200 atualiza o ID e indicadores de credencial/callback; HTTP 422 informa falha das credenciais ou do callback e permite correção.'
          - name: 'Sair'
            endpoint: 'API-04'
            trigger: 'Ação de logout.'
            result: 'HTTP 204 remove o cookie no navegador e leva a WEB-UI-01; HTTP 401 também encerra a navegação autenticada e leva ao login.'
      states:
          - 'Inicial: valores da conta e configuração aguardam API-05 e API-06; não mostrar valores como salvos antes da resposta.'
          - 'Carregamento: indicar a operação no grupo correspondente e impedir submissão duplicada enquanto aguarda.'
          - 'Sucesso: refletir valores confirmados pela API. Manter API Key recém-gerada visível somente na sessão atual da tela, sem armazenamento local.'
          - 'Erro: HTTP 401 encaminha ao login. HTTP 422 identifica o grupo inválido, preserva campos não secretos e permite correção. Erros de transporte permitem nova tentativa, sem afirmar que a alteração foi salva.'
          - 'Sem dados: campos vazios e indicadores não configurados aparecem conforme null/false em API-06.'
          - 'Segredos: API Key anterior, segredo de webhook e tokens Z-API não podem ser consultados nem pré-preenchidos. Para salvar webhook, pedir URL e segredo; para configurar Z-API, pedir todos os três valores obrigatórios. Limpar tokens/segredo após sucesso.'
      navigation:
          - 'Login bem-sucedido abre o painel; acesso direto exige sessão válida verificada por API-05.'
          - 'Logout ou sessão inválida leva a WEB-UI-01.'
---

# UI — Painel Web Confirma

## Mapa de telas

| ID        | Tela                 | Rota                              | Acesso               | Casos de uso  |
| --------- | -------------------- | --------------------------------- | -------------------- | ------------- |
| WEB-UI-01 | Login                | `/login`                          | Público              | UC-03         |
| WEB-UI-02 | Criar conta          | `/signup?token={invitationToken}` | Público com convite  | UC-02         |
| WEB-UI-03 | Boas-vindas          | `/welcome`                        | Público após criação | UC-02         |
| WEB-UI-04 | Painel de integração | `/dashboard`                      | Sessão autenticada   | UC-04 a UC-10 |

## Especificação das telas

### WEB-UI-01 — Login

- **Objetivo:** permitir acesso de contas existentes.
- **Ator e acesso:** ACT-01; pública.
- **Referências:** RF-01 · UC-03 · API-03.
- **Campos:** `email` obrigatório com validação de formato; `password` obrigatória. Não há regra de senha adicional definida.
- **Ação:** submeter credenciais a `API-03 — POST /api/v1/sessions`.
- **Sucesso:** API retorna `204` e `Set-Cookie`; encaminhar à rota protegida originalmente solicitada ou `/dashboard`.
- **Erros:** `401` indica credenciais inválidas; manter e-mail, não reapresentar senha. Falha de transporte permite nova tentativa sem indicar sucesso.
- **Navegação:** rota protegida sem sessão leva ao login; login válido leva ao painel.

### WEB-UI-02 — Criar conta

- **Objetivo:** criar uma conta exclusivamente por convite.
- **Ator e acesso:** ACT-01; token do convite obtido pelo link recebido por e-mail.
- **Referências:** RF-01 · UC-02 · API-02.
- **Campos:** `invitationToken` obrigatório, recebido por query string; `email` obrigatório e associado ao convite; `password` obrigatória. Não adicionar nome, confirmação de senha ou outra regra não especificada no contrato.
- **Ação:** `API-02 — POST /api/v1/accounts`, enviando token, e-mail e senha.
- **Sucesso:** `201` confirma a conta e leva a WEB-UI-03. API-02 não especifica cookie de sessão; não considerar o desenvolvedor autenticado.
- **Erros:** `409` e-mail já cadastrado, com caminho para login; `410` convite inválido, usado ou expirado, com orientação para retornar ao login/solicitar novo convite pela landing; `422` mostrar validações retornadas.
- **Navegação:** link do convite abre o cadastro; conta criada abre boas-vindas.

### WEB-UI-03 — Boas-vindas

- **Objetivo:** confirmar cadastro, dar boas-vindas e explicar os próximos passos de configuração.
- **Ator e acesso:** ACT-01; alcançada após sucesso do cadastro.
- **Referências:** RF-01 a RF-03 · UC-02.
- **Informações apresentadas:** confirmação de conta criada; orientação de que o desenvolvedor configurará API Key, webhook, janela de envio e instância Z-API no painel.
- **Ação:** continuar para `/login`. Não chama API, não cria configuração e não grava indicador de onboarding.
- **Navegação:** acessada somente como destino do cadastro; após login, segue para `/dashboard`. Não reapresentar como etapa de logins recorrentes.

### WEB-UI-04 — Painel de integração

- **Objetivo:** reunir em uma página as configurações necessárias ao teste da integração.
- **Ator e acesso:** ACT-01; sessão autenticada por cookie HttpOnly.
- **Referências:** RF-02 · RF-03 · UC-04 a UC-10 · API-04 a API-10.
- **Dados exibidos:** e-mail da conta, janela e fuso, URL do webhook, ID de instância e indicadores de configuração. A API Key tem apenas indicador de configuração até ser gerada; segredos salvos não são retornados.
- **Campos e ações:**

| Grupo           | Campos                                       | Validação de entrada                                                            | Operação e resultado                                                                                   |
| --------------- | -------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Janela de envio | `start`, `end`, `timeZone`                   | horários `HH:mm`, início anterior ao fim, fuso IANA; API valida definitivamente | API-07 salva e devolve valores atualizados; `422` mantém valores e indica correção                     |
| API Key         | nenhum campo                                 | confirmação explícita ao substituir chave ativa                                 | API-08 gera nova chave, invalida imediatamente a anterior e a exibe uma vez; não há consulta posterior |
| Webhook         | `url`, `secret`                              | URL HTTPS e segredo obrigatório no envio; API valida definitivamente            | API-09 salva; resposta informa URL e segredo configurado, não o segredo                                |
| Z-API           | `instanceId`, `instanceToken`, `clientToken` | três valores obrigatórios; API valida credenciais e registro de callback        | API-10 salva; resposta expõe identificador e indicadores, nunca tokens                                 |

- **Carregamento inicial:** chamar API-05 e API-06; usar identidade e campos retornados. Valores nulos/indicadores false significam configuração ausente naquela categoria, sem inferir uma prontidão geral.
- **Erros e repetição:** `401` encaminha a `/login`; `422` apresenta mensagem junto à configuração correspondente e preserva os valores digitados. Erro de transporte permite repetir e não confirma persistência.
- **Segredos:** campos iniciam vazios; nunca mostrar segredos existentes. Limpar tokens e segredo após resposta bem-sucedida. API Key recém-gerada fica disponível somente na tela atual; se for perdida, a única operação disponível é gerar outra, invalidando a anterior.
- **Logout:** API-04 `DELETE /api/v1/sessions/current`; `204` encerra a sessão no navegador e leva ao login.
- **Limites:** não inclui dados de pacientes/agendamentos, métricas, relatórios, status global de prontidão ou operações manuais de envio.

## Fluxos de navegação

### Primeiro acesso

1. O desenvolvedor abre o link do convite em `/signup?token={invitationToken}`.
2. Após API-02 retornar `201`, vê `/welcome`.
3. Como API-02 não documenta sessão automática, continua a `/login`.
4. Login via API-03 recebe cookie de sessão e direciona a `/dashboard`.

### Acesso recorrente

1. O desenvolvedor abre `/login` e autentica via API-03.
2. Após `204`, acessa `/dashboard`; não passa novamente por `/welcome`.

### Acesso não autorizado

1. Acesso sem sessão a `/dashboard` chama API-05.
2. Resposta `401` encaminha a `/login`; após autenticar, retorna ao destino solicitado ou ao painel.

### Logout

1. O painel chama API-04.
2. Resposta `204` encerra a sessão do navegador e encaminha ao login.

### Configuração da integração

Cada grupo de configuração é salvo pela operação correspondente em API-07 a API-10 e apresenta o resultado dessa operação. Nenhuma ordem é imposta entre os grupos. O painel não solicita agendamento de teste; o desenvolvedor testa por seu próprio sistema ou cliente HTTP usando API-11.

## Operações fora da interface

API-01 — solicitação de convite — pertence à landing. API-11 — criação de agendamentos — é consumida por sistemas integrados. API-12 e API-13 são callbacks e webhooks automáticos. Não originam telas no painel.
