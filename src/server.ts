import 'dotenv/config'
import mongoose from 'mongoose'
import { app } from './app'

const port = Number(process.env.PORT || 5001)
const mongoUri = process.env.MONGO_URI

if (!mongoUri) {
  console.error('MONGO_URI is not configured')
  process.exit(1)
}

if (!/^mongodb(?:\+srv)?:\/\/[^@]+@[^/]+\/.+/.test(mongoUri)) {
  console.error(
    'MONGO_URI is invalid. Use an Atlas URI with username, password and cluster host.',
  )
  process.exit(1)
}

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((error: unknown) => {
    console.error('DB connection error:', error)
    process.exitCode = 1
  })
