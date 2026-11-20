# Pokemon Battle Backend

Backend skeleton for the Pokemon Battle project. The API is built with Node.js, Express, Mongoose and MongoDB.

## Technology stack

- Node.js
- TypeScript
- Express
- Mongoose
- MongoDB
- dotenv
- CORS
- tsx

## Project status

This repository currently contains the initial TypeScript backend skeleton. It includes a basic Express application, MongoDB connection setup and a health-check endpoint.

Authentication, Mongoose models, leaderboard endpoints and route protection will be added during the next stages of development.

## Requirements

- Node.js
- npm
- MongoDB Atlas account or a local MongoDB instance

## Installation

```bash
npm install
```

Create a local environment file based on the example:

```bash
cp .env.example .env
```

For Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Fill in the values in `.env`:

```env
PORT=5001
MONGO_URI=
JWT_SECRET=
```

Keep real credentials in `.env` only. The file is excluded from Git by `.gitignore`.

In MongoDB Atlas:

1. Create a database user in **Database Access**.
2. Allow the local IP address in **Network Access**.
3. Copy the connection string from **Database > Connect > Drivers**.
4. Replace `USERNAME`, `PASSWORD`, `CLUSTER` and `DATABASE_NAME`.
5. URL-encode special characters in the database password.

## Running the server

Development mode:

```bash
npm run dev
```

Build the TypeScript sources:

```bash
npm run build
```

Production mode:

```bash
npm start
```

By default, the server runs at `http://localhost:5001`.

## Verify the setup

Start the server and wait for:

```text
Server running on port 5001
```

Then open:

```text
http://localhost:5001/health
```

A working server returns:

```json
{
  "status": "ok"
}
```

If MongoDB does not connect, check the `.env` credentials, Atlas network access and database user permissions.

## API endpoints

### Health check

```http
GET /health
```

Example response:

```json
{
  "status": "ok"
}
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the TypeScript server in watch mode |
| `npm run build` | Compiles TypeScript into `dist/` |
| `npm start` | Runs the compiled server |

## Project structure

```text
src/
  app.ts
  server.ts
dist/
.env.example
tsconfig.json
package.json
```

## Planned functionality

- User registration and login
- JWT authentication
- Protected API routes
- Mongoose User and Score models
- Leaderboard score creation
- Descending leaderboard results
- Server-side input validation
- Friendly API error responses