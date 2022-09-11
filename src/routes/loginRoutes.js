const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controller/userControllers');

const loginRoutes = express.Router();

loginRoutes.post('/signin', celebrate({
  // валидируем параметры
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

loginRoutes.post('/signup', celebrate({
  // валидируем параметры
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

module.exports = {
  loginRoutes,
};
