const express = require("express");
const router = express.Router();

let prestamos = [
  { id: 1, nombre: "Préstamo X", fecha: "2024-06-05", monto: 1000 },
  { id: 2, nombre: "Préstamo Y", fecha: "2024-06-20", monto: 2000 },
];

router.get("/", (req, res) => {
  res.json(prestamos);
});

router.post("/", (req, res) => {
  const { nombre, fecha, monto } = req.body;
  if (!nombre || !fecha || !monto) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }
  const nuevoPrestamo = {
    id: prestamos.length + 1,
    nombre,
    fecha,
    monto,
  };
  prestamos.push(nuevoPrestamo);
  res.status(201).json(nuevoPrestamo);
});
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  prestamos = prestamos.filter((prestamo) => prestamo.id !== parseInt(id));
  res.status(204).send();
});


module.exports = router;
