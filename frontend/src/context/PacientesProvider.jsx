import { createContext, useState, useEffect } from "react";
import clienteAxios from '../config/axios'

const PacientesContext = createContext()

const PacientesProvider = ({children}) => {

    const [pacientes, setPacientes] = useState([])

    useEffect(() => {
        const obtenerPacientes = async () => {
            try {
                const token = localStorage.getItem('token')
                if(!token) return

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const { data } = await clienteAxios('/pacientes', config)
                console.log(data)
                setPacientes(data)

            } catch (error) {
                
            }
        }
        obtenerPacientes()
    }, [])

    const guardarPaciente = async (paciente) => {
        try {
            //autenticar el vet
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post('/pacientes', paciente, config) // endpoint - datos - config de la autenticación
            
            const {createdAt, updatedAt, __v, ...pacienteAlmacenado} = data
            console.log(pacienteAlmacenado)

            setPacientes([pacienteAlmacenado, ...pacientes])

        } catch (error) {
            console.log(error.response.data.msg)
        }
    }

    return (
        <PacientesContext.Provider
            value={{
                pacientes,
                guardarPaciente
            }}
        >
            {children}
        </PacientesContext.Provider>
    )

}

export {
    PacientesProvider
}

export default PacientesContext