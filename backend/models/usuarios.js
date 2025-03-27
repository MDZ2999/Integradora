const mongoose = require('mongoose');

const usuariosSchema = new mongoose.Schema({
  Nombre: String,
  Apellido_paterno: String,
  Apellido_materno: String,
  Correo: { type: String, required: true, unique: true },
  Contrasena: { type: String, required: true },
  Imagen: {
    type: Buffer, // Esto se utiliza para almacenar datos binarios
    required: false
  },
});

module.exports = mongoose.model('Usuario', usuariosSchema);
