const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const eventoSchema = new Schema({
  fecha: { type: String, required: true },
  incluirReciboEnVenta: { type: Boolean, default: false },
  contarReciboComoPago: { type: Boolean, default: false },
  pagafijocheck:{type:Boolean, default:false},
  pagaporcentajecheck:{type:Boolean,default:false},
  tipo: { type: String, required: true },
  pagoRecibo: { type: Number, default: 0 },
  pagoQR: { type: Number, default: 0 },
  pagoBaucher: { type: Number, default: 0 },
  pagoEfectivo: { type: Number, default: 0 },
  ventaTotalGeneral: { type: Number, default: 0 },
  propina: { type: Number, default: 0 },
  gananciaGeneral: { type: Number, default: 0 },
  porcentaje: { type: Number, default: 0 },
  paga:{type:Number,defaulta:0},
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true }, // referencia al usuario
});

const EventoModelo = mongoose.model("Evento", eventoSchema);
module.exports = EventoModelo;
