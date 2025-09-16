
const prestamoModel  = require("../Models/model.prestamos");
const usuarioModel= require("../Models/model.usuarios");


// Crear un nuevo préstamo
async function crearPrestamo(datos) {
  try {
    const { fecha, concepto, monto, usuarioId } = datos;
   
    const usuario = await usuarioModel.findById(usuarioId);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    const nuevoPrestamo = new prestamoModel({
      fecha,
      concepto,
      monto,
      usuario,
    });
    await nuevoPrestamo.save();

    return {
      mensaje: "Préstamo creado correctamente",
      prestamo: nuevoPrestamo,
    };
  } catch (error) {
    return { mensaje: "Error al crear el prestamo", error: error.message };
  }
}

