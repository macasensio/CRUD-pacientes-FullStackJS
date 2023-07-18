import express from 'express'
const router = express.Router()

import {
    registrar, 
    perfil, 
    confirmar, 
    autenticar, 
    olvidePassword ,
    comprobarToken,
    nuevoPassword
} from '../controllers/veterinarioController.js'
import checkAuth from '../middleware/authMiddleware.js'


//área pública
router.post('/', registrar)
router.get('/confirmar/:token', confirmar)
router.post('/login', autenticar)
router.post('/olvide-password', olvidePassword) // validar el email
//router.get('/olvide-password/:token', comprobarToken) // comprobar el token
//router.post('/olvide-password/:token', nuevoPassword) // almacenar nuevo password
router.route('/olvide-password/:token')
    .get(comprobarToken)
    .post(nuevoPassword)

// área privada
router.get('/perfil',checkAuth, perfil)


export default router