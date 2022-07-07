const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  if (
    // check we have a token, and that it's in the right type of header
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // get token from header
      const token = req.headers.authorization.split(' ')[1];
      
      // decode token so we can take the user id from it
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // pass on the current user as part of the request
      req.user = await User.findById(decodedToken.id).select('-password');
      next();

    } catch (err) {
      res.status(401);
      throw new Error('authorization failed');
    }
  } else {
    res.status(401);
    throw new Error('not authorized, no token');
  }
});

module.exports = { protect };
