import { app } from "./app.js"
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT ?? 1234

app.listen(PORT,()=>
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
)