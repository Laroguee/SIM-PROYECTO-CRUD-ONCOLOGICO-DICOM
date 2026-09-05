const express = require('express');
const router = express.Router();
const quimioController = require('../controllers/quimioController');

router.get('/paciente/:id', quimioController.getQuimiosByPaciente);
router.post('/', quimioController.createQuimio);
router.put('/:id', quimioController.updateQuimio);

module.exports = router;
