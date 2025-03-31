const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumentamos el límite para manejar imágenes base64
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rutas
const productosRoutes = require('./routes/productosRoutes');
const authRoutes = require('./routes/authRoutes');

// Configurar rutas con prefijos correctos
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/integradora')
  .then(() => {
    console.log(" Conectado a MongoDB");
    console.log(" Base de datos conectada:", mongoose.connection.name);
  })
  .catch((error) => {
    console.error(" Error al conectar a MongoDB:", error);
  });

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
