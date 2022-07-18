const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
  name: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  editors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

deckSchema.methods.canBeEditedBy = function (user) {
  return (
    user.toString() === this.owner.toString() ||
    this.editors.includes(user)
  );
}

deckSchema.methods.canBeStudiedBy = function (user) {
  return (
    user.toString() === this.owner.toString() ||
    this.editors.includes(user) ||
    this.students.includes(user)
  );
}

module.exports = mongoose.model('Deck', deckSchema);
