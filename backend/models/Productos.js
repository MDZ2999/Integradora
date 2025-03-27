const mongoose = require('mongoose');

const ProductosSchema = new mongoose.Schema({
  Nom_producto: String,
  Cantidad: Number,
  Municipio: String,
  Codigo_postal: Number,
  Calidad: String,
  Categoria: String,
  Descripcion: String,
  id_usuarios: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  Imagen: {
    type: Buffer, // Esto se utiliza para almacenar datos binarios
    required: false
  },
});

module.exports = mongoose.model('productos', ProductosSchema);
