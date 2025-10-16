const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const validarCampos = require("../MiddleWares/ValidarCampos");
const {
  crearPrestamo,
  obtenerPrestamosMesActual,
  eliminarPrestamo,
  obtenerPrestamosMesSeleccionado
} = require("../Controllers/controller.prestamos");

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
      .withMessage("Monto de venta obligatorio")
      .isNumeric()
      .withMessage("Monto de venta debe ser un número"),
  ],
  interes: [
    body("interes")
      .notEmpty()
      .withMessage("interes obligatorio")
      .isNumeric()
      .withMessage("interes debe ser un número"),
  ],
};
router.post("/nuevo", validarCampos(reglasPrestamo), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  try {
    const datoPrestamo = req.body;
    const resultado = await crearPrestamo(datoPrestamo);
    if (resultado.error) {
      res
        .status(500)
        .json({
          mensaje: "Error al registrar el prestamo",
          error: resultado.error,
        });
    }
    res
      .status(201)
      .json({ mensaje: "Prestamo Creado Exictosamente", prestamo: resultado.nuevoPrestamo });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear el prestamo", error: error.message });
  }
});

router.delete("/eliminar", async (req, res) => {
  const{usuarioId,prestamoId}=req.body
  console.log("date",req.body)
  if (!usuarioId) {
    return res.status(400).json({ mensaje: 'Falta el usuarioId para validar la eliminación' });
  }
  try {
    const resultado = await eliminarPrestamo(usuarioId, prestamoId);
    if (!resultado) {
      return res.status(404).json({ mensaje: resultado.mensaje });
    }
    return res.status(200).json({ mensaje: resultado.mensaje });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al eliminar el gasto", error: error.message });
  }
});


//traer los prstamos del mes actual
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    if(!userId.match(/^[0-9a-fA-F]{24}$/)){
      return res.status(400).json({ mensaje: "ID de usuario inválido" });
    }
    const resultado = await obtenerPrestamosMesActual(userId);
    if (resultado.error) {
      return res.status(500).json({ mensaje: resultado.mensaje, error: resultado.error });
    }
    return res.status(200).json({ mensaje: "datos encontrados",  prestamos:resultado.prestamo });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener los prestamos", error: error.message });
  }
});

router.get("/:userId/:meseleccionado", async (req, res) => {
  const { userId, meseleccionado } = req.params;
  try {
    if(!userId.match(/^[0-9a-fA-F]{24}$/)){
      return res.status(400).json({ mensaje: "ID de usuario inválido" });
    }
    const resultado = await obtenerPrestamosMesSeleccionado(
      userId,
      parseInt(meseleccionado)
    );
    return res.json(resultado);
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al obtener los prestamos", error: error.message });
  }
});

module.exports = router;
