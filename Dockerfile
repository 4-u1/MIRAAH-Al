# MIRAAH production image. Build: docker build -t miraah .
# Data (SQLite database + evidence photos) lives in /app/data: mount a persistent volume there.
FROM node:22-slim AS build
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY --from=build /app/server-dist ./server-dist
COPY firebase-applet-config.json ./
COPY scripts/backup.mjs ./scripts/backup.mjs
RUN mkdir -p /app/data /app/backups && chown -R node:node /app/data /app/backups
USER node
ENV PORT=8080 DATA_DIR=/app/data WORKSPACE_STORE=sqlite
VOLUME ["/app/data"]
EXPOSE 8080
CMD ["node", "server-dist/server.cjs"]
