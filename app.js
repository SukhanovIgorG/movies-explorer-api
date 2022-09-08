require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { limiter } = require('./utils/limiter');
const auth = require('./middlewares/auth');
const errorController = require('./middlewares/errorController');
const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { loginRoutes } = require('./src/routes/loginRoutes');
const { userRoutes } = require('./src/routes/userRoutes');
const { movieRoutes } = require('./src/routes/movieRoutes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(requestLogger); // логгер запросов
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(loginRoutes);

app.use(auth);

app.use(userRoutes);
app.use(movieRoutes);

app.use(() => {
  throw new NotFoundError('это неизвестный путь');
});

app.use(errorLogger); // подключаем логгер запросов

app.use(errors()); // обработчик ошибок celebrate

app.use(errorController);

module.exports = app;
