require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { limiter } = require('./utils/limiter');
const auth = require('./middlewares/auth');
const { routes } = require('./src/routes');
const errorController = require('./middlewares/errorController');
const NotFoundError = require('./errors/not-found-error');
const { login, createUser } = require('./src/controller/userControllers');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(cors());
app.use(helmet());
app.use(requestLogger); // логгер запросов
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  // валидируем параметры
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  // валидируем параметры
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth, routes);

app.use(auth, () => {
  throw new NotFoundError('это неизвестный путь');
});

app.use(errorLogger); // подключаем логгер запросов

app.use(errors()); // обработчик ошибок celebrate

app.use(errorController);

module.exports = app;
