const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 10000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Configuración de la base de datos PostgreSQL (Render)
const pool = new Pool({
  connectionString: 'postgresql://tgs_user:b6EkgcyjB8x4ZtPgAtLdNnMY7pK5Uh1L@dpg-cvu8h83uibrs73ejppp0-a.oregon-postgres.render.com/tgs',
  ssl: {
    rejectUnauthorized: false
  }
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Servidor activo en Render!');
});

// Ruta para verificar conexión a la base de datos
app.get('/db-check', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      message: 'Conexión exitosa a la base de datos ✅',
      serverTime: result.rows[0].now
    });
  } catch (err) {
    console.error('Error de conexión a la base de datos:', err);
    res.status(500).json({ error: 'No se pudo conectar a la base de datos ❌' });
  }
});

// Ruta de ejemplo de registro (sin usar base de datos)
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos requeridos.' });
  }

  // Simulación de registro exitoso (sin base de datos)
  return res.status(200).json({
    message: 'Usuario simulado registrado correctamente',
    id: 1
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
