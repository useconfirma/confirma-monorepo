# API do Confirma. Build a partir da raiz do monorepo:
#   docker build -f apps/api/Dockerfile -t confirma-api .

# 1. Base: Node com o pnpm na versão de `packageManager` (via Corepack).
FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /repo

# 2. Build: instala todas as dependências da API e compila o TypeScript.
FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile --filter @confirma/api
COPY apps/api apps/api
# `prisma generate` só lê o schema, mas o prisma.config.ts exige a variável.
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build \
    pnpm --filter @confirma/api build

# 3. Dependências de produção: sem TypeScript, Vitest etc. O `--no-optional`
#    evita a Prisma CLI, peer opcional do @prisma/client que só o build usa.
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile --prod --no-optional --filter @confirma/api

# 4. Runtime: só Node, dependências de produção e o código compilado.
FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /repo/apps/api
# Os links do pnpm apontam para /repo/node_modules; a estrutura é mantida.
COPY --from=prod-deps /repo/node_modules /repo/node_modules
COPY --from=prod-deps /repo/apps/api/node_modules ./node_modules
COPY --from=build /repo/apps/api/dist ./dist
COPY apps/api/package.json ./
USER node
EXPOSE 8080
CMD ["node", "dist/shared/infrastructure/http/server.js"]
