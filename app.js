import express from 'express'
import { corsMiddleware } from './corsMiddleware.js'

export const app = express()

app.disable('x-powered-by')
app.use(corsMiddleware())
