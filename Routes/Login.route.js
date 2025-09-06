const express = require("express");
const router = express.Router();
const {
  loginUsuario,
} = require("./../Controllers/controller.usuario");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const resultado = await loginUsuario(email, password);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;
