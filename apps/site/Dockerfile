# Landing page do Confirma. Build a partir da raiz do monorepo:
#   docker build -f apps/site/Dockerfile -t confirma-site .

# 1. Build: instala as dependências da site e gera o HTML estático com o Astro.
FROM node:24-alpine AS build
RUN corepack enable
ENV ASTRO_TELEMETRY_DISABLED=1
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/site/package.json apps/site/
RUN pnpm install --frozen-lockfile --filter @confirma/site
# Código e public/ (fontes, ícones, imagens OG, manifest), copiados para o dist.
COPY apps/site apps/site
RUN pnpm --filter @confirma/site build

# 2. Runtime: só o Nginx servindo o dist, com compressão e cache.
FROM nginx:1.29-alpine AS runtime
COPY apps/site/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/site/dist /usr/share/nginx/html
EXPOSE 80
