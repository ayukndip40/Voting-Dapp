// candidateModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
  _id: { 
    type: String, 
    required: true 
  },
  name: {
    type: String,
    required: true
  },
  party: {
    type: String,
    required: false
  },
  electionId: {
    type: String,
    ref: 'Election',
    required: true
  },
  blockchainId: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Candidate', candidateSchema);
