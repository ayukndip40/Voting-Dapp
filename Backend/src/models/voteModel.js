// voteModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema({
  electionId: {
    type: Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blockchainTransactionHash: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Vote', voteSchema);
