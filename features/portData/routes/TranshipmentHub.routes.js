const express = require('express');
const TranshipmentHubController = require('../controllers/TranshipmentHubController');
const { verifyToken } = require('../../../middleware/AuthMiddleware');
const { check, query } = require('express-validator');
const { TranshipmentHubStatus } = require('../../../config/constants');

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
    check('status').isIn(Object.values(TranshipmentHubStatus))
], verifyToken, TranshipmentHubController.create);

// Get all Method
router.get('/', [
    query('page').optional().isNumeric(),
    query('limit').optional().isNumeric(),
    query('query').optional().isString(),
], verifyToken, TranshipmentHubController.index);

// Get by ID Method
router.get('/:id/show', verifyToken, TranshipmentHubController.show);

// Update by ID Method
router.put('/:id/update', [
    check('name').not().isEmpty(),
    check('status').isIn(Object.values(TranshipmentHubStatus))
], verifyToken, TranshipmentHubController.update);

// Delete by ID Method
router.delete('/:id/delete', verifyToken, TranshipmentHubController.delete);



module.exports = router;
