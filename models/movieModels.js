const mongoose = require('mongoose');
const { patternUrl } = require('../utils/constants');

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
        validator(v) {
          return patternUrl.test(v); // ВОЗМОЖНЫ ПРОБЛЕМЫ, ПРОВЕРИТЬ
        },
        message: (props) => `${props.value} is not a valid url!`,
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return patternUrl.test(v);
        },
        message: (props) => `${props.value} is not a valid url!`,
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return patternUrl.test(v);
        },
        message: (props) => `${props.value} is not a valid url!`,
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
  },
  { versionKey: false },
);

exports.Movie = mongoose.model('movie', movieShema);
