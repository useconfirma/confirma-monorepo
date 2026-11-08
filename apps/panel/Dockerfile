# Painel do Confirma. Build a partir da raiz do monorepo:
#   docker build -f apps/panel/Dockerfile --build-arg VITE_API_URL=https://api.exemplo.com -t confirma-panel .

# 1. Build: instala as dependências do painel e gera os arquivos estáticos.
FROM node:24-alpine AS build
RUN corepack enable
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/panel/package.json apps/panel/
RUN pnpm install --frozen-lockfile --filter @confirma/panel
# Código, index.html e public/ (logos e favicon), copiados para o dist pelo Vite.
COPY apps/panel apps/panel
# URL da API embutida no bundle no momento do build.
ARG VITE_API_URL
RUN pnpm --filter @confirma/panel build

# 2. Runtime: só o Nginx servindo o dist, com compressão e cache.
FROM nginx:1.29-alpine AS runtime
COPY apps/panel/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/panel/dist /usr/share/nginx/html
EXPOSE 80
