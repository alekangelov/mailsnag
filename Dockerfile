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


ENV SMTP_HOST=$SMTP_HOST
ENV SMTP_PORT=$SMTP_PORT
ENV SMTP_AUTH_REQUIRED=$SMTP_AUTH_REQUIRED
ENV SMTP_USERNAME=$SMTP_USERNAME
ENV SMTP_PASSWORD=$SMTP_PASSWORD
ENV SERVER_HOST=$SERVER_HOST
ENV SERVER_PORT=$SERVER_PORT

EXPOSE $SERVER_PORT
EXPOSE $SMTP_PORT

CMD ["sh", "/app/entrypoint.sh"]