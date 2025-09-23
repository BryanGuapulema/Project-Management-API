import cors from 'cors'
const ACCEPTED_ORIGINS = [
    'http://localhost:80',
    'http://localhost:3000',
    'http://localhost:8080'
]

export const corsMiddleware = ({accepted_origins = ACCEPTED_ORIGINS} = {})=> cors({
    origin: (origin, callback)=>{
        if (accepted_origins.includes(origin)) return callback(null,true)

        if (!origin) return callback(null,true)

        return callback(new Error('Unauthorized by cors policy'))

    }
})