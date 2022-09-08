const mongoose = require('mongoose');
const validator = require('validator');

const movieShema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (link) => validator.isURL(link),
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (link) => validator.isURL(link),
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (link) => validator.isURL(link),
      },
    },
    owner: {
      type: mongoose.ObjectId,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
    movieId: {
      type: Number,
      id: true,
      index: true,
      required: true,
    },
  },
  { versionKey: false },
);

exports.Movie = mongoose.model('movie', movieShema);
