const eventuser = require("../Models/model.user");
const eventomodel = require("../Models/model.eventos");
const ingresoExtraModel = require("../Models/model.ingresoExtra");
const gastoModel = require("../Models/model.gastos");

function formatDateToString(date) {
  return date.toISOString().split("T")[0];
}

async function obtenerResumenMesAnterior(usuarioId) {
  try {
    // calcular inicio y fin del mes anterior
    const ahora = new Date();
    const inicioPrev = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    const finPrev = new Date(
      inicioPrev.getFullYear(),
      inicioPrev.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    // Año y mes para regex 'YYYY-MM'
    const year = inicioPrev.getFullYear();
    const monthStr = String(inicioPrev.getMonth() + 1).padStart(2, "0");

    // Buscar y sumar
    const eventos = await eventomodel.find({
      usuario: usuarioId,
      fecha: { $regex: `^${year}-${monthStr}` },
    });
    const ingresos = await ingresoExtraModel.find({
      usuario: usuarioId,
      fecha: { $regex: `^${year}-${monthStr}` },
    });
    const gastos = await gastoModel.find({
      usuario: usuarioId,
      fecha: { $regex: `^${year}-${monthStr}` },
    });

    const eventsTotal = eventos.reduce(
      (acc, e) => acc + (parseFloat(e.gananciaGeneral) || 0),
      0
    );
    const ingresosTotal = ingresos.reduce(
      (acc, i) => acc + (parseFloat(i.monto) || 0),
      0
    );
    const gastosTotal = gastos.reduce(
      (acc, g) => acc + (parseFloat(g.monto) || 0),
      0
    );

    const restante = eventsTotal + ingresosTotal - gastosTotal;

    return {
      mensaje: "Resumen mes anterior obtenido",
      periodo: `${year}-${monthStr}`,
      totals: {
        eventsTotal,
        ingresosTotal,
        gastosTotal,
        restante,
      },
      counts: {
        eventos: eventos.length,
        ingresos: ingresos.length,
        gastos: gastos.length,
      },
    };
  } catch (error) {
    return {
      mensaje: "Error al obtener resumen mes anterior",
      error: error.message,
    };
  }
}

async function obtenerResumenMesActual(usuarioId) {
  try {
    const ahora = new Date();
    const year = ahora.getFullYear();
    const monthStr = String(ahora.getMonth() + 1).padStart(2, "0");

    // Buscar por prefijo 'YYYY-MM' (funciona si fecha se guardó como 'YYYY-MM-DD')
    const eventos = await eventomodel.find({
      usuario: usuarioId,
      fecha: { $regex: `^${year}-${monthStr}` },
    });
    const ingresos = await ingresoExtraModel.find({
      usuario: usuarioId,
      fecha: { $regex: `^${year}-${monthStr}` },
    });
    const gastos = await gastoModel.find({
      usuario: usuarioId,
      fecha: { $regex: `^${year}-${monthStr}` },
    });

    const eventsTotal = eventos.reduce((acc, e) => {
      const paga = e.estadoPago === "cancelado" ? parseFloat(e.paga) || 0 : 0;
      const propina = parseFloat(e.propina) || 0; // Suma propina siempre
      return acc + paga + propina;
    }, 0);
    const ingresosTotal = ingresos.reduce(
      (acc, i) => acc + (parseFloat(i.monto) || 0),
      0
    );
    const gastosTotal = gastos.reduce(
      (acc, g) => acc + (parseFloat(g.monto) || 0),
      0
    );
    const pendiente = eventos.reduce(
      (acc, e) =>
        e.estadoPago === "pendiente" ? acc + (parseFloat(e.paga) || 0) : acc,
      0
    );
    const totalGenerado = eventsTotal + ingresosTotal;
    const restante = totalGenerado - gastosTotal;

    return {
      mensaje: "Resumen mes actual obtenido",
      periodo: `${year}-${monthStr}`,
      totals: {
        eventsTotal,
        ingresosTotal,
        gastosTotal,
        restante,
        pendiente,
        totalGenerado,
      },
      counts: {
        eventos: eventos.length,
        ingresos: ingresos.length,
        gastos: gastos.length,
      },
    };
  } catch (error) {
    return {
      mensaje: "Error al obtener resumen mes actual",
      error: error.message,
    };
  }
}

async function obtenerResumenMesSeleccionado(usuarioId, mes) {
  try {
    const ahora = new Date();
    const year = ahora.getFullYear();
    const monthStr = String(mes).padStart(2, "0");
    // Buscar por prefijo 'YYYY-MM' (asumiendo fecha guardada como 'YYYY-MM-DD' string)
    const eventos = await eventomodel.find({
      usuario: usuarioId,
      fecha: { $regex: `^${year}-${monthStr}` },
    });
    const ingresos = await ingresoExtraModel.find({
      usuario: usuarioId,
      fecha: { $regex: `^${year}-${monthStr}` },
    });
    const gastos = await gastoModel.find({
      usuario: usuarioId,
      fecha: { $regex: `^${year}-${monthStr}` },
    });
    const eventsTotal = eventos.reduce(
      (acc, e) => acc + (parseFloat(e.gananciaGeneral) || 0),
      0
    );
    const ingresosTotal = ingresos.reduce(
      (acc, i) => acc + (parseFloat(i.monto) || 0),
      0
    );
    const gastosTotal = gastos.reduce(
      (acc, g) => acc + (parseFloat(g.monto) || 0),
      0
    );
    const totalGenerado = ingresosTotal + eventsTotal;
    const restante = eventsTotal + ingresosTotal - gastosTotal;

    return {
      mensaje: "Resumen mes seleccionado obtenido",
      periodo: `${year}-${monthStr}`,
      data: {
        eventos,
        ingresos,
        gastos,
      },
      totals: {
        eventsTotal,
        ingresosTotal,
        totalGenerado,
        gastosTotal,
        restante,
      },
      counts: {
        eventos: eventos.length,
        ingresos: ingresos.length,
        gastos: gastos.length,
      },
    };
  } catch (error) {
    return {
      mensaje: "Error al obtener resumen mes seleccionado",
      error: error.message,
    };
  }
}

async function totalGeneradoMesActual(usuarioId) {
  try {
    const ahora = new Date();
    const year = ahora.getFullYear();
    const monthStr = String(ahora.getMonth() + 1).padStart(2, "0");
    // Buscar por prefijo 'YYYY-MM' (funciona si fecha se guardó como 'YYYY-MM-DD')
    const eventos = await eventomodel.find({
      usuario: usuarioId,
      fecha: { $regex: `^${year}-${monthStr}` },
    });
    const ingresos = await ingresoExtraModel.find({
      usuario: usuarioId,
      fecha: { $regex: `^${year}-${monthStr}` },
    });
    const eventsTotal = eventos.reduce((acc, e) => {
      const paga = e.estadoPago === "cancelado" ? parseFloat(e.paga) || 0 : 0;
      const propina = parseFloat(e.propina) || 0; // Suma propina siempre
      return acc + paga + propina;
    }, 0);
    const ingresosTotal = ingresos.reduce(
      (acc, i) => acc + (parseFloat(i.monto) || 0),
      0
    );
    const totalGenerado = eventsTotal + ingresosTotal;
    return {
      mensaje: "Total generado mes actual obtenido",
      totalGenerado,
    };
  } catch (error) {
    return {
      mensaje: "Error al obtener total generado mes actual",
      error: error.message,
    };
  }
}

module.exports = {
  obtenerResumenMesAnterior,
  obtenerResumenMesActual,
  obtenerResumenMesSeleccionado,
  totalGeneradoMesActual,
};
