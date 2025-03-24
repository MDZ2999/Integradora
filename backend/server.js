require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Importar las rutas de autenticación

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("🔥 Conectado a MongoDB"))
  .catch(err => console.error("❌ Error al conectar a MongoDB:", err));

// Usar las rutas de autenticación
app.use('/api/auth', authRoutes); // El prefijo /api/auth será usado para las rutas de login, por ejemplo: /api/auth/login

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
