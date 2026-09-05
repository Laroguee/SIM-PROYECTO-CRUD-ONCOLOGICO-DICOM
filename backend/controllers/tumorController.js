const db = require('../config/db');

// GET /api/tumores/diagnostico/:id
const getTumorByDiagnostico = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM CARACTERISTICA_TUMOR WHERE diagnostico_id = ?', [req.params.id]);
        if (rows.length === 0) return res.json(null);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

// POST /api/tumores
const createTumor = async (req, res) => {
    try {
        const { diagnostico_id, localizacion, tipo_histologico, grado_tumoral, receptores } = req.body;
        const sql = `INSERT INTO CARACTERISTICA_TUMOR (diagnostico_id, localizacion, tipo_histologico, grado_tumoral, receptores) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [diagnostico_id, localizacion, tipo_histologico, grado_tumoral, receptores]);
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

// PUT /api/tumores/:id
const updateTumor = async (req, res) => {
    try {
        const { localizacion, tipo_histologico, grado_tumoral, receptores } = req.body;
        const sql = `UPDATE CARACTERISTICA_TUMOR SET localizacion=?, tipo_histologico=?, grado_tumoral=?, receptores=? WHERE id=?`;
        await db.query(sql, [localizacion, tipo_histologico, grado_tumoral, receptores, req.params.id]);
        res.json({ message: 'Actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

module.exports = { getTumorByDiagnostico, createTumor, updateTumor };
