const db = require('../config/db');

// GET /api/profesionales
const getProfesionales = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, nombres, apellidos, especialidad, jvpm FROM PROFESIONAL_SALUD WHERE activo = TRUE');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener profesionales:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getProfesionales
};
