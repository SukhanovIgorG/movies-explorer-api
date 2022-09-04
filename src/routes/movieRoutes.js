/* eslint-disable import/extensions */
const express = require('express');
const { celebrate, Joi } = require('celebrate');

const movieRoutes = express.Router();
const movieControllers = require('../controller/movieControllers.js');

const { patternUrl } = require('../../utils/constants');

movieRoutes.get('/', movieControllers.getMovies);

movieRoutes.post('/', celebrate({
  // валидируем параметры
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(patternUrl),
    trailerLink: Joi.string().required().regex(patternUrl),
    thumbnail: Joi.string().required().regex(patternUrl),
    movieId: Joi.string().alphanum().length(24),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), movieControllers.createMovie);

movieRoutes.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), movieControllers.deleteMovieById);

module.exports = {
  movieRoutes,
};
