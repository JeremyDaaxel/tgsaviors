const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 10000;

// Middlewares
app.use(cors({
  origin: 'https://www.rankher.net',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
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

// Ruta de registro sin encriptación de la contraseña
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos requeridos.' });
  }

  try {
    // Insertar usuario en la base de datos sin encriptar la contraseña
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, password]
    );

    res.status(201).json({
      message: 'Usuario registrado correctamente ✅',
      user: result.rows[0],
    });
  } catch (err) {
    console.error('❌ Error al registrar usuario:', err);

    if (err.code === '23505') {
      // Código de error PostgreSQL para clave duplicada (email único)
      return res.status(409).json({ error: 'El email ya está registrado.' });
    }

    res.status(500).json({ error: 'Error del servidor al registrar usuario.' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
