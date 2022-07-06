const express = require('express');

const {
  getCard,
  createCard,
  updateCard,
  deleteCard,
} = require('../controllers/cardController');

const router = express.Router();

router.route('/')
  .get(getCard)
  .post(createCard);

router.route(':id')
  .put(updateCard)
  .delete(deleteCard);

module.exports = router;
