# Mailsnag

## A tiny, dockerized fake email service

Mailsnag is a tiny, dockerized fake email service for local development. It's
useful for testing email notifications during development without spamming
action users!

## Screenshots

![Screenshot of MailSnag in Dark Mode](https://raw.githubusercontent.com/alekangelov/mailsnag/main/screenshot_dark.png)

![Screenshot of Mailsnag in Light Mode](https://raw.githubusercontent.com/alekangelov/mailsnag/main/screenshot_light.png)

## Usage

### Docker (not workign just a WIP)

```bash
docker run -d -p 2525:2525 -p 3000:3000 --name mailsnag ghcr.io/alekangelov/mailsnag
```

### Docker Compose

```yaml
version: "3"
services:
  mailsnag:
    image: ghcr.io/alekangelov/mailsnag
    ports:
      # access the smtp server at localhost:2525
      - 2525:2525
      # access the web ui at http://localhost:3000
      - 3000:3000
    env:
      - SMTP_HOST=localhost
      - SMTP_PORT=2525
      - SMTP_AUTH_REQUIRED=false
      - SMTP_USERNAME=email
      - SMTP_PASSWORD=password
      - SERVER_HOST=localhost
      - SERVER_PORT=3000
```
