const { authErrorCode } = require('../utils/constants');

module.exports = class AuthError extends Error {
  constructor(message) {
    super(message);
    this.errorMessage = message;
    this.statusCode = authErrorCode;
  }
};
