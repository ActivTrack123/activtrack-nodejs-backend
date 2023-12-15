const jwt = require("jsonwebtoken");
const User = require('../features/users/models/UserModel');
const { AccountStatus } = require("../config/constants");

const AuthMiddleware = module.exports;

AuthMiddleware.verifyToken = function(request, response, next) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) { 
        return response.status(401).json({
            error: true,
            message: "The security token missing from your request",
            data: {},
        });
    }

    const jwtSecret = process.env.JWT_SECRET;

    jwt.verify(token, jwtSecret, async function(err, user) {
        if (err) {
            return response.status(401).json({
                error: true,
                message: "The security token has been expired1",
                data: {},
            });
        }

        const checkUser = await User.findOne({ "email": user.email });

        if (!checkUser) {
            return response.status(401).json({
                error: true,
                message: "The security token has been expired",
                data: {},
            });
        }

        if (checkUser.accountStatus === AccountStatus.BLOCKED) {
            return response.status(401).json({
                error: true,
                message: "Account blocked!",
                data: {},
            });
        }

        request.user = user;
        next();
    })
}