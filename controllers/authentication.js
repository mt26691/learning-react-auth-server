const User = require("../models/user");
const jwt = require("jwt-simple");
const config = require("../config");

function tokenForUser(user) {
    //jwt: is standard
    //sub => subject who is this token belong to (specific user)
    //iat => issue at time

    const timeStamp = new Date().getTime();
    return jwt.encode({
        sub: user.id,
        iat: timeStamp
    }, config.secret);
}
exports.signin = function (req, res, next) {
    //user has already had theri email and password auth'does
    //we just need to give them a token
    res.send({token:tokenForUser(req.user)})
}
exports.signup = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).send({ error: "You must provide email and password" });
    }

    //see if a user with the given email exists
    User.findOne({ email: email }, function (err, existingUser) {
        if (err) {
            return next(err);
        }

        // if a user with email does exists, return an error
        if (existingUser) {
            //unprocessnable entities
            return res.status(422).send({ error: "Email is in use" });
        }

        //if a user with email does not exist, create and save user record
        const user = new User({
            email: email,
            password: password
        });

        user.save(function (err) {
            if (err) {
                return next(err);
            }

            //repond to request indicating the user was created.
            res.json({ token: tokenForUser(user) });
        });


    });


}