const express = require('express');
const router = express.Router();
const Producto = require('../models/Productos');
const Usuario = require('../models/usuarios');
const auth = require('../middleware/auth');

// Ruta pública para obtener productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find().populate('id_usuarios');
    
    const productosConImagenes = productos.map(producto => {
      const productoObj = producto.toObject();

      // Convertir imagen del producto
      if (productoObj.Imagen) {
        productoObj.Imagen = convertirImagenABase64(productoObj.Imagen);
      }

      // Convertir imagen del usuario
      if (productoObj.id_usuarios?.Imagen) {
        productoObj.id_usuarios.Imagen = convertirImagenABase64(productoObj.id_usuarios.Imagen);
      }

      return productoObj;
    });

    res.json(productosConImagenes);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
});

// Ruta protegida para crear productos
router.post('/', auth, async (req, res) => {
  try {
    console.log('Recibiendo solicitud para crear nuevo producto...');
    const { 
      Nom_producto, 
      Cantidad, 
      Municipio, 
      Codigo_postal, 
      Numero_telefonico, 
      Calidad, 
      Categoria, 
      Subcategoria, 
      Descripcion, 
      Imagen
    } = req.body;

    // Convertir la imagen base64 a Buffer
    let imagenBuffer = null;
    if (Imagen?.contenido) {
      // Remover el prefijo de data URL si existe
      const base64Data = Imagen.contenido.replace(/^data:image\/\w+;base64,/, '');
      imagenBuffer = Buffer.from(base64Data, 'base64');
    }

    const nuevoProducto = new Producto({
      Nom_producto,
      Cantidad: Number(Cantidad),
      Municipio,
      Codigo_postal: Number(Codigo_postal),
      Numero_telefonico: Number(Numero_telefonico),
      Calidad,
      Categoria,
      Subcategoria,
      Descripcion,
      Imagen: imagenBuffer,
      id_usuarios: req.userId // Usar el ID del usuario autenticado
    });

    await nuevoProducto.save();
    res.status(201).json({ message: 'Producto creado exitosamente', producto: nuevoProducto });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
});

// Función para convertir imagen de MongoDB a base64
function convertirImagenABase64(imagen) {
  try {
    if (!imagen) return null;
    
    // Si es un objeto Buffer
    if (Buffer.isBuffer(imagen)) {
      return `data:image/jpeg;base64,${imagen.toString('base64')}`;
    }
    
    // Si es un objeto Binary de MongoDB
    if (imagen.buffer) {
      return `data:image/jpeg;base64,${imagen.buffer.toString('base64')}`;
    }

    // Si ya es una cadena base64, verificar que sea válida
    if (typeof imagen === 'string' && imagen.startsWith('data:image')) {
      return imagen;
    }

    console.log('❌ Formato de imagen no reconocido:', typeof imagen);
    return null;

  } catch (error) {
    console.error('❌ Error al convertir imagen:', error);
    return null;
  }
}

// Obtener un usuario específico por ID
router.get('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id)
      .select('Nombre Imagen');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
});

module.exports = router;
