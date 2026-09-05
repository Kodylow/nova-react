FROM node:22-bookworm-slim

WORKDIR /app
ENV CI=true

RUN corepack enable && corepack prepare pnpm@10.8.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/workshop/package.json apps/workshop/package.json
COPY libs/nova-react/package.json libs/nova-react/package.json
COPY libs/nova-react/dist/package.json libs/nova-react/dist/package.json
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["pnpm", "start"]