const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Obtener el token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secret_key');
    
    // Añadir el usuario al request
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = auth;
