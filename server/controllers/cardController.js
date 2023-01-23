const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');
const Deck = require('../models/deckModel');
const Card = require('../models/cardModel');

// update a card
// PUT /api/cards/:id
// deck page OR study page -> edit card modal
const updateCard = asyncHandler(async (req, res) => {
  const { front, back, newDeckId } = req.body;

  // get card
  const card = await Card.findById(req.params.id);
  if (!card) {
    res.status(400);
    throw new Error('card not found');
  }

  // check user has permissions to edit
  const deck1 = await Deck.findById(card.deck);
  if (!deck1.canBeEditedBy(req.user._id)) {
    res.status(401);
    throw new Error('user not authorized to edit cards in this deck');
  }
  if (newDeckId) {
    const deck2 = await Deck.findById(newDeckId);
    if (!deck2.canBeEditedBy(req.user._id)) {
      res.status(401);
      throw new Error('user not authorized to move cards into that deck');
    }
  }

  // update other stuff
  if (front) card.front = front;
  if (back) card.back = back;
  if (newDeckId) card.deck = newDeckId;
  await card.save();

  // return for redux
  res.json(card);
});

// set a card's rating
// POST /api/cards/:id/rating
const setCardRating = asyncHandler(async (req, res) => {
  const { newRating } = req.body;

  // get card
  const card = await Card.findById(req.params.id);
  if (!card) {
    res.status(400);
    throw new Error('card not found');
  }

  // check user has permission to study
  const deck = await Deck.findById(card.deck);
  if (!deck.canBeStudiedBy(req.user._id)) {
    res.status(401);
    throw new Error('user not authorized to study cards in this deck');
  }

  // reset rating for current user
  card.easy = card.easy.filter(userId => userId.toString() !== req.user._id.toString());
  card.medium = card.medium.filter(userId => userId.toString() !== req.user._id.toString());
  card.hard = card.hard.filter(userId => userId.toString() !== req.user._id.toString());

  // set new rating
  switch (newRating) {
    case 1:
      card.hard.push(req.user._id);
      break;
    case 2:
      card.medium.push(req.user._id);
      break;
    case 3:
      card.easy.push(req.user._id);
      break;
  }

  await card.save();
  res.json(card);
});

// delete a card
// DELETE /api/cards/:id
// deck page
const deleteCard = asyncHandler(async (req, res) => {
  const card = await Card.findById(req.params.id);

  // check card exists
  if (!card) {
    res.status(400);
    throw new Error('card not found');
  }

  // check user has permission to delete
  const deck = await Deck.findById(card.deck);
  if (!deck.canBeEditedBy(req.user._id)) {
    res.status(401);
    throw new Error('user not authorized to delete cards in deck');
  }

  // delete card
  await card.remove();
  res.json(card);
});

module.exports = {
  updateCard,
  setCardRating,
  deleteCard
};
