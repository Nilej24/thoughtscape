const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const {
  getDecks,
  createDeck,
  getDeckCards,
  updateDeck,
  deleteDeck,
} = require('../controllers/deckController');

const router = express.Router();

router.route('/')
  .get(protect, getDecks)
  .post(protect, createDeck);

router.route('/:id')
  .get(protect, getDeckCards)
  .put(protect, updateDeck)
  .delete(protect, deleteDeck);

module.exports = router;
