const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const {
  getDecks,
  getDeck,
  createDeck,
  getDeckCards,
  getStudyCards,
  createCard,
  renameDeck,
  setUserPermission,
  deleteDeck,
} = require('../controllers/deckController');

// /api/decks
const router = express.Router();

router.route('/')
  .get(protect, getDecks)
  .post(protect, createDeck);

router.route('/:id')
  .get(protect, getDeck)
  .post(protect, createCard)
  .put(protect, renameDeck)
  .delete(protect, deleteDeck);

router.route('/:id/cards')
  .get(protect, getDeckCards)

router.route('/:id/permissions')
  .post(protect, setUserPermission);

router.route('/study/:ids')

module.exports = router;
