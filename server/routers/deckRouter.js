const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const {
  getDecks,
  createDeck,
  getDeckCards,
  createCard,
  renameDeck,
  setUserPermission,
  deleteDeck,
} = require('../controllers/deckController');

const router = express.Router();

router.route('/')
  .get(protect, getDecks)
  .post(protect, createDeck);

router.route('/:id')
  .get(protect, getDeckCards)
  .post(protect, createCard)
  .put(protect, renameDeck)
  .delete(protect, deleteDeck);

router.route('/:id/permissions')
  .post(protect, setUserPermission);

module.exports = router;
