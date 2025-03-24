const express = require('express');
const bcrypt = require('bcrypt');
const Usuarios = require('../models/usuarios');
const router = express.Router();

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    // Buscar al usuario en la base de datos
    const usuario = await Usuarios.findOne({ Correo: correo });

    if (!usuario) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Verificar si la contraseña es correcta
    const passwordMatch = await bcrypt.compare(contrasena, usuario.Contraseña.toString());

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Si las credenciales son correctas, devolvemos una respuesta exitosa
    res.status(200).json({ message: 'Inicio de sesión exitoso', usuarioId: usuario._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

module.exports = router;
