const express = require('express');
const cors = require('cors'); // Importa cors después de express
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const turnosRouter = require('./routes/turnos');
const userRoutes = require('./routes/user')

dotenv.config(); // Carga las variables de entorno al inicio

const app = express(); // Inicializa express

// Middleware
app.use(cors()); // Habilita CORS para todas las solicitudes
app.use(express.json()); // Middleware para parsear JSON

console.log("URI de MongoDB:", process.env.MONGODB_URI); // Confirmación de la URI

// Configuración de la sesión 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true, 
    cookie: { secure: false }
  }));

// Permitir solicitudes solo desde tu frontend
app.use(cors({
    origin: 'https://delta-sports.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Conectado a MongoDB"))
    .catch((error) => console.error("Error de conexión:", error));

// Usar las rutas de turnos en /api/turnos
app.use('/api/turnos', turnosRouter);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Servidor de reserva de turnos y usuarios funcionando');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
