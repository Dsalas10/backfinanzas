const eventomodel = require("../Models/model.eventos");
const usuarioModel = require("../Models/model.user");

async function crearEvento(datosEvento) {
  try {
    const exist = await usuarioModel.findById(datosEvento.usuario);
    if (!exist) {
      return { mensaje: "usuario no encontrado" };
    }
    const nuevoEvento = new eventomodel(datosEvento);
    await nuevoEvento.save();
    return { mensaje: "Evento creado exitosamente", evento: nuevoEvento };
  } catch (error) {
    return { mensaje: "Error al crear el evento", error: error.message };
  }
}

async function obtenerEventosMesActual(usuarioId) {
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
    function formatDateToString(date) {
      return date.toISOString().split("T")[0];
    }
    const inicioMesStr = formatDateToString(inicioMes);
    const finMesStr = formatDateToString(finMes);


    const eventos = await eventomodel
      .find({
        usuario: usuarioId,
        fecha: { $gte: inicioMesStr, $lte: finMesStr },
      })
      .sort({ fecha: -1 });
    return { mensaje: "Datos obtenitdos", eventos };
  } catch (error) {
    return { mensaje: "Error al obtener los eventos", error: error.message };
  }
}
async function obtenerEventosMesSeleccionado(usuarioId, mes) {
  try {
    const inicioMes = new Date(new Date().getFullYear(), mes - 1, 1);
    const finMes = new Date(new Date().getFullYear(), mes, 0, 23, 59, 59);
    const eventos = await eventomodel
      .find({
        usuario: usuarioId,
        fecha: { $gte: inicioMes, $lte: finMes },
      })
      .sort({ fecha: -1 });
    return { eventos };
  } catch (error) {
    return { mensaje: "Error al obtener los eventos", error: error.message };
  }
}
async function eliminarEvento(usuarioId, eventoId) {
  try {
    const evento = await eventomodel.findOne({
      _id: eventoId,
      usuario: usuarioId,
    });
    if (!evento) {
      return { mensaje: "Evento no encontrado o  no pertenece al usuario" };
    }
    await eventomodel.deleteOne({ _id: eventoId });
    return {
      mensaje: "Evento eliminado exitosamente",
    };
  } catch (error) {
    return { mensaje: "Error al eliminar el evento", error: error.message };
  }
}
module.exports = {
  crearEvento,
  obtenerEventosMesActual,
  obtenerEventosMesSeleccionado,
  eliminarEvento,
};
