const User = require('../models/users');
const { Strategy, ExtractJwt } = require('passport-jwt');
var passport = require('passport');
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'SECRET_KEY',
};

module.exports = (passport) => {
  passport.use(
    new Strategy(opts, async (payload, done) => {
      let uuid = payload.uuid;
      await User.findOne({ where: { uuid } })
        .then((user) => {
          if (user) {
            return done(null, user);
          }
        })
        .catch((err) => {
          return done(null, false);
        });
    }),
  );
};
