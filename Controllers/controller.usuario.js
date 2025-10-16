const UsuarioModelo = require("../Models/model.user");

async function registrarUsuario(nombre, email, password) {
  try {
    const existe = await UsuarioModelo.findOne({ email });
    if (existe) {
      throw new Error("El email ya está registrado");
    }
    const nuevoUsuario = new UsuarioModelo({ nombre, email, password });
    await nuevoUsuario.save();
    return { mensaje: "Usuario registrado exitosamente" };
  } catch (error) {
    throw new Error("Error al registrar usuario: " + error.message);
  }
}

async function cambiarPassword(email, passwordActual, passwordNueva) {
  try {
    const usuario = await UsuarioModelo.findOne({ email });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    const esValido = await usuario.compararPassword(passwordActual);
    if (!esValido) {
      throw new Error("Contraseña actual incorrecta");
    }
    usuario.password = passwordNueva;
    await usuario.save();
    return { mensaje: "Contraseña actualizada exitosamente" };
  } catch (error) {
    throw new Error("Error al cambiar contraseña: " + error.message);
  }
}

async function recuperarPassword(email, nuevaPassword) {
  try {
    const usuario = await UsuarioModelo.findOne({ email });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    usuario.password = nuevaPassword;
    await usuario.save();
    return { mensaje: "Contraseña recuperada exitosamente" };
  } catch (error) {
    throw new Error("Error al recuperar contraseña: " + error.message);
  }
}

async function loginUsuario(nombre) {
  try {
    const usuario = await UsuarioModelo.findOne({ nombre });
    // console.log("Usuario encontrado:", usuario);
    if (!usuario) {
      throw new Error("Nombre o contraseña incorrectos");
    }
    // const esValido = await usuario.compararPassword(password);
    // if (!esValido) {
    //   throw new Error("Nombre o contraseña incorrectos");
    // }
    return { data: usuario, mensaje: "Login Exitoso" };
  } catch (error) {
    throw new Error('Error al iniciar sesión2: ' + error.message);
  }
}


module.exports = { registrarUsuario, cambiarPassword, loginUsuario };
