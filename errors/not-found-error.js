const { notFoundErrorCode } = require('../utils/constants');

module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.errorMessage = message;
    this.statusCode = notFoundErrorCode;
  }
};
