const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth'); 
const authorize = require('../middleware/authorize'); 

router.get('/summary', authMiddleware, authorize('Admin', 'Analyst', 'Viewer'), getSummary);

module.exports = router;