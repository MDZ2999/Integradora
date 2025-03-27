const express = require('express');
const router = express.Router();
const Producto = require('../models/Productos');
const Usuario = require('../models/usuarios');

// Obtener todos los productos con información del usuario
router.get('/productos', async (req, res) => {
  try {
      const productos = await Producto.find()
          .populate({
              path: 'id_usuarios',
              select: 'Nombre Imagen'
          });

      const productosConImagen = productos.map(producto => ({
          ...producto.toObject(),
          id_usuarios: {
              ...producto.id_usuarios.toObject(),
              Imagen: producto.id_usuarios.Imagen
                  ? `data:image/jpeg;base64,${producto.id_usuarios.Imagen.toString('base64')}`
                  : '' // Si no tiene imagen, devolver un string vacío
          },
          Imagen: producto.Imagen
              ? `data:image/jpeg;base64,${producto.Imagen.toString('base64')}`
              : '' // Misma conversión para la imagen del producto
      }));

      console.log("Productos encontrados:", productosConImagen);
      res.json(productosConImagen);
  } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
});

// Obtener un usuario específico por ID
router.get('/usuarios/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id)
            .select('Nombre Imagen.url');

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
