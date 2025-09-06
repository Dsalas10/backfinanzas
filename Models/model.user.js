const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  creadoEn: { type: Date, default: Date.now },
});


//Middleware para hashear la contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  try {
    const saltRounds = 10;
    this.password=await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

usuarioSchema.methods.compararPassword=async function(password2) {
  return bcrypt.compare(password2, this.password);
}



// Método para validar contraseña
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};



const User = mongoose.model('Usuario', userSchema);
module.exports = User;