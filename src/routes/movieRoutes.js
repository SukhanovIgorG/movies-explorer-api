const express = require('express');
const { celebrate, Joi } = require('celebrate');

const movieRoutes = express.Router();
const { getMovies, createMovie, deleteMovieById } = require('../controller/movieControllers');

const { patternUrl } = require('../../utils/constants');

movieRoutes.get('/movies/', getMovies);

movieRoutes.post('/movies/', celebrate({
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
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

movieRoutes.delete('/movies/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), deleteMovieById);

module.exports = {
  movieRoutes,
};
