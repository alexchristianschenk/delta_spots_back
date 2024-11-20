const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    dia: { type: String, required: true },
    hora: { type: String, required: true },
    activo: { type: Boolean, default: true } // Nuevo campo para el borrado lógico
});

module.exports = mongoose.model('Turno', turnoSchema);
