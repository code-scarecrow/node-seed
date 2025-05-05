FROM node:22-alpine AS base
COPY package.json package-lock.json /usr/application/

FROM base AS base-prod
WORKDIR /usr/application
RUN npm ci --omit "dev"

FROM base-prod AS base-dev
WORKDIR /usr/application
RUN npm ci

FROM base-dev AS build
COPY src/ /usr/application/src
COPY tsconfig.json tsconfig.build.json /usr/application/
WORKDIR /usr/application
RUN npm run build
RUN npm run prisma:generate

FROM base-prod AS prod
COPY --from=build --chown=node:node /usr/application/dist /usr/application/dist
WORKDIR /usr/application
USER node
CMD ["sh", "-c", "node dist/src/main.js"]