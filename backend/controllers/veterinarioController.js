import Veterinario from "../models/veterinario.js"
import generarJWT from "../helpers/generarJWT.js"
import generarId from "../helpers/generarId.js"
import emailRegistro from "../helpers/emailRegistro.js"

import emailOlvidePassword from "../helpers/emailOlvidePassword.js"


//REGISTRAR - POST
const registrar = async (req, res) => {
    const { email, nombre } = req.body
    try {
        //revisar usuarios duplicados
        //1 - consultar bbdd
        const existeUsuario = await Veterinario.findOne({email: email})
        if(existeUsuario) {
            console.log('Existe usuario')
            const error = new Error('Usuario ya registrado')
            return res.status(400).json({msg: error.message})
        }

        //guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veterinario.save()

        //enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })

        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error)
    }

}

//MOSTRAR PERFIL - GET
const perfil = (req, res) => {
    const { veterinario } = req
    res.json({veterinario})
}

//CONFIRMAR TOKEN - GET
const confirmar = async (req, res) => {
    const {token} = req.params

    const usuarioConfirmar = await Veterinario.findOne({token})
    console.log(usuarioConfirmar)

    if(!usuarioConfirmar) {
        const error = new Error('Token no válido')
        return res.status(400).json({msg: error.message})
    }

    try {
        usuarioConfirmar.token = null
        usuarioConfirmar.confirmado = true
        await usuarioConfirmar.save()
        res.json({msg: 'Usuario confirmado correctamente'})
    } catch (error) {
        console.log(error)
    }
}

//AUTENTICAR - POST
const autenticar = async (req, res) => {
    const {email, password} = req.body

    //comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email})

    if(!usuario){
        const error = new Error('El usuario no existe')
        return res.status(403).json({msg: error.message})
    }

    //comprobar si el usuario está confirmado o no
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada')
        return res.status(403).json({msg: error.message})
    }

    //revisar el password
    if(await usuario.comprobarPassword(password)){
        //autenticar
        res.json({token: generarJWT(usuario.id)})
    } else {
        const error = new Error('El password es incorrecto')
        return res.status(403).json({msg: error.message})
        
    }
}

// POST - validar el email
const olvidePassword = async (req, res) => {
    const {email} = req.body

    const existeVeterinario = await Veterinario.findOne({email})
    if(!existeVeterinario){
        const error = new Error('El Usuario no existe')
        return res.status(403).json({msg: error.message})
    }

    try {
        existeVeterinario.token = generarId()
        await existeVeterinario.save()

        //enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })
        res.json({msg: 'Hemos enviado un email con las instrucciones'})
    } catch (error) {
        console.log(error)
    }
}

// GET - comprobar el token
const comprobarToken = async (req, res) => {
    const {token} = req.params
    console.log(token)

    const tokenValido = await Veterinario.findOne({token})
    if(tokenValido){
        res.json({msg: 'Token válido y el usuario existe'})
    } else {
        const error = new Error('Token no válido')
        return res.status(400).json({msg: error.message})
    }
}

// POST - almacenar nuevo password y setear el token a null
const nuevoPassword = async (req, res) => {
    const {token} = req.params
    const {password} = req.body
    
    const veterinario = await Veterinario.findOne({token})
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    try {
        veterinario.token = null
        veterinario.password = password
        await veterinario.save()
        res.json({msg: 'Password modificado correctamente'})
    } catch (error) {
        console.log(error)
    }
}


//EXPORT
export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}