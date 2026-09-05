const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Transformación a recurso Patient de FHIR
const formatToFHIR = (patient) => {
    return {
        resourceType: "Patient",
        id: patient.identificador_fhir,
        identifier: [
            {
                use: "official",
                system: "urn:oid:2.16.840.1.113883.4.1", // OID Genérico o de país para Documento de Identidad
                value: patient.documento_identidad
            }
        ],
        name: [
            {
                use: "official",
                family: patient.apellidos,
                given: patient.nombres.split(' ')
            }
        ],
        gender: patient.genero,
        birthDate: patient.fecha_nacimiento ? patient.fecha_nacimiento.toISOString().split('T')[0] : null,
        active: patient.activo === 1
    };
};

// GET /api/patients
const getPatients = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM PACIENTE WHERE activo = TRUE');
        const fhirPatients = rows.map(formatToFHIR);
        res.json(fhirPatients);
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// POST /api/patients
const createPatient = async (req, res) => {
    try {
        const { documento_identidad, nombres, apellidos, fecha_nacimiento, genero } = req.body;
        
        if (!documento_identidad || !nombres || !apellidos || !fecha_nacimiento || !genero) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const identificador_fhir = uuidv4();

        const sql = `
            INSERT INTO PACIENTE 
            (identificador_fhir, documento_identidad, nombres, apellidos, fecha_nacimiento, genero) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [identificador_fhir, documento_identidad, nombres, apellidos, fecha_nacimiento, genero];

        const [result] = await db.query(sql, values);
        
        res.status(201).json({ 
            message: 'Paciente creado con éxito', 
            id: result.insertId,
            identificador_fhir
        });
    } catch (error) {
        console.error('Error al crear paciente:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El documento de identidad ya está registrado.' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// PUT /api/patients/:id
const updatePatient = async (req, res) => {
    try {
        const patientId = req.params.id; // FHIR UUID
        const { documento_identidad, nombres, apellidos, fecha_nacimiento, genero } = req.body;

        const sql = `
            UPDATE PACIENTE 
            SET documento_identidad = ?, nombres = ?, apellidos = ?, fecha_nacimiento = ?, genero = ?
            WHERE identificador_fhir = ? AND activo = TRUE
        `;
        const values = [documento_identidad, nombres, apellidos, fecha_nacimiento, genero, patientId];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado o inactivo' });
        }

        res.json({ message: 'Paciente actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar paciente:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El documento de identidad ya está registrado.' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// DELETE /api/patients/:id
const deletePatient = async (req, res) => {
    try {
        const patientId = req.params.id; // FHIR UUID

        const sql = 'UPDATE PACIENTE SET activo = FALSE WHERE identificador_fhir = ?';
        const [result] = await db.query(sql, [patientId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado o ya eliminado' });
        }

        res.json({ message: 'Paciente eliminado (soft delete) con éxito' });
    } catch (error) {
        console.error('Error al eliminar paciente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getPatients,
    createPatient,
    updatePatient,
    deletePatient
};
