const { Movie } = require('../../models/movieModels');
const NotFoundError = require('../../errors/not-found-error');
const CastError = require('../../errors/cast-error');
const RulesError = require('../../errors/rules-error');

exports.getMovies = async (req, res, next) => {
  await Movie.find({})
    .then((movie) => res.send({ movie }))
    .catch(next);
};

exports.deleteMovieById = async (req, res, next) => {
  await Movie.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new RulesError('недостаточно прав'));
      }
      return movie
        .remove()
        .then(() => res.send({ message: 'карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new CastError('переданы некорректные данные'));
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
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new CastError(`переданы некорректные данные: + ${err.message}`));
      } else {
        next(err);
      }
    });
};
