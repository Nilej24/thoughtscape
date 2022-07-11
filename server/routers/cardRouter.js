const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const {
  getCardsFromDeck,
  createCardInDeck,
  updateCard,
  deleteCard,
} = require('../controllers/cardController');

const router = express.Router();

router.route('/')
  .get(protect, getCardsFromDeck)
  .post(protect, createCardInDeck);

router.route(':id')
  .put(protect, updateCard)
  .delete(protect, deleteCard);

module.exports = router;
