const db = require('../config/db');

// GET /api/quimioterapias/paciente/:id
const getQuimiosByPaciente = async (req, res) => {
    try {
        let actualPacienteId = req.params.id;
        if (typeof actualPacienteId === 'string' && isNaN(actualPacienteId)) {
            const [pRows] = await db.query('SELECT id FROM PACIENTE WHERE identificador_fhir = ?', [actualPacienteId]);
            if (pRows.length === 0) return res.json([]);
            actualPacienteId = pRows[0].id;
        }

        const sql = `
            SELECT q.*, d.fecha_diagnostico, i.descripcion as icdo_desc,
                   pr.nombres as prof_nombres, pr.apellidos as prof_apellidos
            FROM QUIMIOTERAPIA q
            JOIN DIAGNOSTICO d ON q.diagnostico_id = d.id
            JOIN DIAGNOSTICO_ICDO i ON d.icdo_id = i.id
            JOIN PROFESIONAL_SALUD pr ON q.profesional_id = pr.id
            WHERE q.paciente_id = ?
            ORDER BY q.numero_ciclo ASC
        `;
        const [rows] = await db.query(sql, [actualPacienteId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

// POST /api/quimioterapias
const createQuimio = async (req, res) => {
    try {
        const { paciente_id, diagnostico_id, profesional_id, numero_ciclo, regimen, fecha_inicio, fecha_fin, estado } = req.body;
        
        let actualPacienteId = paciente_id;
        if (typeof paciente_id === 'string' && isNaN(paciente_id)) {
            const [pRows] = await db.query('SELECT id FROM PACIENTE WHERE identificador_fhir = ?', [paciente_id]);
            if (pRows.length === 0) return res.status(404).json({ error: 'Paciente no encontrado' });
            actualPacienteId = pRows[0].id;
        }

        const sql = `INSERT INTO QUIMIOTERAPIA (paciente_id, diagnostico_id, profesional_id, numero_ciclo, regimen, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [actualPacienteId, diagnostico_id, profesional_id, numero_ciclo, regimen, fecha_inicio, fecha_fin, estado]);
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

// PUT /api/quimioterapias/:id
const updateQuimio = async (req, res) => {
    try {
        const { numero_ciclo, regimen, fecha_inicio, fecha_fin, estado } = req.body;
        const sql = `UPDATE QUIMIOTERAPIA SET numero_ciclo=?, regimen=?, fecha_inicio=?, fecha_fin=?, estado=? WHERE id=?`;
        await db.query(sql, [numero_ciclo, regimen, fecha_inicio, fecha_fin, estado, req.params.id]);
        res.json({ message: 'Actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

module.exports = { getQuimiosByPaciente, createQuimio, updateQuimio };
