const express = require('express');
const router = express.Router();
const estadiajeController = require('../controllers/estadiajeController');

router.get('/diagnostico/:id', estadiajeController.getEstadiajeByDiagnostico);
router.post('/', estadiajeController.createEstadiaje);
router.put('/:id', estadiajeController.updateEstadiaje);

module.exports = router;
