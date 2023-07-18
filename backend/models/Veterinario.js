import mongoose from "mongoose";
//hashear password
import bcrypt from 'bcrypt'

//generar id
import generarId from "../helpers/generarId.js";

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
})


//hashear password antes de almacenar
veterinarioSchema.pre('save', async function(next) {
    //.isModified() --> para saber si se han realizado modificaciones en un campo en particular antes de guardar el documento en la base de datos
    //es para que un password hasheado no se vuelva a hashear
    if(!this.isModified('password')){
        next()
    }
    //antes de almacenar
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

//comprobar password
veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password) //compara el password que acaba de recibir desde el form con el ya hasheado
}

const Veterinario = mongoose.model('Veterinario', veterinarioSchema)
export default Veterinario