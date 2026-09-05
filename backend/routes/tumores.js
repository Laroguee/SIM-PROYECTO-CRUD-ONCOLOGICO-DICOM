const express = require('express');
const router = express.Router();
const tumorController = require('../controllers/tumorController');

router.get('/diagnostico/:id', tumorController.getTumorByDiagnostico);
router.post('/', tumorController.createTumor);
router.put('/:id', tumorController.updateTumor);

module.exports = router;
