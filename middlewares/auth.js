require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');

const { JWT_SECRET, NODE_ENV } = process.env;

const extractBearerToken = (header) => header.replace('Bearer ', ''); // для варианта с токеном в ответе/запросе

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('нужна авторизация');
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret-key',
    );
  } catch (err) {
    next(new AuthError('нужна авторизация'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
