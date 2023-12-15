const express = require('express');
const CustomerController = require('../controllers/CustomersController');
const { verifyToken } = require('../../../middleware/AuthMiddleware');
const { check, query } = require('express-validator');
const { CustomerStatus } = require('../../../config/constants');

const validateURLDomain = (fieldValue) => {
    return check(fieldValue).optional().custom((value) => {
        try {
            const url = new URL(value);
            const baseUrl = process.env.AWS_S3_BASEURL;
            if (`https://${url.hostname}` !== baseUrl) {
                throw new Error('Invalid domain');
            }
            return true;
        } catch (err) {
            throw new Error('Invalid URL');
        }
    });
};

const router = express.Router()

//Post Method
router.post('/', [
    check('name').not().isEmpty(),
    check('email').not().isEmpty(),
    check('phone').not().isEmpty(),
    check('age').not().isEmpty().isNumeric(),
    check('address').not().isEmpty(),
    check('country').not().isEmpty(),
    check('zipCode').not().isEmpty(),
    check('web').optional().isURL(),
    validateURLDomain('photo').withMessage('Invalid image URL'),
    check('description').optional(),
    check('status').isIn(Object.values(CustomerStatus))
], verifyToken, CustomerController.create);

//Get all Method
router.get('/', [
    query('page').optional().isNumeric(),
    query('limit').optional().isNumeric(),
    query('query').optional().isString(),
], verifyToken, CustomerController.index)

//Get by ID Method
router.get('/:id/show', verifyToken, CustomerController.show)

//Update by ID Method
router.put('/:id/update', [
    check('name').not().isEmpty(),
    check('email').not().isEmpty().isEmail(),
    check('phone').not().isEmpty(),
    check('age').not().isEmpty().isNumeric(),
    check('address').not().isEmpty(),
    check('country').not().isEmpty(),
    check('zipCode').not().isEmpty(),
    check('web').optional().isURL(),
    validateURLDomain('photo').withMessage('Invalid image URL'),
    check('description').optional(),
    check('status').isIn(Object.values(CustomerStatus))
], verifyToken, CustomerController.update)

//Delete by ID Method
router.delete('/:id/delete', verifyToken, CustomerController.delete)

module.exports = router;