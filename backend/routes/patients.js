const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Obtener todos los pacientes activos (formato FHIR)
router.get('/', patientController.getPatients);

// Registrar un paciente (genera UUID)
router.post('/', patientController.createPatient);

// Actualizar un paciente existente
router.put('/:id', patientController.updatePatient);

// Eliminar un paciente de manera lógica
router.delete('/:id', patientController.deletePatient);

module.exports = router;
