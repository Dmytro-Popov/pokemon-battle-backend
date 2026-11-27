# Pokémon Battle — Backend

Backend for the **Pokémon Battle** game: players register, build a roster, battle random Pokémon and compete on a leaderboard.

This repository contains two independent Express + TypeScript services that use the same MongoDB cluster (each with its own collections) and share one JWT secret:

| Service | Folder | Port | Responsibility |
| --- | --- | --- | --- |
| **Auth service** | [`auth/`](./auth) | `5002` | Registration, login, refresh-token rotation, logout, current user |
| **Game API** | [`api/`](./api) | `5001` | Leaderboard (read scores, add points for the authenticated user) |

The frontend lives in a separate repository: [pokemon-battle-frontend](https://github.com/Dmytro-Popov/pokemon-battle-frontend).

## How it fits together

```text
                     register / login / refresh
              ┌────────────────────────────────────▶ ┌──────────────┐
              │     access token (JWT) +             │ Auth service │ ──┐
              │     refresh token cookie             │    :5002     │   │ users,
              │ ◀──────────────────────────────────  └──────────────┘   │ refreshTokens
┌─────────────┴┐                                                        ▼
│   Frontend   │                                                 ┌────────────┐
│ React + Vite │                                                 │  MongoDB   │
└─────────────┬┘                                                 │   Atlas    │
              │     Authorization: Bearer <accessToken>          └────────────┘
              │ ────────────────────────────────────▶ ┌──────────────┐   ▲
              │                                       │   Game API   │ ──┘ scores
              │ ◀──────────────────────────────────── │    :5001     │
              │              leaderboard              └──────────────┘
```

The frontend never connects to MongoDB: only the two backend services do, each using its own collections.

1. The frontend signs the user up or in through the **Auth service** and receives a short-lived **access token** (JWT, 15 min) in the response body and a long-lived **refresh token** (30 days) in an `httpOnly` cookie.
2. The frontend sends the access token as `Authorization: Bearer <token>` to the **Game API**.
3. The Game API verifies the token locally with the shared `JWT_SECRET` (algorithm `HS256`, issuer `pokemon-battle-auth`, audience `pokemon-battle-api`). It never talks to the Auth service directly.

> Both services **must use the same `JWT_SECRET`**, otherwise every protected request returns `401`.

## Tech stack

- Node.js, TypeScript, Express 5
- MongoDB Atlas + Mongoose
- JSON Web Tokens (`jsonwebtoken`)
- `bcrypt` for password hashing (auth service)
- `zod` for input validation

## Quick start

### Prerequisites

- Node.js 22.18+ (or 24+) and npm — the auth service runs TypeScript directly in dev mode

- A MongoDB Atlas cluster (or a local MongoDB instance)

### 1. Clone and install

```bash
git clone https://github.com/Dmytro-Popov/pokemon-battle-backend.git
cd pokemon-battle-backend

(cd auth && npm install)
(cd api && npm install)
```

### 2. Configure environment variables

```bash
cp auth/.env.example auth/.env
cp api/.env.example api/.env
```

Fill in the values — see [`auth/README.md`](./auth/README.md#environment-variables) and [`api/README.md`](./api/README.md#environment-variables). Use the **same** `JWT_SECRET` in both files. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Run both services

In two terminals:

```bash
cd auth && npm run dev   # http://localhost:5002
cd api  && npm run dev   # http://localhost:5001
```

Check the Game API: `GET http://localhost:5001/health` → `{ "status": "ok" }`.

## Endpoints at a glance

| Service | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| Auth | `POST` | `/auth/register` | – | Create an account, returns access token |
| Auth | `POST` | `/auth/login` | – | Log in, returns access token |
| Auth | `POST` | `/auth/refresh` | refresh cookie | Rotate refresh token, returns a new access token |
| Auth | `POST` | `/auth/logout` | refresh cookie | Invalidate the refresh token |
| Auth | `GET` | `/auth/me` | Bearer | Current user profile |
| API | `GET` | `/leaderboard` | – | Top 50 players by points |
| API | `POST` | `/leaderboard` | Bearer | Add points for the authenticated user |
| API | `GET` | `/health` | – | Health check |

Full request/response details are in the per-service READMEs.

## Repository layout

```text
.
├── api/      # Game API (leaderboard)
│   └── src/{app,server}.ts, routes/, controllers/, models/, middleware/, schemas/, types/
└── auth/     # Auth service
    └── src/{app}.ts, routes/, controllers/, models/, middleware/, schemas/, errors/, auth/, db/
```

## Team workflow

- All changes reach `main` through reviewed pull requests.
- Never commit `.env` files — only `.env.example`.
