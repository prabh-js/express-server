const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat:timestamp }, config.secret);
}

exports.signin = async (req, res, next) => {
  res.send({ token: tokenForUser(req.user) })
}

exports.signup = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).send({ error: 'You must enter an email and password' });
    }

    try {
        const user = await User.findOne({ email: email });
     
        if (user) {
         return res.status(422).send({error: 'Email already in use'});
        }
     
        const newUser = new User({
          email,
          password
        });
     
        try {
          const savedUser = await newUser.save();
          res.send({ token: tokenForUser(savedUser) });
        }
        catch(err) {
          return next(err);
        }
     
      }
      catch(err) {
        return next(err);
      }
}