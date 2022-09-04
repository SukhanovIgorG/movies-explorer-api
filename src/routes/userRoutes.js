const express = require('express');
const { celebrate, Joi } = require('celebrate');

const userRoutes = express.Router();
const userControllers = require('../controller/userControllers');

userRoutes.get('/me', userControllers.getUserInfo);

userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
  }),
}), userControllers.updateUserInfo);

module.exports = {
  userRoutes,
};
