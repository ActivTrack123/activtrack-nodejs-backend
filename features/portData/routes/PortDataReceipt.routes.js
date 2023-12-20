const express = require('express');
const PortDataReceiptController = require('../controllers/PortDataReceiptController');
const { verifyToken } = require('../../../middleware/AuthMiddleware');
const { check, query } = require('express-validator');
const { PortDataReceiptStatus } = require('../../../config/constants');

const validateURLDomain = (fieldValue) => {
    return check(fieldValue).optional().custom((value) => {
        // Your URL validation logic here
        // ...
        return true;
    });
};

const router = express.Router();

// Post Method
router.post('/', [
    check('name').not().isEmpty(),
    check('status').isIn(Object.values(PortDataReceiptStatus))
], verifyToken, PortDataReceiptController.create);

// Get all Method
router.get('/', [
    query('page').optional().isNumeric(),
    query('limit').optional().isNumeric(),
    query('query').optional().isString(),
], verifyToken, PortDataReceiptController.index);

// Get by ID Method
router.get('/:id/show', verifyToken, PortDataReceiptController.show);

// Update by ID Method
router.put('/:id/update', [
    check('name').not().isEmpty(),
    check('status').isIn(Object.values(PortDataReceiptStatus))
], verifyToken, PortDataReceiptController.update);

// Delete by ID Method
router.delete('/:id/delete', verifyToken, PortDataReceiptController.delete);



module.exports = router;
