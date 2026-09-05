const express = require('express');
const router = express.Router();
const icdoController = require('../controllers/icdoController');

router.get('/', icdoController.getCatalog);

module.exports = router;
