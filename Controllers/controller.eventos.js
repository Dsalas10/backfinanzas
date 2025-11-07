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
    // Buscar por prefijo 'YYYY-MM' (asumiendo fecha guardada como 'YYYY-MM-DD' string)
    const now = new Date();
    const year = now.getFullYear();
    const monthStr = String(now.getMonth() + 1).padStart(2, "0");

    const eventos = await eventomodel
      .find({
        usuario: usuarioId,
        fecha: { $regex: `^${year}-${monthStr}` },
      })
      .sort({ fecha: -1 });
    return { mensaje: "Datos obtenidos mes", eventos };
  } catch (error) {
    return { mensaje: "Error al obtener los eventos", error: error.message };
  }
}
async function obtenerEventosMesSeleccionado(usuarioId, mes) {
  try {
    // mes debe venir como string 'MM', ejemplo '01' para enero
    const year = new Date().getFullYear();
    const mesStr = String(mes).padStart(2, '0');
    // Buscar eventos donde fecha empiece con 'YYYY-MM'
    const eventos = await eventomodel
      .find({
        usuario: usuarioId,
        fecha: { $regex: `^${year}-${mesStr}` },
      })
      .sort({ fecha: -1 });
    return { mensaje: "Datos obtenidos del mes seleccionado", eventos };
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
async function actualizarEvento(eventoId, usuarioId, nuevosDatos) {
  try {
    const evento = await eventomodel.findOne({
      _id: eventoId,
      usuario: usuarioId,
    });
    if (!evento) {
      return { mensaje: "Evento no encontrado o no pertenece al usuario" };
    }
    evento.set(nuevosDatos);
    await evento.save();
    return { mensaje: "Evento actualizado exitosamente", evento };
  } catch (error) {
    return { mensaje: "Error al actualizar el evento", error: error.message };
  }
}
module.exports = {
  crearEvento,
  obtenerEventosMesActual,
  obtenerEventosMesSeleccionado,
  eliminarEvento,
  actualizarEvento,
};
