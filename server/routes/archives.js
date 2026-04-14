const express = require('express');
const router = express.Router();
const archiveController = require('../controllers/archiveController');

router.get('/', archiveController.getArchivedLogs);

module.exports = router;
