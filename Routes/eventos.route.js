const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const validarCampos = require("../MiddleWares/ValidarCampos");
const {
  crearEvento,
  obtenerEventosMesActual,
  obtenerEventosMesSeleccionado,
  eliminarEvento,
  actualizarEvento,
} = require("../Controllers/controller.eventos");
const auth = require("../MiddleWares/auth");
const reglasEvento = {
  fecha: [
    body("fecha")
      .notEmpty()
      .withMessage("Fecha obligatoria")
      .isISO8601()
      .withMessage("Fecha inválida"),
  ],
  ventaTotalGeneral: [
    body("ventaTotalGeneral")
      .notEmpty()
      .withMessage("Monto de venta obligatorio")
      .isNumeric()
      .withMessage("Monto de venta debe ser un número"),
  ],
};


router.post("/nuevoEvento", auth, validarCampos(reglasEvento), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errores: errors.array() });
  try {
    const datosEvento = req.body;
    const resultado = await crearEvento(datosEvento);
    return res
      .status(201)
      .json({ mensaje: "Registro del Evento Existoso", data: resultado });
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al crear el evento", error: error.message });
  }
});

//traer eventos del mes actual con el id del usaario
router.get("/:usuarioId",auth, async (req, res) => {
  try {
    const { usuarioId } = req.params;
    if (!usuarioId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ mensaje: "ID de usuario inválido" });
    }
    const resultado = await obtenerEventosMesActual(usuarioId);
    if (!resultado) {
      return res.status(404).json({ mensaje: resultado.mensaje });
    }
    if (resultado.error) {
      return res.status(500).json({ mensaje: resultado.error });
    }

    return res
      .status(200)
      .json({ mensaje: resultado.mensaje, data: resultado.eventos });
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al obtener los eventos", error: error.message });
  }
});
router.get("/:usuarioId/:messeleccionado",auth, async (req, res) => {
  try {
    const { usuarioId, messeleccionado } = req.params;
    if (!usuarioId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ mensaje: "ID de usuario inválido" });
    }
    if (
      !messeleccionado ||
      isNaN(messeleccionado) ||
      parseInt(messeleccionado) < 1 ||
      parseInt(messeleccionado) > 12
    ) {
      return res.status(400).json({ mensaje: "Mes inválido" });
    }

    const resultado = await obtenerEventosMesSeleccionado(
      usuarioId,
      parseInt(messeleccionado)
    );
    if (!resultado) {
      return res.status(404).json({ mensaje: resultado.mensaje });
    }
    if (resultado.error) {
      return res.status(500).json({ mensaje: resultado.error });
    }
    return res
      .status(200)
      .json({ mensaje: resultado.mensaje, eventos: resultado.eventos });
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al obtener los eventos", error: error.message });
  }
});
router.delete("/eliminar", auth,async (req, res) => {
  try {
    const { usuarioId, eventoId } = req.body;
    const resultado = await eliminarEvento(usuarioId, eventoId);
    if (!resultado) {
      return res.status(404).json({ mensaje: resultado.mensaje });
    }
    if (resultado.error) {
      return res.status(500).json({ mensaje: resultado.error });
    }

    return res.status(200).json({ mensaje: resultado.mensaje });
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al eliminar el evento", error: error.message });
  }
});



router.put(
  "/actualizar/:eventoId", auth,
  validarCampos(reglasEvento),
  async (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errores: errors.array() });
    try {
      const { eventoId } = req.params;
      const { usuarioId, ...eventoActualizado } = req.body;
      const resultado = await actualizarEvento(eventoId, usuarioId, eventoActualizado);
      if (!resultado) {
        return res.status(404).json({ mensaje: resultado.mensaje });
      }
      if (resultado.error) {
        return res.status(500).json({ mensaje: resultado.error });
      }
      return res.status(200).json({ mensaje: resultado.mensaje, evento: resultado.evento });
    } catch (error) {
      return res
        .status(500)
        .json({ mensaje: "Error al actualizar el evento", error: error.message });
    }
  }
);

module.exports = router;
