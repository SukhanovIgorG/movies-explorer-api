const { Movie } = require('../../models/movieModels');
const NotFoundError = require('../../errors/not-found-error');
const CastError = require('../../errors/cast-error');
const RulesError = require('../../errors/rules-error');

const {
  castErrorMessage, notFoundErrorMessage, rulesErrorMessage, cardDeleteMessage,
} = require('../../utils/constants');

exports.getMovies = async (req, res, next) => {
  await Movie.find({})
    .then((movie) => res.send({ movie }))
    .catch(next);
};

exports.deleteMovieById = async (req, res, next) => {
  await Movie.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError(notFoundErrorMessage);
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new RulesError(rulesErrorMessage));
      }
      return movie
        .remove()
        .then(() => res.send({ message: cardDeleteMessage }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        // next(new CastError(castErrorMessage));
        next(new CastError(err));
      } else {
        next(err);
      }
    });
};

exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    owner,
    movieId, // ??
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new CastError(castErrorMessage));
      } else {
        next(err);
      }
    });
};

// .then((movie) => {
//   if (!movie.owner.equals(req.user._id)) {
//     return next(new RulesError(rulesErrorMessage));
//   }
//   return movie
//     .remove()
//     .then(() => res.send({ message: cardDeleteMessage }));
// })
