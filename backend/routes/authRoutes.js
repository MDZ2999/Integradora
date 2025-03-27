const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const Usuarios = require('../models/usuarios');
const router = express.Router();

// Configuración de multer para el almacenamiento de imágenes
const storage = multer.memoryStorage(); // Almacena la imagen en memoria como Buffer
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  },
  fileFilter: function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Solo se permiten imágenes!'), false);
    }
    cb(null, true);
  }
});

// Ruta para registrar un nuevo usuario
router.post('/register', upload.single('Imagen'), async (req, res) => {
  try {
    const { Nombre, Apellido_paterno, Apellido_materno, Correo, Contrasena } = req.body;
    
    // Verificar si el correo ya está registrado
    const usuarioExistente = await Usuarios.findOne({ Correo });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Crear el nuevo usuario
    const nuevoUsuario = new Usuarios({
      Nombre,
      Apellido_paterno,
      Apellido_materno,
      Correo,
      Contrasena,
      Imagen: req.file ? req.file.buffer : undefined
    });

    // Guardar el usuario en la base de datos
    await nuevoUsuario.save();

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuarioId: nuevoUsuario._id
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const usuario = await Usuarios.findOne({ Correo: correo.toLowerCase() });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Por ahora comparación directa, luego implementaremos bcrypt
    if (usuario.Contrasena !== contrasena) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.json({
      message: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario._id,
        nombre: usuario.Nombre,
        correo: usuario.Correo
      }
    });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
