const UsuarioModelo = require("../Models/model.user");

const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "supersecreto";
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


async function loginUsuario(nombre, password) {
  try {
    const usuario = await UsuarioModelo.findOne({ nombre });
    if (!usuario) {
      throw new Error("Nombre o contraseña incorrectos");
    }
    const esValido = await usuario.compararPassword(password);
    if (!esValido) {
      throw new Error("Nombre o contraseña incorrectos");
    }
    // Generar token JWT con _id y nombre
    const payload = { _id: usuario._id, nombre: usuario.nombre };
    const token = jwt.sign(payload, SECRET, { expiresIn: "7d" });
    // Devuelve el usuario completo, sin la contraseña
    const usuarioSinPassword = {
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      // agrega otros campos si los tienes
    };
    return { token, usuario: usuarioSinPassword };
  } catch (error) {
    throw new Error('Error al iniciar sesión2: ' + error.message);
  }
}


module.exports = { registrarUsuario, cambiarPassword, loginUsuario };
