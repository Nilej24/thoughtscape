const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  front: String,
  back: String,
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
  },
  hard: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  medium: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  easy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Card', cardSchema);
