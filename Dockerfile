# syntax:docker/dockerfile:1

FROM node:20.9.0-alpine AS base

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]

FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "start:dev"]

FROM base AS prod
RUN npm install --frozen-lockfile --production
COPY . .
RUN npm add global @nestjs/cli
RUN npm install @types/express --save-dev   
RUN npm run build
CMD ["npm", "run", "start:prod"]