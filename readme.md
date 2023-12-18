<p align="center">
<img src="https://raw.githubusercontent.com/alekangelov/mailsnag/main/apps/clientx/public/icon.png" style="max-width:256px;">
</p>

# Mailsnag

## A tiny, dockerized fake email testing servize.

## Docker image is around 19mb(ish)

Mailsnag is a tiny, dockerized fake email service for local development. It's
useful for testing email notifications during development without spamming
action users!

## Screenshots

![Screenshot of MailSnag in Dark Mode](https://raw.githubusercontent.com/alekangelov/mailsnag/main/screenshot_dark.png)

![Screenshot of Mailsnag in Light Mode](https://raw.githubusercontent.com/alekangelov/mailsnag/main/screenshot_light.png)

## Usage

### Docker via run command

```bash
docker run -d -p 2525:2525 -p 3333:3333 --name mailsnag ghcr.io/alekangelov/mailsnag
```

### Docker Compose

```yaml
version: "3"
services:
  mailsnag:
    image: ghcr.io/alekangelov/mailsnag:latest
    ports:
      # access the smtp server at localhost:2525
      - 2525:2525
      # access the web ui at http://localhost:3333
      - 3333:3333
    environment:
      - SMTP_HOST=0.0.0.0
      - SMTP_PORT=2525
      - SMTP_AUTH_REQUIRED=false
      - SMTP_USERNAME=email
      - SMTP_PASSWORD=password
      - SERVER_HOST=localhost
      - SERVER_PORT=3333
```
