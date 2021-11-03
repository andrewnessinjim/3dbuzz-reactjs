FROM node:17.0.1-bullseye-slim as base

ENV NODE_ENV=development
EXPOSE 3000

# Commands to run as root
RUN npm install -g gulp-cli \
	&& npm cache clean --force \
	&& mkdir -p /app/source \
	&& chown -R node:node /app

USER node
WORKDIR /app
COPY --chown=node:node package*json ./
RUN npm ci && npm cache clean --force

FROM base as dev 

WORKDIR /app
RUN npm ci && npm cache clean --force
WORKDIR /app/source

# Code is not copied for dev, to be bind-mounted from docker-compose

CMD ["gulp", "dev"]

FROM base as prod

WORKDIR /app/source
COPY --chown=node:node . .
ENV NODE_ENV=production

# gulp build command requires dev dependencies which are already installed from base stage
RUN rm package*json && gulp build 

# Remove dev dependencies
RUN npm ci && npm cache clean --force

CMD ["node", "server.js"]


