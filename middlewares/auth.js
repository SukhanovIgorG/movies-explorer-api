require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');
const { jwtDev, authErrorMessage } = require('../utils/constants');

const { JWT_PROD, NODE_ENV } = process.env;

const extractBearerToken = (header) => header.replace('Bearer ', ''); // для варианта с токеном в ответе/запросе

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError(authErrorMessage);
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_PROD : jwtDev,
    );
  } catch (err) {
    next(new AuthError(authErrorMessage));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
