const express = require('express');
const VesselController = require('../controllers/VesselController');
const { verifyToken } = require('../../../middleware/AuthMiddleware');
const { check, query } = require('express-validator');
const { VesselStatus } = require('../../../config/constants');

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
    check('lat').not().isEmpty().isNumeric(),
    check('lng').not().isEmpty().isNumeric(),
    check('status').isIn(Object.values(VesselStatus))
], verifyToken, VesselController.create);

// Get all Method
router.get('/', [
    query('page').optional().isNumeric(),
    query('limit').optional().isNumeric(),
    query('query').optional().isString(),
], verifyToken, VesselController.index);

// Get by ID Method
router.get('/:id/show', verifyToken, VesselController.show);

// Update by ID Method
router.put('/:id/update', [
    check('name').not().isEmpty(),
    check('lat').not().isEmpty().isNumeric(),
    check('lng').not().isEmpty().isNumeric(),
    check('status').isIn(Object.values(VesselStatus))
], verifyToken, VesselController.update);

// Delete by ID Method
router.delete('/:id/delete', verifyToken, VesselController.delete);

module.exports = router;
