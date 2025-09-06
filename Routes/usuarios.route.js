const express = require("express");
const router = express.Router();
const {
  registrarUsuario,
  cambiarPassword,
}=require("../Controllers/controller.usuario")

router.post("/registrar", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const resultado = await registrarUsuario(nombre, email, password);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/cambiarPassword", async (req, res) => {
  try {
    const { email, passwordActual, passwordNueva } = req.body;
    const resultado = await cambiarPassword(
      email,
      passwordActual,
      passwordNueva
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;