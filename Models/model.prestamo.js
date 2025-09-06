const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prestamoSchema = new Schema({
  fecha: { type: Date, required: true },
  monto: { type: Number, required: true },
  interes: { type: Number, required: true },
  ganancia: { type: Number, required: true },
  total: { type: Number, required: true },
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true }, // referencia al usuario
});

const PrestamoModelo = mongoose.model("Prestamo", prestamoSchema);
module.exports = PrestamoModelo;
