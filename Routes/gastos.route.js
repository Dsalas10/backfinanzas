const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const validarCampos = require("../MiddleWares/ValidarCampos");
const {
  crearGasto,
  obtenerGastosMesActual,
  obtenerGastossMesSeleccionado,
  eliminarGasto,
  actualizarGasto,
} = require("../Controllers/controller.gastos");

const reglasGasto = {
  fecha: [
    body("fecha")
      .notEmpty()
      .withMessage("Fecha obligatoria")
      .isISO8601()
      .withMessage("Fecha inválida"),
  ],
  monto: [
    body("monto")
      .notEmpty()
      .withMessage("Monto obligatorio")
      .isFloat({ gt: 0 }),
  ],
  concepto: [body("concepto").notEmpty().withMessage("Concepto obligatorio")],
  usuarioId: [body("usuarioId").notEmpty().isMongoId()],
};

//gastos del mes actual
router.get("/gastos/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ mensaje: "ID de usuario inválido" });
    }
    const resultado = await obtenerGastosMesActual(userId);
    if (resultado.mensaje && resultado.mensaje === "Usuario no encontrado") {
      return res.status(404).json({ mensaje: resultado.mensaje });
    }
    if (resultado.error) {
      return res
        .status(500)
        .json({ mensaje: resultado.mensaje, error: resultado.error });
    }
    return res
      .status(200)
      .json({ mensaje: "datos encontrados", gastos: resultado });
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al obtener gastos", error: error.message });
  }
});

router.post("/nuevoGasto", validarCampos(reglasGasto), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errores: errors.array() });
  try {
    const { fecha, concepto, monto, detalle, usuarioId } = req.body;
    const resultado = await crearGasto(fecha, concepto, monto, detalle, usuarioId);
    if (resultado.error)
      return res
        .status(500)
        .json({
          mensaje: "error al Registrar El Gasto",
          error: resultado.error,
        });
    res
      .status(201)
      .json({ mensaje: "Gasto Creado Exictosamente", gasto: resultado });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear el gasto", error: error.message });
  }
});

router.delete("/gastos/eliminar", async (req, res) => {
  const { usuarioId, gastoId } = req.body;
  if (!usuarioId) {
    return res
      .status(400)
      .json({ mensaje: "Falta el usuarioId para validar la eliminación" });
  }
  try {
    const resultado = await eliminarGasto(usuarioId, gastoId);
    if (resultado.mensaje === "Gasto eliminado exitosamente") {
      return res.status(200).json({ mensaje: resultado.mensaje });
    }
    return res.status(404).json({ mensaje: resultado.mensaje });
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al eliminar el gasto", error: error.message });
  }
});

router.get("/gastos/:userId/:meseleccionado", async (req, res) => {
  const { userId, meseleccionado } = req.params;
  try {
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ mensaje: "ID de usuario inválido" });
    }
    const resultado = await obtenerGastossMesSeleccionado(
      userId,
      parseInt(meseleccionado)
    );
    return res.json(resultado);
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al obtener los gastos", error: error.message });
  }
});

router.put("/gastos/editar/:gastoId",validarCampos(reglasGasto), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    const { gastoId } = req.params;
    const { fecha, concepto, monto, detalle, usuarioId } = req.body;
    try {
      const datosEditados = { fecha, concepto, monto, detalle };
      const resultado = await actualizarGasto(
        gastoId,
        usuarioId,
        datosEditados
      );
      if(!resultado) {
        return res.status(404).json({ mensaje: resultado.mensaje   });
      }
      if (resultado.error) {
        return res.status(500).json({ mensaje: resultado.error, });
      }
      return res.status(200).json({ mensaje: resultado.mensaje, gasto: resultado.gasto });
    } catch (error) {
      return res
        .status(500)
        .json({
          mensaje: "Error al actualizar el gasto",
          error: error.message,
        });
    }
  }
);

module.exports = router;
