const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gastoSchema = new Schema({
  fecha: { type: String, required: true },
  concepto: { type: String, required: true },
  monto: { type: Number, required: true },
  detalle: { type: String, default: "-" },
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true }, // referencia al usuario
});

const GastoModelo = mongoose.model("Gastos", gastoSchema);
module.exports = GastoModelo;
