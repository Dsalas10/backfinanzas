const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const validarCampos = require("../MiddleWares/ValidarCampos");
const auth = require("../MiddleWares/auth");
const {
  crearIngresoExtra,
  obtenerIngresosExtrasMesActual,
  eliminarIngresoExtra,
  obtenerIngresoExtraMesSeleccionado
} = require("../Controllers/controller.IngresoExtra");

const reglasPrestamo = {
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
      .isNumeric()
      .withMessage("Monto de venta debe ser un número"),
  ],
  concepto: [
    body("concepto")
      .notEmpty()
      .withMessage("concepto obligatorio")
      .isString()
      .withMessage("concepto debe ser un número"),
  ],
};
router.post("/nuevo", auth, validarCampos(reglasPrestamo), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  try {
    const datos = req.body;
    const resultado = await crearIngresoExtra(datos);
    if (resultado.error) {
      res
        .status(500)
        .json({
          mensaje: "Error al registrar el Ingreso Extra",
          error: resultado.error,
        });
    }
    res
      .status(201)
      .json({ mensaje: "Ingreso Extra Creado Exictosamente", ingresoExtra: resultado.nuevoIngresoExtra });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear el Ingreso Extra", error: error.message });
  }
});

router.delete("/eliminar", auth, async (req, res) => {
  const{usuarioId,ingresoExtraId}=req.body
  if (!usuarioId) {
    return res.status(400).json({ mensaje: 'Falta el usuarioId para validar la eliminación' });
  }
  try {
    const resultado = await eliminarIngresoExtra(usuarioId, ingresoExtraId);
    if (!resultado) {
      return res.status(404).json({ mensaje: resultado.mensaje });
    }
    return res.status(200).json({ mensaje: resultado.mensaje });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al eliminar el Ingreso Extra", error: error.message });
  }
});


//traer los Ingresos extras del mes actual
router.get("/:userId", auth, async (req, res) => {
  const { userId } = req.params;
  try {
    if(!userId.match(/^[0-9a-fA-F]{24}$/)){
      return res.status(400).json({ mensaje: "ID de usuario inválido" });
    }
    const resultado = await obtenerIngresosExtrasMesActual(userId);
    if (resultado.error) {
      return res.status(500).json({ mensaje: resultado.mensaje, error: resultado.error });
    }
    return res.status(200).json({ mensaje:"Datos encontrados", ingresosExtras:resultado.ingresoExtra });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener los Ingresos Extras", error: error.message });
  }
});

router.get("/:userId/:meseleccionado", auth, async (req, res) => {
  const { userId, meseleccionado } = req.params;
  try {
    if(!userId.match(/^[0-9a-fA-F]{24}$/)){
      return res.status(400).json({ mensaje: "ID de usuario inválido" });
    }
    const resultado = await obtenerIngresoExtraMesSeleccionado(
      userId,
      parseInt(meseleccionado)
    );
    return res.json({mensaje:"Obteniendo datos del mes selecionado de ingreso Extra ", resultado:resultado.ingresoExtra });
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al obtener los Ingresos Extras", error: error.message });
  }
});

module.exports = router;
