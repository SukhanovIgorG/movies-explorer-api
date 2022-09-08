const express = require('express');
const { celebrate, Joi } = require('celebrate');

const userRoutes = express.Router();
const userControllers = require('../controller/userControllers');

userRoutes.get('/users/me', userControllers.getUserInfo);

userRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), userControllers.updateUserInfo);

module.exports = {
  userRoutes,
};
