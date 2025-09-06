const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const validarCampos  = require("../MiddleWares/ValidarCampos");
const {
  crearGasto,
  obtenerGastosMesActual,
  actualizarGasto,
  eliminarGasto,
} = require("../Controllers/controller.gastos");

const reglasGasto = {
  fechaa: [
    body("fecha")
      .notEmpty()
      .withMessage("Fecha obligatoria")
      .isISO8601()
      .withMessage("Fecha inválida"),
  ],
  concepto: [body("concepto").notEmpty().withMessage("Concepto obligatorio")],
  monto: [
    body("monto")
      .notEmpty()
      .withMessage("Monto obligatorio")
      .isFloat({ gt: 0 }),
  ],
  usuarioId: [body("usuarioId").notEmpty().isMongoId()],
};

let gastos = [
  { id: 1, nombre: "Gasto 1", fecha: "2024-06-02", monto: 150 },
  { id: 2, nombre: "Gasto 2", fecha: "2024-06-18", monto: 300 },
];

router.get("/", (req, res) => {
  res.json(gastos);
});

router.post("/nuevoGasto", validarCampos(reglasGasto), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errores: errors.array() });
  try {
    const { fecha, concepto, monto, usuarioId } = req.body;
    const resultado = await crearGasto(fecha, concepto, monto, usuarioId);
    if (resultado.error)
      return res
        .status(500)
        .json({ mensaje: resultado.mensaje, error: resultado.error });
    res
      .status(201)
      .json({ mensaje: resultado.mensaje, gasto: resultado.gasto });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear el gasto", error: error.message });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  gastos = gastos.filter((gasto) => gasto.id !== parseInt(id));
  res.status(204).json({ message: "gasto eliminado" });
});

module.exports = router;
