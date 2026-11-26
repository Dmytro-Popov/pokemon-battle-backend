import cors from 'cors'
import express, { Request, Response } from 'express'
import leaderboardRouter from "./routes/leaderboard";

export const app = express()

app.use(cors())
app.use(express.json())
app.use("/leaderboard", leaderboardRouter);

app.get('/health', (_request: Request, response: Response) => {
  response.json({ status: 'ok' })
})
