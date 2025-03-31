const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuariosSchema = new mongoose.Schema({
  Nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  Apellido_paterno: {
    type: String,
    required: [true, 'El apellido paterno es obligatorio'],
    trim: true
  },
  Apellido_materno: {
    type: String,
    required: [true, 'El apellido materno es obligatorio'],
    trim: true
  },
  Correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor ingrese un correo válido']
  },
  Contrasena: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  Imagen: {
    type: Buffer,
    required: false
  },
}, {
  timestamps: true // Agrega createdAt y updatedAt
});

// Método para comparar contraseñas
usuariosSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.Contrasena);
  } catch (error) {
    throw new Error('Error al comparar contraseñas');
  }
};

// Middleware para hashear la contraseña antes de guardar
usuariosSchema.pre('save', async function(next) {
  if (!this.isModified('Contrasena')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.Contrasena = await bcrypt.hash(this.Contrasena, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Usuario', usuariosSchema);
