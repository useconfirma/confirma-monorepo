# Instruções para agentes — Confirma

Este arquivo vale para todo o monorepo. Instruções em `AGENTS.md` de uma aplicação complementam estas regras para aquela pasta.

## Antes de trabalhar

1. Leia `docs/README.md` e as especificações pertinentes: `docs/specs/overview.md` para produto e escopo, `docs/specs/domain.md` para regras e estados, `docs/specs/api.md` para contratos HTTP.
2. Inspecione o código, os testes, as configurações e os READMEs envolvidos. O código mostra o comportamento implementado; as especificações orientam o comportamento pretendido.
3. Respeite o Beta fechado. Implemente apenas o necessário para a tarefa aprovada, sem antecipar recursos comerciais, administrativos ou analíticos.
4. Se faltar uma decisão essencial de produto ou houver conflito real entre fontes atuais, explique a divergência e peça orientação. Não invente uma regra para preencher a lacuna.

## Código e documentação são uma entrega

Depois de uma decisão aprovada, atualize na mesma entrega todo documento afetado. A documentação deve descrever o estado vigente do projeto, com linguagem adequada ao seu público. Substitua informações obsoletas; não acrescente histórico da conversa, justificativas de decisões ou rastreabilidade de mudanças aos documentos.

- `README.md` apresenta o Confirma a pessoas não técnicas: propósito, problema e estágio do produto.
- `docs/specs/overview.md` descreve produto, escopo e capacidades do Beta.
- `docs/specs/domain.md` descreve atores, entidades, regras, casos de uso e estados.
- `docs/specs/api.md` descreve contratos externos e informa claramente o que está implementado e o que ainda é previsto.
- READMEs das aplicações descrevem sua estrutura, execução e estado atual.
- `AGENTS.md` da raiz e das aplicações descrevem instruções vigentes para agentes.
- Schemas, OpenAPI, exemplos e `.env.example` acompanham as mudanças de contrato, dados e configuração.

Avalie o impacto em cada mudança: um novo módulo deve aparecer nos mapas técnicos pertinentes; alterações de entidade ou estado devem refletir-se no domínio e na persistência; alterações HTTP devem refletir-se na especificação da API e no OpenAPI; alterações de configuração devem aparecer nos exemplos de ambiente e guias de execução. Não edite documentos sem relação com a mudança.

É permitido editar `docs/` quando isso for necessário para sincronizar uma decisão aprovada ou quando o usuário pedir uma atualização documental. Preserve o formato existente, inclusive frontmatter YAML, IDs de requisitos, regras e casos de uso, além das referências internas. Não reescreva o escopo do produto apenas para acomodar um detalhe acidental do código. Ao encontrar uma divergência sem decisão conhecida, peça orientação antes de alterar o comportamento ou a especificação.

## Implementação

- Faça o menor conjunto coerente de alterações. Siga a arquitetura e as convenções existentes; consulte o `AGENTS.md` da aplicação quando houver.
- Mantenha regras de negócio fora de controllers, componentes de interface e adapters de infraestrutura.
- Proteja senhas, tokens, API Keys, segredos e dados de pacientes. Não os exponha em logs, exemplos ou respostas indevidas.
- Preserve alterações não relacionadas no workspace. Não reformate áreas amplas sem necessidade.
- Não execute operações destrutivas, migrações irreversíveis ou ações em produção sem autorização explícita.

## Verificação e entrega

Após cada feature ou alteração de implementação, execute `pnpm check` na raiz. Ele reúne lint, typecheck, testes existentes e formatação. Não substitua essa verificação por comandos parciais. Se falhar, investigue, corrija as falhas relacionadas e execute novamente. Informe falhas preexistentes ou fora do escopo que não possam ser corrigidas com segurança.

Revise também o que `pnpm check` não cobre: coerência de links locais, exemplos e nomes; concordância entre documentação, rotas e OpenAPI; módulos e variáveis de ambiente documentados; schema Prisma e migrations quando afetados. Não crie testes novos sem solicitação explícita do usuário; execute os testes existentes por meio de `pnpm check`.

Ao concluir, informe o que mudou, os arquivos afetados, as verificações executadas e qualquer pendência real. Para alterações de implementação, sugira uma mensagem em Conventional Commits. Não declare que uma verificação passou se ela não foi executada.
