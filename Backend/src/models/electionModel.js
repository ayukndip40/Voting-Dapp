const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const electionSchema = new Schema({
  numericId: {
    type: Number,
    unique: true, // Ensure that the numeric ID is unique
    required: true // Make sure this ID is always present
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidates: [{
    type: Schema.Types.ObjectId,
    ref: 'Candidate'
  }],
  blockchainTransactionHash: {
    type: String,
    required: false
  },
  votes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vote' 
  }],
  results: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  }
});

// Automatically generate the numeric ID before saving if not provided
electionSchema.pre('save', async function(next) {
  if (!this.numericId) {
    const lastElection = await this.constructor.findOne().sort('-numericId');
    this.numericId = lastElection ? lastElection.numericId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Election', electionSchema);
