const db = require('../config/db');

// GET /api/estadiajes/diagnostico/:id
const getEstadiajeByDiagnostico = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ESTADIAJE WHERE diagnostico_id = ?', [req.params.id]);
        if (rows.length === 0) return res.json(null);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

// POST /api/estadiajes
const createEstadiaje = async (req, res) => {
    try {
        const { diagnostico_id, tnm_t, tnm_n, tnm_m, estadio_general, metodo_evaluacion } = req.body;
        const sql = `INSERT INTO ESTADIAJE (diagnostico_id, tnm_t, tnm_n, tnm_m, estadio_general, metodo_evaluacion) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [diagnostico_id, tnm_t, tnm_n, tnm_m, estadio_general, metodo_evaluacion]);
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

// PUT /api/estadiajes/:id
const updateEstadiaje = async (req, res) => {
    try {
        const { tnm_t, tnm_n, tnm_m, estadio_general, metodo_evaluacion } = req.body;
        const sql = `UPDATE ESTADIAJE SET tnm_t=?, tnm_n=?, tnm_m=?, estadio_general=?, metodo_evaluacion=? WHERE id=?`;
        await db.query(sql, [tnm_t, tnm_n, tnm_m, estadio_general, metodo_evaluacion, req.params.id]);
        res.json({ message: 'Actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

module.exports = { getEstadiajeByDiagnostico, createEstadiaje, updateEstadiaje };
