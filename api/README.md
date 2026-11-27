# Pokémon Battle — Game API

REST API for the Pokémon Battle game. It stores player scores and serves the leaderboard. Authentication is handled by the separate [Auth service](../auth); this API only verifies the JWT access tokens it issues.

## Tech stack

Node.js · TypeScript · Express 5 · Mongoose · `jsonwebtoken` · `zod` · `cors` · `dotenv`

## Getting started

```bash
cd api
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

The API starts on `http://localhost:5001` by default. On startup it validates `MONGO_URI` and exits with an error if it is missing or malformed.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | no | Port to listen on (default `5001`) |
| `MONGO_URI` | **yes** | MongoDB Atlas URI including username, password, host and database name |
| `JWT_SECRET` | **yes** | Must be identical to the Auth service's `JWT_SECRET`, otherwise all protected requests fail with `401` |

MongoDB Atlas checklist: create a database user, allow your IP under *Network Access*, copy the connection string from *Connect → Drivers*, and URL-encode special characters in the password.

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the server with `tsx` in watch mode |
| `npm run build` | Compiles TypeScript to `dist/` |
| `npm start` | Runs the compiled server (`dist/server.js`) |

## API

Errors have the shape `{ "message": "..." }`.

### `GET /health`

→ `200 { "status": "ok" }`

### `GET /leaderboard`

Public. Returns the top 50 players sorted by points, descending.

```json
[
  { "id": "665f...", "name": "ash", "points": 120 },
  { "id": "665a...", "name": "misty", "points": 90 }
]
```

### `POST /leaderboard`

Requires `Authorization: Bearer <accessToken>` (issued by the Auth service).

```json
{ "points": 10 }
```

- `points` must be a positive number.
- Points are **added** to the player's existing total (one document per user, created on first score); the username and date are refreshed.

**201** → `{ "id": "...", "name": "ash", "points": 130 }`
**400** → invalid `points` · **401** → missing, invalid or expired token.

## Authentication

Protected routes use the `requireAccessToken` middleware, which verifies the token with `JWT_SECRET` (`HS256`, issuer `pokemon-battle-auth`, audience `pokemon-battle-api`) and exposes the user as `req.user = { id, username }`.

## Data model

| Collection | Fields |
| --- | --- |
| `scores` | `userId` (ObjectId, unique), `username`, `points` (default `0`), `date` (default now), timestamps |

## Project structure

```text
src/
├── app.ts          # Express app, routes, /health
├── server.ts       # MongoDB connection and server start
├── routes/         # /leaderboard
├── controllers/    # leaderboard handlers
├── middleware/     # requireAccessToken
├── schemas/        # zod schema for token claims
├── models/         # Score
└── types/          # Express type augmentation (req.user)
```
