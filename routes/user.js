const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Rutas para registrar un nuevo usurio

router.post("/register", async (req, res) => {
  const { nombre, password, edad } = req.body;
  try {
    const existingUser = await User.findOne({ nombre });
    if (existingUser) {
      return res.status(400).send("El usuario ya existe");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ nombre, edad, password: hashedPassword });

    await newUser.save();
    //console.log("Usuario registrado: ", newUser);
    res.status(201).send("Usuario registardo con éxito");
  } catch (err) {
    console.error("Error al registrar el usuario: ", err);
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { nombre,edad, password } = req.body;

  try {
    const user = await User.findOne({ nombre });
    if (!user) {
      return res.status(401).send('Usuario no encontrado');
    }

    const match = await bcrypt.compare(password, user.password); 
    if (!match) {
      console.error('Contraseña incorrecta para el usuario:', nombre);
      return res.status(401).send('Contraseña incorrecta');
    }

    req.session.user = user.nombre; // Almacena el nombre de usuario en la sesión
    res.send(`Usuario ${user.nombre} ha iniciado sesión.`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.send('Sesión cerrada.');
  });
});

//Ruta protegida
router.get('/protegida', (req, res) => {
  if (req.session.user) {
    res.send(`Bienvenido, ${req.session.user}`);
  } else {
    res.status(401).send('No autorizado');
  }
});




module.exports = router;
