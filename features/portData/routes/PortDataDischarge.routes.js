const express = require('express');
const PortDataDischargeController = require('../controllers/PortDataDischargeController');
const { verifyToken } = require('../../../middleware/AuthMiddleware');
const { check, query } = require('express-validator');
const { PortDataDischargeStatus } = require('../../../config/constants');

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
    check('status').isIn(Object.values(PortDataDischargeStatus))
], verifyToken, PortDataDischargeController.create);

// Get all Method
router.get('/', [
    query('page').optional().isNumeric(),
    query('limit').optional().isNumeric(),
    query('query').optional().isString(),
], verifyToken, PortDataDischargeController.index);

// Get by ID Method
router.get('/:id/show', verifyToken, PortDataDischargeController.show);

// Update by ID Method
router.put('/:id/update', [
    check('name').not().isEmpty(),
    check('status').isIn(Object.values(PortDataDischargeStatus))
], verifyToken, PortDataDischargeController.update);

// Delete by ID Method
router.delete('/:id/delete', verifyToken, PortDataDischargeController.delete);



module.exports = router;
