const prestamoModel = require("../Models/model.prestamo");
const usuarioModel = require("../Models/model.user");

function formatDateToString(date) {
  return date.toISOString().split("T")[0];
}

// Crear un nuevo préstamo
async function crearPrestamo(datos) {
  try {

    const usuario = await usuarioModel.findById(datos.usuario);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    const nuevoPrestamo = new prestamoModel(datos);
    await nuevoPrestamo.save();
    return {
      mensaje: "Préstamo creado correctamente en la BD",
     nuevoPrestamo,
    };
  } catch (error) {
    return { mensaje: "Error al crear el prestamo en la BD", error: error.message };
  }
}

async function obtenerPrestamosMesActual(usuarioId) {
  try {
    const inicioMes = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const finMes = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const inicioMesStr = formatDateToString(inicioMes);
    const finMesStr = formatDateToString(finMes);

    const existe = await usuarioModel.findById(usuarioId);
    if (!existe) {
      return { mensjae: "usuario no existe" };
    }
    const prestamo = await prestamoModel
      .find({
        usuario: usuarioId,
        fecha: { $gte: inicioMesStr, $lte: finMesStr },
      })
      .sort({ fecha: -1 });

    if (prestamo.length === 0) {
      return { mensaje: "Aun no Ha agregado ningun prestamo", prestamo };
    }
    return { mensaje: "Prestamos encontrados", prestamo };
  } catch (error) {
    return { mensaje: "error al obtener los prestamos", error: error.message };
  }
}

async function eliminarPrestamo(usuarioId, prestamoId) {
  try {
    const prestamo = await prestamoModel.findOne({
      _id: prestamoId,
      usuario: usuarioId,
    });
    if (!prestamo) {
      return { mensaje: "prestamo no encontrado o no perteces al usuario" };
    }
    await prestamoModel.deleteOne({ _id: prestamoId });
    return {
      mensaje: "Prestamo Eliminado Existosamente",
    };
  } catch (error) {
    return { mensaje: "error al eliminar el prestamo", error: error.message };
  }
}
async function obtenerPrestamosMesSeleccionado(usuarioId, mes) {
  try {
    // mes debe venir como string 'MM', ejemplo '01' para enero
    const year = new Date().getFullYear();
    const mesStr = String(mes).padStart(2, '0');
    // Buscar prestamos donde fecha empiece con 'YYYY-MM'
    const prestamo = await prestamoModel
      .find({
        usuario: usuarioId,
        fecha: { $regex: `^${year}-${mesStr}` },
      })
      .sort({ fecha: -1 });
    return { prestamo };
  } catch (error) {
    return { mensaje: "Error al obtener los prestamos", error: error.message };
  }
}

module.exports = {
  crearPrestamo,
  obtenerPrestamosMesActual,
  eliminarPrestamo,
  obtenerPrestamosMesSeleccionado,
};