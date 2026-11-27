# Pokémon Battle — Auth Service

Authentication service for the Pokémon Battle game. It registers users, logs them in, and issues JWT access tokens plus rotating refresh tokens. The [Game API](../api) trusts the access tokens issued here.

## Tech stack

Node.js · TypeScript · Express 5 · Mongoose · `bcrypt` · `jsonwebtoken` · `zod` · `cookie-parser` · `cors`

## Getting started

Requires Node.js 22.18+ (or 24+): `npm run dev` runs the TypeScript sources directly with Node.

```bash
cd auth
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

The service starts on `http://localhost:5002` by default.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | no | Port to listen on (default `5002`) |
| `MONGO_URI` | **yes** | MongoDB connection string (Atlas or local) |
| `DB_NAME` | no | Database name (overrides the one in the URI) |
| `JWT_SECRET` | **yes** | Secret used to sign access tokens. Must equal the Game API's `JWT_SECRET` |
| `NODE_ENV` | no | `development` or `production`. In production the refresh cookie is `secure` + `sameSite=none`, and error details are hidden |
| `FRONTEND_URL` | **yes** | Allowed CORS origin(s), comma-separated, e.g. `http://localhost:5173` |

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Runs `src/app.ts` in watch mode, loading `.env` |
| `npm run build` | Compiles TypeScript to `dist/` |
| `npm start` | Runs the compiled build (`dist/app.js`) — provide env variables from the host |

## API

Base path: `/auth`. All bodies are JSON. Errors have the shape `{ "message": "..." }`.

### `POST /auth/register`

```json
{ "email": "ash@example.com", "username": "ash", "password": "pikachu123" }
```

- `email` — valid email (trimmed, lowercased)
- `username` — 3–20 characters, unique
- `password` — at least 8 characters and at most 72 UTF-8 bytes
- Unknown fields are rejected.

**201** → `{ "accessToken": "<jwt>", "username": "ash" }` and sets the `refreshToken` cookie.
**409** → email or username already taken · **400** → validation error.

### `POST /auth/login`

```json
{ "email": "ash@example.com", "password": "pikachu123" }
```

**200** → `{ "accessToken": "<jwt>", "username": "ash" }` and sets the `refreshToken` cookie.
**401** → `Email or password is invalid.`

### `POST /auth/refresh`

No body. Reads the `refreshToken` cookie, deletes the used token and issues a new pair (**rotation**).
**200** → `{ "accessToken": "<jwt>", "username": "ash" }` · **401** → cookie missing, invalid or expired.

### `POST /auth/logout`

No body. Deletes the refresh token from the database and clears the cookie. **204**.

### `GET /auth/me`

Requires `Authorization: Bearer <accessToken>`.
**200** → `{ "id": "...", "email": "...", "username": "..." }` · **401** → missing, invalid or expired token.

## Tokens and security

- **Access token** — JWT signed with `HS256`, valid for **15 minutes**. Claims: `sub` (user id), `username`; issuer `pokemon-battle-auth`, audience `pokemon-battle-api`.
- **Refresh token** — 32 random bytes, stored only as a SHA-256 hash in the `refreshTokens` collection (30-day TTL index removes expired entries). Sent as an `httpOnly` cookie scoped to `/auth`. Every refresh invalidates the old token.
- Passwords are hashed with `bcrypt` (12 rounds); `passwordHash` is excluded from queries by default.
- CORS only allows the origins listed in `FRONTEND_URL`, with credentials enabled — the frontend must send requests with `credentials: "include"`.

## Data models

| Collection | Fields |
| --- | --- |
| `users` | `email` (unique), `passwordHash`, `username` (unique, 3–20), timestamps |
| `refreshTokens` | `userId` → `User`, `tokenHash` (unique), `expiresAt` (TTL) |

## Project structure

```text
src/
├── app.ts              # Express setup and server start
├── db/                 # MongoDB connection
├── routes/             # /auth routes
├── controllers/        # register, login, refresh, logout, me
├── middleware/         # requireAccessToken, validateBody, errorHandler
├── schemas/            # zod schemas (request bodies, token claims)
├── models/             # User, RefreshToken
├── auth/               # token creation, hashing, cookie helpers
├── errors/             # HttpError, AuthError, NotFoundError
└── types/              # Express type augmentation
```

Internal imports use Node subpath imports (`#db`, `#models`, `#controllers`, …) defined in `package.json`.
