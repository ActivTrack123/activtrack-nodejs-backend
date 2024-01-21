const express = require('express');
const UserController = require('../controllers/UserController');
const RoleController = require('../controllers/RoleController');
const PermissionController = require('../controllers/PermissionController');
const { verifyToken } = require('../../../middleware/AuthMiddleware');
const { check } = require('express-validator');

const router = express.Router()

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

// ---------- User Routes ---------- //

//Post Method
router.post('/', verifyToken, [
    check('name').not().isEmpty(),
    check('email').not().isEmpty(),
    // check('password').not().isEmpty(),
    // check('phone').not().isEmpty(),
    // check('dateOfBirth').not().isEmpty(),
    // check('address').not().isEmpty(),
    // check('start_date').not().isEmpty(),
    // check('note').not().isEmpty(),
    // check('role_id').not().isEmpty(),
    // check('job_role').not().isEmpty(),
    // check('document').not().isEmpty(),
    // validateURLDomain('document').withMessage('Invalid image URL'),
    // validateURLDomain('photo').withMessage('Invalid image URL'),
    // check('photo').not().isEmpty(),
], UserController.create);

//Get all Method
router.get('/', verifyToken, UserController.index)

//Get by ID Method
router.get('/:id/show', verifyToken, UserController.show)

//Update by ID Method
router.put('/:id/update', [
    check('name').not().isEmpty(),
    check('email').not().isEmpty(),
    // check('phone').not().isEmpty(),
    // check('dob').not().isEmpty(),
    // check('address').not().isEmpty(),
    // check('startDate').not().isEmpty(),
    // check('note').not().isEmpty(),
    // check('role').not().isEmpty(),
    // check('jobRole').not().isEmpty(),
    // validateURLDomain('document').withMessage('Invalid image URL'),
    // validateURLDomain('photo').withMessage('Invalid image URL'),
], verifyToken, UserController.update)

//Delete by ID Method
router.delete('/:id/delete', verifyToken, UserController.delete)

// ---------- Permission Routes ---------- //
router.get('/permission/', verifyToken, PermissionController.index)

router.post('/permission/', [
    check('name').not().isEmpty(),
    check('slug').not().isEmpty(),
], verifyToken, PermissionController.create);

router.put('/permission/:id/update', [
    check('name').not().isEmpty(),
    check('slug').not().isEmpty(),
], verifyToken, PermissionController.update);

// ---------- Role Routes ---------- //
router.get('/role/', verifyToken, RoleController.index)

router.post('/role/', [
    check('name').not().isEmpty(),
    // check('permissions').not().isEmpty(),
], verifyToken, RoleController.create);

router.put('/role/:id/update', [
    check('name').not().isEmpty(),
    // check('permissions').not().isEmpty(),
], verifyToken, RoleController.update);

router.delete('/:id/deleterole', verifyToken, RoleController.delete);

router.get('/:id/role', verifyToken, RoleController.show)

module.exports = router;