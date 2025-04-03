const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/usuarios');
const router = express.Router();

// Configuración de multer para el almacenamiento de imágenes
const storage = multer.memoryStorage();
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

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secret_key';

// Middleware para verificar el token JWT
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Ruta para obtener datos del usuario
router.get('/usuarios/:id', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuarios.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // No enviar la contraseña
    const usuarioData = {
      _id: usuario._id,
      nombre: usuario.Nombre,
      apellidoPaterno: usuario.Apellido_paterno,
      apellidoMaterno: usuario.Apellido_materno,
      correo: usuario.Correo,
      foto: usuario.Imagen ? {
        url: `data:image/jpeg;base64,${usuario.Imagen.toString('base64')}`,
        filename: 'profile.jpg'
      } : null
    };

    res.json(usuarioData);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para actualizar datos del usuario
router.put('/usuarios/:id', verificarToken, upload.single('foto'), async (req, res) => {
  try {
    const usuario = await Usuarios.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar que el usuario autenticado solo pueda modificar su propio perfil
    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: 'No autorizado para modificar este perfil' });
    }

    // Actualizar solo los campos proporcionados
    if (req.body.nombre) usuario.Nombre = req.body.nombre;
    if (req.body.apellidoPaterno) usuario.Apellido_paterno = req.body.apellidoPaterno;
    if (req.body.apellidoMaterno) usuario.Apellido_materno = req.body.apellidoMaterno;
    if (req.body.correo) usuario.Correo = req.body.correo.toLowerCase();
    if (req.body.contrasena) {
      const salt = await bcrypt.genSalt(10);
      usuario.Contrasena = await bcrypt.hash(req.body.contrasena, salt);
    }
    if (req.file) {
      usuario.Imagen = req.file.buffer;
    }

    await usuario.save();
    res.json({ message: 'Perfil actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para registrar un nuevo usuario
router.post('/register', upload.single('Imagen'), async (req, res) => {
  try {
    const { Nombre, Apellido_paterno, Apellido_materno, Correo, Contrasena } = req.body;
    
    // Validar campos requeridos
    if (!Nombre || !Apellido_paterno || !Apellido_materno || !Correo || !Contrasena) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Correo)) {
      return res.status(400).json({ message: 'Formato de correo electrónico inválido' });
    }
    
    // Verificar si el correo ya está registrado
    const usuarioExistente = await Usuarios.findOne({ Correo: Correo.toLowerCase() });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Crear el nuevo usuario
    const nuevoUsuario = new Usuarios({
      Nombre,
      Apellido_paterno,
      Apellido_materno,
      Correo: Correo.toLowerCase(),
      Contrasena,
      Imagen: req.file ? req.file.buffer : undefined
    });

    // Guardar el usuario en la base de datos
    await nuevoUsuario.save();

    // Generar token JWT
    const token = jwt.sign(
      { userId: nuevoUsuario._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.Nombre,
        correo: nuevoUsuario.Correo
      }
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

    // Validar campos requeridos
    if (!correo || !contrasena) {
      return res.status(400).json({ message: 'Por favor, ingrese correo y contraseña' });
    }

    // Buscar usuario por correo (case insensitive)
    const usuario = await Usuarios.findOne({ Correo: correo.toLowerCase() });
    if (!usuario) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Verificar contraseña usando el método del modelo
    const passwordMatch = await usuario.comparePassword(contrasena);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: usuario._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Enviar respuesta exitosa con el token
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.Nombre,
        correo: usuario.Correo
      }
    });

  } catch (error) {
    console.error('Error en inicio de sesión:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
