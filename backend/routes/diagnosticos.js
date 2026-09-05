const express = require('express');
const router = express.Router();
const diagnosticoController = require('../controllers/diagnosticoController');

router.get('/paciente/:id', diagnosticoController.getDiagnosticosByPaciente);
router.post('/', diagnosticoController.createDiagnostico);
router.delete('/:id', diagnosticoController.deleteDiagnostico);

module.exports = router;
