# Instruções para agentes — Confirma

Este arquivo orienta agentes que analisam, implementam ou modificam o projeto Confirma. **A documentação é a referência para decisões de produto; o código existente é a referência para os detalhes da implementação atual.**

## 1. Antes de começar

1. Leia `docs/README.md` para localizar as especificações.
2. Leia os documentos pertinentes à tarefa **antes de propor ou alterar comportamentos**:
   - `docs/specs/overview.md`: objetivo, escopo e requisitos do produto.
   - `docs/specs/domain.md`: atores, entidades, regras de negócio e casos de uso.
   - `docs/specs/api.md`: contratos HTTP, autenticação e integrações.
3. Inspecione os arquivos de código, testes e configurações diretamente envolvidos na tarefa. Siga os padrões já adotados pelo projeto.
4. Se um arquivo citado ainda não existir, não presuma seu conteúdo: consulte os documentos disponíveis e informe a lacuna quando relevante.

**Não é necessário ler todos os documentos a cada alteração.** Leia os que fundamentam a decisão; em tarefas transversais, amplie a consulta.

## 2. Regras de autoridade

- **Produto e escopo:** `overview.md`.
- **Regras e estados de negócio:** `domain.md`.
- **Contratos externos:** `api.md`.
- **Interface e apresentação visual:** não há especificação de design ou de UI na documentação atual; não presuma uma e consulte o usuário quando a decisão afetar o resultado.
- **Detalhes técnicos já implementados:** código, testes e configurações atuais, desde que não contrariem as especificações aprovadas.

Não use protótipos visuais como fonte de novas regras de negócio. Não deduza contratos HTTP a partir da interface. Se duas fontes entrarem em conflito, **não escolha silenciosamente uma versão**: exponha a divergência e peça orientação quando ela afetar o resultado.

## 3. Documentação protegida

A pasta `docs/` é **somente leitura por padrão**.

- **Não crie, edite, mova, renomeie nem exclua** arquivos em `docs/` sem uma solicitação explícita do usuário.
- Isso inclui especificações e `README.md`.
- Não atualize a documentação automaticamente para acompanhar mudanças no código.
- Se encontrar documentação ausente, desatualizada ou inconsistente, relate o problema e proponha a correção; aguarde autorização para alterá-la.
- Uma solicitação para implementar código **não autoriza**, por si só, modificar `docs/`.
- Quando a alteração documental for solicitada, limite-se aos arquivos e ao objetivo autorizados; preserve o formato existente (inclusive frontmatter YAML, identificadores e referências).

## 4. Escopo: Beta primeiro

O Confirma está sendo desenvolvido de forma incremental. Implemente **somente o comportamento necessário à etapa atual e explicitamente descrito nas especificações**.

- Priorize o fluxo principal de integração e validação do Beta.
- Não acrescente recursos típicos de um SaaS apenas por conveniência ou antecipação.
- Evite abstrações, configurações, camadas, dependências e mecanismos de extensão sem necessidade concreta.
- Não transforme uma tarefa pequena em uma refatoração ampla.
- Não amplie o escopo para recursos comerciais, administrativos ou analíticos sem autorização.

Se uma regra essencial não estiver definida, **pergunte antes de inventá-la**. Para detalhes técnicos reversíveis e de baixo impacto, prefira a solução mais simples compatível com o projeto, informando a decisão quando relevante.

## 5. Regras de implementação

- Implemente o menor conjunto coerente de alterações que resolva a tarefa.
- Respeite a arquitetura, as convenções de nomes e as ferramentas já presentes no repositório; não introduza novos padrões sem justificativa.
- Mantenha regras de negócio fora de componentes de apresentação e de adaptadores de infraestrutura, conforme os limites existentes do projeto.
- Para endpoints, respeite os contratos de `api.md`; para interfaces, siga o código existente, pois não há especificação de UI ou Design System na documentação atual.
- Trate credenciais, API Keys, tokens, segredos e dados de pacientes com cuidado. Não exponha valores sensíveis em logs, exemplos ou respostas indevidas.
- Não altere arquivos não relacionados nem reformate grandes áreas sem necessidade.
- Não execute comandos destrutivos, migrações irreversíveis ou operações em produção sem autorização explícita.

## 6. Verificação e entrega

- Após implementar cada feature, execute `pnpm check` na raiz do monorepo. Esse comando reúne lint, typecheck, testes e verificação de formatação; não o substitua apenas por verificações parciais.
- Se a verificação falhar, investigue e corrija os erros relacionados à alteração e execute `pnpm check` novamente. Não conclua enquanto essas falhas persistirem; se houver falhas preexistentes ou fora do escopo que não possam ser corrigidas com segurança, informe-as claramente.
- Não afirme que uma verificação passou se ela não foi executada.
- Ao concluir, informe brevemente: o que mudou, arquivos afetados, verificações realizadas e eventuais pendências.
- Sugira uma mensagem de commit em **Conventional Commits** para alterações de implementação.

**Princípio final:** consulte as fontes de verdade, preserve a documentação, respeite o escopo do Beta e não tome decisões de produto sem respaldo ou autorização.
