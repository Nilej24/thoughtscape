const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const {
  updateCard,
  deleteCard,
} = require('../controllers/cardController');

const router = express.Router();

router.route('/:id')
  .put(protect, updateCard)
  .delete(protect, deleteCard);

module.exports = router;
