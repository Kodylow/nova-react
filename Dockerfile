FROM node:22-bookworm-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.8.0 --activate

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build:lib

EXPOSE 3000

CMD ["pnpm", "dev:docs", "--host", "0.0.0.0"]