const jwt = require("jsonwebtoken");

const Authentication = module.exports;

Authentication.signToken = function(payload, response, next) {

    const jwtSecret = process.env.JWT_SECRET;

    jwt.sign(
        JSON.parse(JSON.stringify(payload)),
        jwtSecret,
        { expiresIn: '10d' },
        (async function (err, token) {
            if (err) {
                return response.status(400).json({
                    error: true,
                    message: 'Something went wrong, please try again later',
                    data: err,
                });
            }

            const user = payload;
            user.password = null;

            return response.status(200).json({
                error: false,
                message: 'You have been logged in successfully',
                data:  {
                    user: user,
                    serviceToken : token,
                },
            });
        })
    );
}