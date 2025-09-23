import express from 'express'
import { corsMiddleware } from './middlewares/corsMiddleware.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { userRouter } from './routes/UserRoutes.js'
import { authRouter } from './routes/AuthRoutes.js'

export const app = express()

app.disable('x-powered-by')
app.use(corsMiddleware())
app.use(express.json())


//routes
app.use('/users',userRouter)
app.use('/',authRouter)

//ErrorHandler
app.use(errorHandler)
