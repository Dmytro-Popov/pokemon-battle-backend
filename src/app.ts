import cors from 'cors'
import express, { Request, Response } from 'express'

export const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_request: Request, response: Response) => {
  response.json({ status: 'ok' })
})
