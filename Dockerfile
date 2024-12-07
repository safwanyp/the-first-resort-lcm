FROM node:20-alpine AS base


FROM base AS builder
RUN apk add --no-cache gcompat
WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY src ./src

RUN pnpm install --ignore-scripts --prod
RUN pnpm add discord.js


FROM base AS runner
RUN apk add --no-cache dumb-init
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=nodejs:nodejs /app/src /app/src
COPY --from=builder --chown=nodejs:nodejs /app/package.json /app/package.json

USER nodejs

CMD ["dumb-init", "node", "/app/src/index.js"]
