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
  const deck = await Deck.findById(card.deck);
  if (!deck.canBeEditedBy(req.user._id)) {
    res.status(401);
    throw new Error('user not authorized to edit cards in deck');
  }

  // update card
  card.front = front;
  card.back = back;
  card.deck = newDeckId;
  await card.save();

  // return for redux
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
  deleteCard
};
