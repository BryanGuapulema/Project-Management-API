import express from 'express'
import { corsMiddleware } from './middlewares/corsMiddleware.js'
import { errorHandler } from './middlewares/errorHandler.js'

export const app = express()

app.disable('x-powered-by')
app.use(corsMiddleware())
app.use(express.json())


//ErrorHandler
app.use(errorHandler)
