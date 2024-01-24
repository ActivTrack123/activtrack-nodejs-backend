const express = require('express');
const PortDataLoadingController = require('../controllers/PortDataLoadingController');
const { verifyToken } = require('../../../middleware/AuthMiddleware');
const { check, query } = require('express-validator');
const { PortDataLoadingStatus } = require('../../../config/constants');

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
    check('status').isIn(Object.values(PortDataLoadingStatus))
], verifyToken, PortDataLoadingController.create);

// Get all Method
router.get('/', [
    query('page').optional().isNumeric(),
    query('limit').optional().isNumeric(),
    query('query').optional().isString(),
], verifyToken,PortDataLoadingController.index);

// Get all Method
router.get('/all',PortDataLoadingController.allPortDataLoading);

// Get by ID Method
router.get('/:id/show', verifyToken, PortDataLoadingController.show);

// Update by ID Method
router.put('/:id/update', [
    check('name').not().isEmpty(),
    check('status').isIn(Object.values(PortDataLoadingStatus))
], verifyToken, PortDataLoadingController.update);

// Delete by ID Method
router.delete('/:id/delete', verifyToken, PortDataLoadingController.delete);



module.exports = router;
