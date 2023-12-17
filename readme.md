# Mailsnag

## A tiny, dockerized fake email service

Mailsnag is a tiny, dockerized fake email service for local development. It's
useful for testing email notifications during development without spamming
action users!

## Screenshots

![Screenshot of Mailsnag 1](https://raw.githubusercontent.com/alekangelov/mailsnag/master/screenshot.png)

![Screenshot of Mailsnag 2](https://raw.githubusercontent.com/alekangelov/mailsnag/master/screenshot2.png)

![Screenshot of Mailsnag 3](https://raw.githubusercontent.com/alekangelov/mailsnag/master/screenshot3.png)

## Usage

### Docker (not workign just a WIP)

```bash
docker run -d -p 2526:80 -p 2525:2525 --name mailsnag alekangelov/mailsnag@latest
```

### Docker Compose

```yaml
version: "3"
services:
  mailsnag:
    image: alekangelov/mailsnag@latest
    ports:
      - 2526:80
      - 2525:2525
    env:
      - SMTP_HOST=localhost
      - SMTP_PORT=2525
      - SMTP_AUTH_REQUIRED=false
      - SMTP_USERNAME=email
      - SMTP_PASSWORD=password
      - SERVER_HOST=localhost
      - SERVER_PORT=80
```
