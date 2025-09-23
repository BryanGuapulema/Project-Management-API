import { app } from "./app.js"
import { PORT } from "./config/config.js"
import { connectDatabase } from "./config/mongoConnection.js"


//connect database
connectDatabase()

app.listen(PORT,()=>
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
)