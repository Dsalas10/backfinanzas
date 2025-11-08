const expres = require("express");
const router = expres.Router();
const {
  obtenerResumenMesAnterior,
  obtenerResumenMesActual,
  obtenerResumenMesSeleccionado,
  totalGeneradoMesActual,
} = require("../Controllers/controller.resumen");

const auth = require("../MiddleWares/auth");

router.get("/mes-anterior/:usuarioId", auth, async (req, res) => {
  try {
    const { usuarioId } = req.params;
    if (!usuarioId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ mensaje: "ID de usuario inválido" });
    }
    const resultado = await obtenerResumenMesAnterior(usuarioId);
    if (!resultado) {
      return res.status(404).json({ mensaje: resultado.mensaje });
    }
    if (resultado.error) {
      return res.status(500).json({ mensaje: resultado.error });
    }
    return res.status(200).json(resultado);
  } catch (error) {
    return res
      .status(500)
      .json({
        mensaje: "Error al obtener resumen mes anterior",
        error: error.message,
      });
  }
});

router.get("/mes-actual/:usuarioId", auth, async (req, res) => {
  try {
    const { usuarioId } = req.params;
    if (!usuarioId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ mensaje: "ID de usuario inválido" });
    }
    const resultado = await obtenerResumenMesActual(usuarioId);
    if (!resultado) {
      return res.status(404).json({ mensaje: resultado.mensaje });
    }
    if (resultado.error) {
      return res.status(500).json({ mensaje: resultado.error });
    }
    return res.status(200).json(resultado);
  } catch (error) {
    return res
      .status(500)
      .json({
        mensaje: "Error al obtener resumen mes actual",
        error: error.message,
      });
  }
});

router.get("/mes-seleccionado/:usuarioId/:mes", auth, async (req, res) => {
  try {
    const { usuarioId, mes } = req.params;
    if (!usuarioId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ mensaje: "ID de usuario inválido" });
    }
    if (!mes || isNaN(mes) || parseInt(mes) < 1 || parseInt(mes) > 12) {
      return res.status(400).json({ mensaje: "Mes inválido" });
    }
    const resultado = await obtenerResumenMesSeleccionado(
      usuarioId,
      parseInt(mes)
    );
    if (!resultado) {
      return res.status(404).json({ mensaje: resultado.mensaje });
    }
    if (resultado.error) {
      return res.status(500).json({ mensaje: resultado.error });
    }
    return res.status(200).json(resultado);
  } catch (error) {
    return res
      .status(500)
      .json({
        mensaje: "Error al obtener resumen mes seleccionado",
        error: error.message,
      });
  }
});

router.get("/total-generado/:usuarioId", auth, async (req, res) => {
  try {
    const { usuarioId } = req.params;
    if (!usuarioId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ mensaje: "ID de usuario inválido" });
    } 
    const resultado = await totalGeneradoMesActual(usuarioId);
    if (!resultado) {
      return res.status(404).json({ mensaje: resultado.mensaje });
    }
    if (resultado.error) {
      return res.status(500).json({ mensaje: resultado.error });
    }
    return res.status(200).json(resultado);
  } catch (error) {
    return res
      .status(500)
      .json({
        mensaje: "Error al obtener total generado mes actual",
        error: error.message,
      });
  }
});

module.exports = router;
