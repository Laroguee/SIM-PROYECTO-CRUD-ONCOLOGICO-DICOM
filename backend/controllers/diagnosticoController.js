const db = require('../config/db');

// GET /api/diagnosticos/paciente/:id
const getDiagnosticosByPaciente = async (req, res) => {
    try {
        // req.params.id puede ser el UUID del paciente, buscamos su ID interno
        let actualPacienteId = req.params.id;
        if (typeof actualPacienteId === 'string' && isNaN(actualPacienteId)) {
            const [pRows] = await db.query('SELECT id FROM PACIENTE WHERE identificador_fhir = ?', [actualPacienteId]);
            if (pRows.length === 0) return res.json([]);
            actualPacienteId = pRows[0].id;
        }

        const sql = `
            SELECT d.*, i.codigo, i.descripcion as icdo_desc, i.eje,
                   pr.nombres as prof_nombres, pr.apellidos as prof_apellidos
            FROM DIAGNOSTICO d
            JOIN DIAGNOSTICO_ICDO i ON d.icdo_id = i.id
            JOIN PROFESIONAL_SALUD pr ON d.profesional_id = pr.id
            WHERE d.paciente_id = ?
            ORDER BY d.fecha_diagnostico DESC
        `;
        const [rows] = await db.query(sql, [actualPacienteId]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener diagnósticos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// POST /api/diagnosticos
const createDiagnostico = async (req, res) => {
    try {
        const { paciente_id, profesional_id, icdo_id, fecha_diagnostico, observaciones } = req.body;
        
        let actualPacienteId = paciente_id;
        if (typeof paciente_id === 'string' && isNaN(paciente_id)) {
            const [pRows] = await db.query('SELECT id FROM PACIENTE WHERE identificador_fhir = ?', [paciente_id]);
            if (pRows.length === 0) return res.status(404).json({ error: 'Paciente no encontrado' });
            actualPacienteId = pRows[0].id;
        }

        const sql = `INSERT INTO DIAGNOSTICO (paciente_id, profesional_id, icdo_id, fecha_diagnostico, observaciones) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [actualPacienteId, profesional_id, icdo_id, fecha_diagnostico, observaciones]);
        
        res.status(201).json({ message: 'Diagnóstico creado', id: result.insertId });
    } catch (error) {
        console.error('Error al crear diagnóstico:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// DELETE /api/diagnosticos/:id
const deleteDiagnostico = async (req, res) => {
    try {
        await db.query('DELETE FROM DIAGNOSTICO WHERE id = ?', [req.params.id]);
        res.json({ message: 'Diagnóstico eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { getDiagnosticosByPaciente, createDiagnostico, deleteDiagnostico };
