import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT ?? 1234
export const MONGO_URI = process.env.MONGO_URI
export const JWT_SECRET =process.env.JWT_SECRET
export const JWT_AT_EXPIRES_IN = process.env.JWT_AT_EXPIRES_IN ?? '15m'
export const JWT_RT_EXPIRES_IN = process.env.JWT_RT_EXPIRES_IN ?? '1d'
export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)