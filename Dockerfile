FROM golang:1.21.0 as GOBUILDER

WORKDIR /app

COPY ./apps/server .

RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM node:20-alpine as NODEBUILDER

WORKDIR /app

COPY ./apps/clientx .

RUN npm install

RUN npm run build


FROM alpine:latest as RUNTIME

WORKDIR /app

COPY --from=NODEBUILDER /app/dist ./dist
COPY --from=GOBUILDER /app/main .


ENV SMTP_HOST=0.0.0.0
ENV SMTP_PORT=2525
ENV SMTP_AUTH_REQUIRED=false
ENV SMTP_USERNAME=username
ENV SMTP_PASSWORD=password
ENV SERVER_HOST=localhost
ENV SERVER_PORT=3333

EXPOSE $SERVER_PORT
EXPOSE $SMTP_PORT

CMD ["./main"]