const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const {
  updateCard,
  setCardRating,
  deleteCard,
} = require('../controllers/cardController');

// /api/cards
const router = express.Router();

router.route('/:id')
  .put(protect, updateCard)
  .delete(protect, deleteCard);

router.route('/:id/rating')
  .post(protect, setCardRating);

module.exports = router;
