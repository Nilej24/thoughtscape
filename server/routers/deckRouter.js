const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const {
  getDecks,
  createDeck,
  renameDeck,
  setUserPermission,
  deleteDeck,
} = require('../controllers/deckController');

const router = express.Router();

router.route('/')
  .get(protect, getDecks)
  .post(protect, createDeck);

router.route('/:id')
  .put(protect, renameDeck)
  .delete(protect, deleteDeck);

router.route('/:id/permissions')
  .post(protect, setUserPermission);

module.exports = router;
