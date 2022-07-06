const express = require('express');

const {
  getDecks,
  createDeck,
  getDeck,
  updateDeck,
  deleteDeck,
} = require('../controllers/deckController');

const router = express.Router();

router.route('/')
  .get(getDecks)
  .post(createDeck);

router.route('/:id')
  .get(getDeck)
  .put(updateDeck)
  .delete(deleteDeck);

module.exports = router;
