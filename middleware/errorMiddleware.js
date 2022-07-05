function errorHandler(err, req, res, next) {
  // status code 500 if not already set
  res.status(res.statusCode || 500);

  // send error as json with its stack
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = { errorHandler };
