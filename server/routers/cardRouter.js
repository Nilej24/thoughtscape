const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const {
  createCard,
  updateCard,
  deleteCard,
} = require('../controllers/cardController');

const router = express.Router();

router.route('/')
  .post(protect, createCard);

router.route(':id')
  .put(protect, updateCard)
  .delete(protect, deleteCard);

module.exports = router;
