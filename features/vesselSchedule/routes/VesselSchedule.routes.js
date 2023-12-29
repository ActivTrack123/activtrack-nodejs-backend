const express = require('express');
const VesselScheduleController = require('../controllers/VesselScheduleController');
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
router.post('/', [check('portOfReceipt').not().isEmpty()], verifyToken, VesselScheduleController.create);

// Get all Method
router.get('/', [
    query('page').optional().isNumeric(),
    query('limit').optional().isNumeric(),
    query('query').optional().isString(),
], verifyToken, VesselScheduleController.index);

// Get by ID Method
router.get('/:id/show', verifyToken, VesselScheduleController.show);

// Update by ID Method
router.put('/:id/update', [], verifyToken, VesselScheduleController.update);

// Delete by ID Method
router.delete('/:id/delete', verifyToken, VesselScheduleController.delete);

// Get by query Method
router.get('/find', verifyToken, VesselScheduleController.findVesselSchedule);

module.exports = router;
