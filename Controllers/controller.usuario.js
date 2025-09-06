
const UsuarioModelo=require("../Models/model.user")

async function registrarUsuario(nombre,email,password){

    try{
        const existe=await UsuarioModelo.findOne({email});
        if(existe){
            throw new Error('El email ya está registrado');
        }
        const nuevoUsuario=new UsuarioModelo({nombre,email,password});
        await nuevoUsuario.save();
        return {mensaje:'Usuario registrado exitosamente'};
    }catch(error){
        throw new Error('Error al registrar usuario: '+error.message);
    }
}


async function cambiarPassword(email,passwordActual,passwordNueva){
    try{
        const usuario=await UsuarioModelo.findOne({email});
        if(!usuario){
            throw new Error('Usuario no encontrado');
        }
        const esValido=await usuario.compararPassword(passwordActual);
        if(!esValido){
            throw new Error('Contraseña actual incorrecta');
        }   
        usuario.password=passwordNueva;
        await usuario.save();
        return {mensaje:'Contraseña actualizada exitosamente'};
    }catch(error){
        throw new Error('Error al cambiar contraseña: '+error.message);
    }       
}


async function loginUsuario(email,password){
    try{
        const existe=await UsuarioModelo.findOne({email,password})
        if(!existe){
            throw new Error("Email o Pass Incorrectos")
        }
        return{message:"Login Existoso"}

    }catch(error){
        throw new Error('Error al iniciar sesión: '+error.message);
    }
}


module.exports={registrarUsuario,cambiarPassword,loginUsuario};
