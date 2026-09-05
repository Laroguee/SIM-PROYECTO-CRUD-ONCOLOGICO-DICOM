const db = require('../config/db');

// GET /api/icdo
const getCatalog = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM DIAGNOSTICO_ICDO ORDER BY codigo ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener catalogo ICDO:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { getCatalog };
