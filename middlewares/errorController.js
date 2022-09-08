const { serverErrorCode, serverErrorMessage } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  const { statusCode = serverErrorCode, message } = err;
  res.status(statusCode).send({
    message: statusCode === serverErrorCode ? serverErrorMessage : message,
  });
  next();
};
