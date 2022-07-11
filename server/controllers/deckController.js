const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');
const Deck = require('../models/deckModel');
const Card = require('../models/cardModel');

// get an array of the user's decks
// GET /api/decks
// 'your decks' page
const getDecks = asyncHandler(async (req, res) => {
  const decks = await Deck.find({
    $or: [
      { owner: req.user._id },
      { editors: req.user._id },
      { students: req.user._id },
    ],
  });

  res.json(decks);
});

// create a deck for the user
// POST /api/decks
// 'your decks' page
const createDeck = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('please enter a name');
  }

  const deck = new Deck({
    name,
    owner: req.user._id,
    editors: [],
    students: [],
  });

  await deck.save();

  res.json(deck);
});

// update a deck's name
// PUT /api/decks/:id
// deck page
const renameDeck = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const deck = await Deck.findById(req.params.id);

  // checks user is authorized
  if (
    (req.user._id.toString() !== deck.owner.toString()) &&
    (!deck.editors.includes(req.user._id))
  ) {
    res.status(401);
    throw new Error('user not authorized to rename deck');
  }

  // check name is provided
  if (!name) {
    res.status(400);
    throw new Error('please enter a name');
  }

  // actual name change
  deck.name = name;
  await deck.save();
  res.json(deck);
});

// set permissions for a user on a deck
// POST /api/decks/:id/permissions
// 'your decks' page -> set permissions modal
const setUserPermission = asyncHandler(async (req, res) => {
  const { userEmail, permission } = req.body;

  const deck = await Deck.findById(req.params.id);

  if (!deck) {
    res.status(400);
    throw new Error('deck not found');
  }

  if (req.user._id.toString() !== deck.owner.toString()) {
    res.status(401);
    throw new Error('only the owner can change permissions');
  }

  const user = await User.findOne({ email: userEmail });

  if (!user) {
    res.status(400);
    throw new Error('a user with that email does not exist');
  }

  // reset user's permissions
  deck.editors = deck.editors.filter(editor => {
    return !!editor && user._id.toString() !== editor.toString();
  });
  deck.students = deck.students.filter(student => {
    return !!student && user._id.toString() !== student.toString();
  });

  // set new permissions
  switch (permission) {
    case 'owner':
      deck.owner = user._id;
      break;
    case 'editor':
      deck.editors.push(user._id);
      break;
    case 'student':
      deck.students.push(user._id);
      break;
    case 'none':
      break;
  }

  // update deck
  await deck.save();

  res.json(deck);
});

// delete a deck
// DELETE /api/decks/:id
// 'your decks' page -> confirm delete modal
const deleteDeck = asyncHandler(async (req, res) => {
  const deck = await Deck.findById(req.params.id);

  if (!deck) {
    res.status(400);
    throw new Error('deck not found');
  }

  if (req.user._id.toString() !== deck.owner.toString()) {
    res.status(401);
    throw new Error('only the owner can delete this deck');
  }

  await deck.remove();
  res.json(deck);
});

module.exports = {
  getDecks,
  createDeck,
  renameDeck,
  setUserPermission,
  deleteDeck,
};
