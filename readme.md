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

## Local Development And Architecture

### Frontend

The frontend is a static Vite SPA that is served by the backend. It's written in
TypeScript and uses TailwindCSS for styling, UI library is React.

### Backend

The backend is a service written in Go that runs two servers.
One is an SMTP service, running on port 2525 or whatever else you've picked as SMTP_PORT in env.
The other is an HTTP server that serves the frontend and provides an API for fetching emails.
The realtime updates are done via Server Sent Events.
The backend uses NO database, it's just an in-memory store.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18+) - For the front end
- [Go](https://golang.org/) (v1.21+) - For the backend
- [Docker](https://www.docker.com/) (v20.10+) - For running the app in a container
- [Docker Compose](https://docs.docker.com/compose/) (v1.29+) - For running the app in a container
- [Make](https://www.gnu.org/software/make/) (v4.3+) - For running the Makefile

### Running Locally

```bash
# Clone the repo
git clone

# Change into the directory
cd mailsnag

# Run both the backend dev server and the frontend one
make dev

# Run only the backend dev server
make dev.server

# Run only the frontend dev server
make dev.client
```

### PR Template

Absolutely no PR template! Just make sure you didn't mess anything up, even the tinyest PRs are welcome!

### License

MIT, but look at license.md for more info. Basically you can do whatever you want with this, even sell it. I think? I'm not a lawyer.
