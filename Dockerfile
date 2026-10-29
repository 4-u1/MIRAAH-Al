# MIRAAH production image (Cloud Run). Build: docker build -t miraah .
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
COPY firebase-applet-config.json ./
USER node
EXPOSE 8080
ENV PORT=8080
CMD ["node", "dist/server.cjs"]
