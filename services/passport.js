const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

//create local strategy
const localOptions = { usernameField: "email" };

const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false);
        }
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                return done(err);
            }

            if (!isMatch) {
                return done(null, false);
            }

            return done(null, user);
        })
        //compare password

    });
});

//set up options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: config.secret
};

//create jwt Strategy
//payload: decoded jwt token
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    //see if the user id in the payload exists in nour database
    //if it does, call done with that user
    //otherwise, call done without user object0

    User.findById(payload.sub, function (err, user) {
        if (err) {
            return done(err, false);
        }

        if (user) {
            done(null, user);
        }
        else {
            done(null, false);
        }

    });
});

//tells passport to use this Strategy

passport.use(jwtLogin);
passport.use(localLogin);