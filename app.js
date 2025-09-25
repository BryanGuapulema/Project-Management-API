import express from 'express'
import cookieParser from 'cookie-parser'
import { corsMiddleware } from './middlewares/corsMiddleware.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { userRouter } from './routes/UserRoutes.js'
import { authRouter } from './routes/AuthRoutes.js'
import { authMiddleware } from './middlewares/authMiddleware.js'
import { AuthController } from './controllers/AuthController.js'
import { catchAsync } from './utils/catchAsync.js'
import { BoardRouter } from './routes/BoardRoutes.js'
import { ListRouter } from './routes/ListRoutes.js'

export const app = express()

app.disable('x-powered-by')
app.use(corsMiddleware())
app.use(cookieParser());
app.use(express.json())
app.use('/',authRouter)

app.use(authMiddleware)
app.get('/auth/me',catchAsync(AuthController.me))


//routes
app.use('/users',userRouter)
app.use('/boards',BoardRouter)
app.use('/lists',ListRouter)

//ErrorHandler
app.use(errorHandler)
