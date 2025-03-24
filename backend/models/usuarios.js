const mongoose = require('mongoose');

const usuariosSchema = new mongoose.Schema({
  Nombre: String,
  Apellido_paterno: String,
  Apellido_materno: String,
  Correo: { type: String, unique: true },
  Contraseña: String // Aquí se almacena la contraseña encriptada
});

module.exports = mongoose.model('Usuario', usuariosSchema);
