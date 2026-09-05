const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');

router.get('/', profesionalController.getProfesionales);

module.exports = router;
