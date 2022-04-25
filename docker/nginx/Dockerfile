FROM node:16-alpine

WORKDIR /app/

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN yarn install --frozen-lockfile

COPY ./src ./src
COPY ./public ./public

ARG REACT_APP_JSON_RPC_URL

RUN NODE_OPTIONS=--max_old_space_size=4096 yarn build

FROM nginx:alpine

WORKDIR /nginx/

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /app/build /nginx