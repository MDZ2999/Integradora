const mongoose = require('mongoose');

const usuariosSchema = new mongoose.Schema({
  Nombre: String,
  Apellido_paterno: String,
  Apellido_materno: String,
  Correo: { type: String, required: true, unique: true },
  Contraseña: { type: String, required: true }
});

module.exports = mongoose.model('Usuario', usuariosSchema);
