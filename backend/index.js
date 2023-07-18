import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import conectarDB from './config/db.js'
import veterinarioRoutes from './routes/veterinarioRoutes.js'
import pacienteRoutes from './routes/pacienteRoutes.js'

const app = express()
app.use(express.json())

dotenv.config()

//conectando a la base
conectarDB()

//proteger la API con cors
const dominiosPermitidos = [process.env.FRONTEND_URL]
const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1) {
            //el origen del request está permitido
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
}
app.use(cors(corsOptions))

//routing
app.use('/api/veterinarios', veterinarioRoutes)
app.use('/api/pacientes', pacienteRoutes)




const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})