import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { errorHandlers } from './middleware/errorHandlers'
import userRouter from './routes/users'
import websiteRouter from './routes/websites'
import { authenticateUser } from './middleware/authentication'
import publicRouter from './routes/public'

const app = express()

const { DB_CONNECTION, PORT } = process.env
if (!DB_CONNECTION || !PORT) throw new Error('DB CONNECTION & PORT REQUIRED')

const whitelist = ['http://localhost:3000']

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
    },
    credentials: true
}

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.use('/users', userRouter)
app.use('/public', publicRouter)
app.use('/websites', authenticateUser, websiteRouter)

app.use(errorHandlers)

mongoose.connect(DB_CONNECTION)

mongoose.connection.on('connected', () => {
    console.log('DB Connected')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => console.log(err))