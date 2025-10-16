const GastoModelo = require("../Models/model.gastos");
const UsuarioModelo = require("../Models/model.user");

// Crear un nuevo gasto
async function crearGasto(fecha, concepto, monto, usuarioId) {
  try {
    const usuario = await UsuarioModelo.findById(usuarioId);
    if (!usuario) {
      return { mensaje: "Usuario no encontrado" };
    }
    const nuevoGasto = new GastoModelo({ fecha, concepto, monto, usuario });
    await nuevoGasto.save();
    return nuevoGasto;
  } catch (error) {
    return { mensaje: "Error al crear el gasto", error: error.message };
  }
}


// Obtener todos los gastos de un usuario del mes actual
async function obtenerGastosMesActual(usuarioId) {
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
    const usuario = await UsuarioModelo.findById(usuarioId);
    function formatDateToString(date) {
      return date.toISOString().split("T")[0];
    }
    const inicioMesStr = formatDateToString(inicioMes);
    const finMesStr = formatDateToString(finMes);

    if (!usuario) {
      return { mensaje: "Usuario no encontrado" };
    }
    const gastos = await GastoModelo.find({
      usuario: usuario._id,
      fecha: { $gte: inicioMesStr, $lte: finMesStr },
    }).sort({ fecha: -1 });
    return gastos;
  } catch (error) {
    return {
      mensaje: "Error al obtener los gastos de la BD",
      error: error.message,
    };
  }
}

async function obtenerGastossMesSeleccionado(usuarioId, mes) {
  try {
    // mes debe venir como string 'MM', ejemplo '01' para enero
    const year = new Date().getFullYear();
    const mesStr = String(mes).padStart(2, '0');
    // Buscar gastos donde fecha empiece con 'YYYY-MM'
    const gastos = await GastoModelo
      .find({
        usuario: usuarioId,
        fecha: { $regex: `^${year}-${mesStr}` },
      })
      .sort({ fecha: -1 });
    return { gastos };
  } catch (error) {
    return { mensaje: "Error al obtener los gastos", error: error.message };
  }
}

// Actualizar un gasto
async function actualizarGasto(gastoId, datosActualizados) {
  try {
    const gastoActualizado = await Gastos.findByIdAndUpdate(
      gastoId,
      datosActualizados,
      { new: true }
    );
    return {
      mensaje: "Gasto actualizado exitosamente",
      gasto: gastoActualizado,
    };
  } catch (error) {
    return { mensaje: "Error al actualizar el gasto", error: error.message };
  }
}

// Eliminar un gasto
async function eliminarGasto(usuarioId,gastoId) {
  try {
    const gasto=await GastoModelo.findOne({ _id: gastoId, usuario: usuarioId });
    if(!gasto){
        return { mensaje: "Gasto no encontrado o no pertenece al usuario" };
    }
    await GastoModelo.deleteOne({ _id: gastoId });
    return { mensaje: "Gasto eliminado exitosamente" };
    } catch (error) {
    return { mensaje: "Error al eliminar el gasto", error: error.message };
  }
}

module.exports = {
  crearGasto,
  obtenerGastosMesActual,
  actualizarGasto,
  eliminarGasto,
  obtenerGastossMesSeleccionado,
};
