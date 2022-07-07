const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  front: String,
  back: String,
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
  },
});

module.exports = mongoose.model('Card', cardSchema);
