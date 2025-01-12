const express = require('express');
const DSRController = require('../controllers/DsrController');
const { verifyToken } = require('../../../middleware/AuthMiddleware');
const { check, query } = require('express-validator');

const validateURLDomain = (fieldValue) => {
    return check(fieldValue).optional().custom((value) => {
        // Your URL validation logic here
        // ...
        return true;
    });
};

const router = express.Router();

// Post Method
router.post('/', [check('kam').not().isEmpty()], verifyToken, DSRController.create);

// Get all Method
router.get('/', [
    query('page').optional().isNumeric(),
    query('limit').optional().isNumeric(),
    query('query').optional().isString(),
], verifyToken, DSRController.recentDSR);

router.get('/all', [
    query('page').optional().isNumeric(),
    query('limit').optional().isNumeric(),
    query('query').optional().isString(),
], verifyToken, DSRController.index);

// Get by ID Method
router.get('/:id/show', verifyToken, DSRController.show);

// Update by ID Method
router.put('/:id/update', [], verifyToken, DSRController.update);

// Delete by ID Method
router.delete('/:id/delete', verifyToken, DSRController.delete);

// Get Activity Log by ID Method
router.get('/:id/activitylog', verifyToken, DSRController.activityLog);

module.exports = router;
