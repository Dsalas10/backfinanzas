const ingresoExtraModel = require("../Models/model.ingresoExtra");
const usuarioModel = require("../Models/model.user");

function formatDateToString(date) {
  return date.toISOString().split("T")[0];
}

// Crear un nuevo ingreso extra
async function crearIngresoExtra(datos) {
  try {

    const usuario = await usuarioModel.findById(datos.usuario);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    const nuevoIngresoExtra = new ingresoExtraModel(datos);
    await nuevoIngresoExtra.save();
    return {
      mensaje: "Ingreso Extra creado correctamente en la BD",
      nuevoIngresoExtra,
    };
  } catch (error) {
    return { mensaje: "Error al crear el Ingreso Extra en la BD", error: error.message };
  }
}

async function obtenerIngresosExtrasMesActual(usuarioId) {
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
      return { mensaje: "usuario no existe" };
    }
    const ingresoExtra = await ingresoExtraModel
      .find({
        usuario: usuarioId,
        fecha: { $gte: inicioMesStr, $lte: finMesStr },
      })
      .sort({ fecha: -1 });

    if (ingresoExtra.length === 0) {
      return { mensaje: "Aun no Ha agregado ningun Ingreso Extra", ingresoExtra };
    }
    return { mensaje: "Ingresos Extras encontrados", ingresoExtra };
  } catch (error) {
    return { mensaje: "error al obtener los Ingresos Extras", error: error.message };
  }
}

async function eliminarIngresoExtra(usuarioId, ingresoExtraId) {
  try {
    const ingresoExtra = await ingresoExtraModel.findOne({
      _id: ingresoExtraId,
      usuario: usuarioId,
    });
    if (!ingresoExtra) {
      return { mensaje: "Ingreso Extra no encontrado o no pertenece al usuario" };
    }
    await ingresoExtraModel.deleteOne({ _id: ingresoExtraId });
    return {
      mensaje: "Ingreso Extra Eliminado Existosamente",
    };
  } catch (error) {
    return { mensaje: "error al eliminar el Ingreso Extra", error: error.message };
  }
}
async function obtenerIngresoExtraMesSeleccionado(usuarioId, mes) {
  try {
    // mes debe venir como string 'MM', ejemplo '01' para enero
    const year = new Date().getFullYear();
    const mesStr = String(mes).padStart(2, '0');
    // Buscar ingresos extras donde fecha empiece con 'YYYY-MM'
    const ingresoExtra = await ingresoExtraModel
      .find({
        usuario: usuarioId,
        fecha: { $regex: `^${year}-${mesStr}` },
      })
      .sort({ fecha: -1 });
    return { ingresoExtra };
  } catch (error) {
    return { mensaje: "Error al obtener los Ingresos Extras", error: error.message };
  }
}

module.exports = {
  crearIngresoExtra,
  obtenerIngresosExtrasMesActual,
  eliminarIngresoExtra,
  obtenerIngresoExtraMesSeleccionado,
};