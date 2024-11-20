const express = require('express');
const Turno = require('../models/Turno');
const router = express.Router();

// Crear un nuevo turno
router.post('/', async (req, res) => {
  try {
    const nuevoTurno = new Turno(req.body);
    await nuevoTurno.save();
    res.status(201).json(nuevoTurno);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el turno', error });
  }
});

// Obtener todos los turnos activos
router.get('/', async (req, res) => {
  try {
    const turnos = await Turno.find({ activo: true }); // Solo turnos activos
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los turnos', error });
  }
});

// Actualizar un turno
router.put('/:id', async (req, res) => {
  try {
    const turnoActualizado = await Turno.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!turnoActualizado) {
      return res.status(404).json({ mensaje: 'Turno no encontrado' });
    }
    res.json(turnoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el turno', error });
  }
});

// Eliminar un turno (borrado lógico)
router.delete('/:id', async (req, res) => {
  try {
    const turnoActualizado = await Turno.findByIdAndUpdate(
      req.params.id,
      { activo: false }, // Cambiamos el estado a "inactivo"
      { new: true } // Retornamos el turno actualizado
    );

    if (!turnoActualizado) {
      return res.status(404).json({ mensaje: 'Turno no encontrado' });
    }

    res.json({ mensaje: 'Turno desactivado con éxito', turno: turnoActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al desactivar el turno', error });
  }
});

module.exports = router;
