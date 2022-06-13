const passport = require('passport');
const jwt = require('jsonwebtoken');
// Passport Middleware.
const userAuth = passport.authenticate('jwt', { session: false });

module.exports = userAuth;
