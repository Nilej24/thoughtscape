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

// get a deck for the user to edit
// GET /api/decks/:id
// deck editor page
const getDeck = asyncHandler(async (req, res) => {
  const deck = await Deck.findById(req.params.id);

  // check deck exists
  if (!deck) {
    res.status(400);
    throw new Error('deck not found');
  }

  // check user can edit deck
  if (!deck.canBeEditedBy(req.user._id)) {
    res.status(401);
    throw new Error('user not authorized to edit deck');
  }

  // return deck
  res.json(deck);
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

// get array of cards in a deck
// GET /api/decks/:id/cards
// deck editor page
const getDeckCards = asyncHandler(async (req, res) => {
  const deck = await Deck.findById(req.params.id);

  // check deck exists
  if (!deck) {
    res.status(400);
    throw new Error('deck not found');
  }

  // check user can study deck
  if (!deck.canBeStudiedBy(req.user._id)) {
    res.status(401);
    throw new Error('user not authorized to study deck');
  }

  // return array of cards
  const cards = await Card.find({ deck: req.params.id });
  res.json(cards);
});

// get all cards from all decks in the list
// GET /api/decks/study/:ids
// study page
const getStudyCards = asyncHandler(async (req, res) => {
  let cards = [];

  // get array of deck ids
  const deckIds = req.params.ids.split(',');

  // loop to add each deck's cards to the array
  // for/of loop instead of forEach method because 'await' needs to work within the loop
  for (const deckId of deckIds) {
    const deck = await Deck.findById(deckId);

    // check deck exists
    if (!deck) {
      res.status(400);
      throw new Error('one of the decks does not exist');
    }

    // check user can study deck
    if (!deck.canBeStudiedBy(req.user._id)) {
      res.status(401);
      throw new Error('user is not authorized to study one of the decks');
    }

    // add cards to array
    const deckCards = await Card.find({ deck: deckId });
    cards = [...cards, ...deckCards];
  };

  res.json(cards);
});

// create card in current deck
// POST /api/decks/:id
// deck page
const createCard = asyncHandler(async (req, res) => {
  const { front, back } = req.body;

  const deck = await Deck.findById(req.params.id);
  
  // checks deck exists
  if (!deck) {
    res.status(400);
    throw new Error('deck not found');
  }

  // checks user permissions
  if (!deck.canBeEditedBy(req.user._id)) {
    res.status(401);
    throw new Error('user not authorized to add cards to deck');
  }

  const card = new Card({
    front,
    back,
    deck: req.params.id,
    easy: [],
    medium: [],
    hard: [],
  });

  await card.save();

  res.json(card)
});

// update a deck's name
// PUT /api/decks/:id
// deck page
const renameDeck = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const deck = await Deck.findById(req.params.id);

  if (!deck) {
    res.status(400);
    throw new Error('deck not found');
  }

  // checks user is authorized
  if (!deck.canBeEditedBy(req.user._id)) {
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
    default:
      res.status(400);
      throw new Error('invalid permission string given');
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

  const cards = await Card.find({ deck: deck._id });
  if (!cards) {
    res.status(500);
    throw new Error("could not delete this deck's cards");
  }

  // delete all cards inside deck
  for (const card of cards) {
    await card.remove();
  }

  // delete the deck itself
  await deck.remove();
  res.json(deck);
});

module.exports = {
  getDecks,
  getDeck,
  createDeck,
  getDeckCards,
  getStudyCards,
  createCard,
  renameDeck,
  setUserPermission,
  deleteDeck,
};
