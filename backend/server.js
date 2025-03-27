require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación
const productosRoutes = require('./routes/productosRoutes'); // Rutas de productos

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("🔥 Conectado a MongoDB");
  console.log("🔥 Base de datos conectada:", mongoose.connection.name);
})
.catch(err => console.error("❌ Error al conectar a MongoDB:", err));

// Usar las rutas de autenticación y productos
app.use('/api/auth', authRoutes); // Ejemplo: /api/auth/login
app.use('/api', productosRoutes); // Ejemplo: /api/productos

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
