require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../../errors/not-found-error');
const CastError = require('../../errors/cast-error');
const MongoError = require('../../errors/mongo-error');
const AuthError = require('../../errors/auth-error');

const {
  mongoErrorMessage, castErrorMessage, notFoundErrorMessage, loginErrorMessage,
} = require('../../utils/constants');

const { User } = require('../../models/usersModels');

const { JWT_SECRET, NODE_ENV } = process.env;

exports.getUserInfo = async (req, res, next) => {
  await User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(notFoundErrorMessage);
    })
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};

exports.updateUserInfo = async (req, res, next) => {
  const owner = req.user._id;
  const { name, email } = req.body;
  await User.findByIdAndUpdate(
    owner,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CastError(castErrorMessage));
      }
      if (err.code === 11000) {
        return next(new MongoError(mongoErrorMessage));
      } return next(err);
    });
};

exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((userWithPass) => {
      const userWithOutPass = {
        _id: userWithPass._id,
        name: userWithPass.name,
        email: userWithPass.email,
      };
      return userWithOutPass;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new NotFoundError(notFoundErrorMessage));
      }
      if (err.code === 11000) {
        return next(new MongoError(mongoErrorMessage));
      }
      return next(err);
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(loginErrorMessage));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
          // хеши не совпали — отклоняем промис
            return Promise.reject(new Error(loginErrorMessage));
          }
          // аутентификация успешна
          return user;
        })
        .then((userAuth) => {
          const token = jwt.sign(
            { _id: userAuth._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret-key',
            { expiresIn: '1d' },
          );
          res
            .send({
              token,
            });
        });
    })
    .catch(() => {
      next(new AuthError(loginErrorMessage));
    });
};
