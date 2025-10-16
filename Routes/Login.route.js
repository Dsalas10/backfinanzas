const express = require("express");
const router = express.Router();
const {
  loginUsuario,
} = require("./../Controllers/controller.usuario");

router.post("/login", async (req, res) => {
  console.log('Solicitud recibida:', req.body);
  try {
    const { username, password } = req.body;
    if(!username || !password){
      return res.status(400).json({error:"Nombre y contraseña son obligatorios"})
    }
    const nombre=username
    const resultado = await loginUsuario(nombre, password);
    if(resultado.error){
      return res.status(400).json({error:resultado.error})
    }
    return res.status(200).json({mensaje:"login success",resultado});
  } catch (error) {
    return res.status(400).json({mensaje:"invalid credentials", error: error.message });
  }
});



module.exports = router;
