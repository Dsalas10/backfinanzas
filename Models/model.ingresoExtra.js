const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingresoExtra = new Schema({
  fecha: { type: String, required: true },
  monto: { type: Number, required: true },
  concepto:{type:String ,required:true},
  detalle:{type:String, default:"-"},
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true }, // referencia al usuario
});

const IngresoExtraModelo = mongoose.model("IngresoExtra", ingresoExtra);
module.exports = IngresoExtraModelo;
