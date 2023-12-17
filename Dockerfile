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

COPY 

