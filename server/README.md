# Server

Express + MongoDB (Mongoose) REST API for the TODO app, written in TypeScript.

## Setup

Requires Node.js 22+ and a MongoDB instance.

```bash
# from the repo root
npm install
cp server/.env.example server/.env
npm run dev:server
```

The API runs on `http://localhost:4000` by default.

| Variable      | Default                              |
| ------------- | ------------------------------------ |
| `PORT`        | `4000`                               |
| `MONGODB_URI` | `mongodb://localhost:27017/todos`    |

## MongoDB

- **Docker (easiest):** `docker compose up -d` from the repo root starts MongoDB on port 27017. The default `MONGODB_URI` works as is.
- **Local install:** install MongoDB Community and keep the default URI.
- **Atlas:** create a free cluster, add your IP under Network Access, and set
  `MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/todos`.

The server exits with an error message if it can't connect at startup.

## API

| Method | Endpoint              | Description                        |
| ------ | --------------------- | ---------------------------------- |
| GET    | `/api/todos`          | Get all todos (newest first)       |
| POST   | `/api/todos`          | Create a todo `{ title, description? }` |
| PUT    | `/api/todos/:id`      | Update title and/or description    |
| PATCH  | `/api/todos/:id/done` | Toggle done status                 |
| DELETE | `/api/todos/:id`      | Delete a todo                      |

Errors return JSON like `{ "message": "...", "errors": { "title": "..." } }` with a 400 (validation / bad id), 404 (not found) or 500 status.

## Assumptions and limitations

- Single user, no authentication.
- `title` is required (max 100 chars), `description` is optional (max 500 chars). Both are trimmed.
- `PUT` only changes title/description; `done` is changed only through the `PATCH` endpoint.
- No pagination, the full list is returned.
- Port 5000 is avoided because macOS uses it for AirPlay.
- The server runs TypeScript directly with `tsx` (dev and start). There is no separate compile step, `npm run typecheck` checks types with `tsc`.
- Validation limits come from `@todo/shared`, so the client and server always use the same rules.
