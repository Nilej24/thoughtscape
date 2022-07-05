const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// asyncHandler for exception handling in async functions
const asyncHandler = require('express-async-handler');

const userModel = require('../models/userModel');

// generates a jwt for client authorization
function generateToken(id) {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// register a user
// POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  // get details from req body
  const { name, email, password } = req.body;

  // check if email is already used
  const userExists = await userModel.findOne({ email });
  if (!!userExists) {
    res.status(400);
    throw new Error('email is already in use');
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // create + save new user
  const newUser = new userModel({
    name,
    email,
    password: hash,
  });
  await newUser.save();

  // give user to client for redux stuff
  if (!!newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error('invalid user data');
  }
});

// login a user
// POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  // details from form
  const { email, password } = req.body;
  
  // get user and check it exists
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('user does not exist');
  }

  // compare passwords
  // send user for redux stuff if success
  const matches = await bcrypt.compare(password, user.password);
  if (matches) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('password is incorrect');
  }
});

module.exports = { registerUser, loginUser };
