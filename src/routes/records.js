const express = require('express');
const router = express.Router();
const {createRecord,updateRecord,getRecords,deleteRecord} = require('../controllers/recordController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');


router.get('/', authMiddleware, authorize('Admin', 'Analyst'), getRecords);
router.post('/add', authMiddleware, authorize('Admin'), createRecord);
router.patch('/:id', authMiddleware, authorize('Admin'), updateRecord);
router.delete('/:id', authMiddleware, authorize('Admin'), deleteRecord);


module.exports = router;