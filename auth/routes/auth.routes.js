const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const { check } = require('express-validator');
const { verifyToken } = require('../../middleware/AuthMiddleware');

router.post('/login', [
    check('email').not().isEmpty(),
    check('password').not().isEmpty(),
], AuthController.login);

router.post('/register', [
    check('name').not().isEmpty(),
    check('email').not().isEmpty(),
    check('password').not().isEmpty(),
], AuthController.register);

router.get('/me', verifyToken, AuthController.me);

module.exports = router;