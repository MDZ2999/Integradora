const mongoose = require('mongoose');

const ProductosSchema = new mongoose.Schema({
  Nom_producto: String,
  Cantidad: Number,
  Municipio: String,
  Codigo_postal: Number,
  Numero_telefonico: Number,
  Calidad: String,
  Categoria: String,
  Descripcion: String,
  Estado: {
    type: String,
    required: true,
    enum: ['Disponible', 'No disponible'],
    default: 'Disponible'
  },
  id_usuarios: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  Imagen: {
    type: Buffer,
    required: false
  },
});

module.exports = mongoose.model('productos', ProductosSchema);
