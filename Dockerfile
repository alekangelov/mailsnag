FROM golang:1.21.0 as GOBUILDER

WORKDIR /app

COPY ./apps/server .

RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM node:20-alpine as NODEBUILDER

WORKDIR /app

COPY ./apps/client .

RUN npm install

RUN npm run build

RUN npm run post-build

FROM node:20-alpine as RUNNER

WORKDIR /app

COPY --from=NODEBUILDER /app/.next/standalone .
COPY --from=GOBUILDER /app/main .

COPY ./entrypoint.sh .


ENV SMTP_HOST=0.0.0.0
ENV SMTP_PORT=2525
ENV SMTP_AUTH_REQUIRED=false
ENV SMTP_USERNAME=username
ENV SMTP_PASSWORD=password
ENV SERVER_HOST=localhost
ENV SERVER_PORT=3333
ENV WEB_SERVER_PORT=3000

ENV INTERNAL_DOCKER_IP="172.17.0.1"
ENV NEXT_PUBLIC_DATA_URL="http://172.17.0.1:3333"
ARG INTERNAL_DOCKER_IP="172.17.0.1"

EXPOSE $SERVER_PORT
EXPOSE $WEB_SERVER_PORT
EXPOSE $SMTP_PORT

CMD ["sh", "/app/entrypoint.sh"]