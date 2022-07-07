const asyncHandler = require('express-async-handler');

const Deck = require('../models/deckModel');

// get the user's decks
// GET /api/decks
const getDecks = asyncHandler(async (req, res) => {
});

module.exports = {
  getDecks,
};
