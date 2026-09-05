const db = require('../config/db');

// GET /api/citas
const getCitas = async (req, res) => {
    try {
        const sql = `
            SELECT 
                c.id, c.fecha_hora, c.tipo_cita, c.motivo, c.estado,
                p.identificador_fhir AS paciente_fhir, p.nombres AS paciente_nombres, p.apellidos AS paciente_apellidos,
                pr.nombres AS prof_nombres, pr.apellidos AS prof_apellidos, pr.especialidad
            FROM CITA c
            JOIN PACIENTE p ON c.paciente_id = p.id
            JOIN PROFESIONAL_SALUD pr ON c.profesional_id = pr.id
            ORDER BY c.fecha_hora DESC
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener citas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// GET /api/citas/:id
const getCitaById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM CITA WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Cita no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// POST /api/citas
const createCita = async (req, res) => {
    try {
        const { paciente_id, profesional_id, fecha_hora, tipo_cita, motivo, estado } = req.body;
        
        if (!paciente_id || !profesional_id || !fecha_hora || !tipo_cita || !estado) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        // Si paciente_id viene como UUID (FHIR string), necesitamos buscar el INT id de mysql
        let actualPacienteId = paciente_id;
        if (typeof paciente_id === 'string') {
            const [pRows] = await db.query('SELECT id FROM PACIENTE WHERE identificador_fhir = ?', [paciente_id]);
            if (pRows.length === 0) return res.status(404).json({ error: 'Paciente no encontrado por FHIR ID' });
            actualPacienteId = pRows[0].id;
        }

        const sql = `INSERT INTO CITA (paciente_id, profesional_id, fecha_hora, tipo_cita, motivo, estado) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [actualPacienteId, profesional_id, fecha_hora, tipo_cita, motivo, estado]);
        
        res.status(201).json({ message: 'Cita agendada con éxito', id: result.insertId });
    } catch (error) {
        console.error('Error al crear cita:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// PUT /api/citas/:id
const updateCita = async (req, res) => {
    try {
        const { paciente_id, profesional_id, fecha_hora, tipo_cita, motivo, estado } = req.body;
        
        let actualPacienteId = paciente_id;
        if (typeof paciente_id === 'string') {
            const [pRows] = await db.query('SELECT id FROM PACIENTE WHERE identificador_fhir = ?', [paciente_id]);
            if (pRows.length === 0) return res.status(404).json({ error: 'Paciente no encontrado por FHIR ID' });
            actualPacienteId = pRows[0].id;
        }

        const sql = `UPDATE CITA SET paciente_id=?, profesional_id=?, fecha_hora=?, tipo_cita=?, motivo=?, estado=? WHERE id=?`;
        const [result] = await db.query(sql, [actualPacienteId, profesional_id, fecha_hora, tipo_cita, motivo, estado, req.params.id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cita no encontrada' });
        res.json({ message: 'Cita actualizada con éxito' });
    } catch (error) {
        console.error('Error al actualizar cita:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// DELETE (Cancelar) /api/citas/:id
const deleteCita = async (req, res) => {
    try {
        const sql = `UPDATE CITA SET estado = 'Cancelada' WHERE id = ?`;
        const [result] = await db.query(sql, [req.params.id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cita no encontrada' });
        res.json({ message: 'Cita cancelada con éxito (Soft delete)' });
    } catch (error) {
        console.error('Error al cancelar cita:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { getCitas, getCitaById, createCita, updateCita, deleteCita };
