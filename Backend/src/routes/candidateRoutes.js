const express = require('express');
const router = express.Router();
const {
    addCandidate,
    updateCandidate,
    deleteCandidate,
    getCandidates
} = require('../controllers/candidateController');
const {authenticateToken} = require('../middlewares/authMiddleware');

// Add a candidate to an election
router.post('/:electionId', authenticateToken, addCandidate);

// Get all candidates for an election
router.get('/', authenticateToken, getCandidates);

// Update a candidate in an election
router.put('/:electionId', authenticateToken, updateCandidate);

// Delete a candidate from an election
router.delete('/:candidateId', authenticateToken, deleteCandidate);

module.exports = router;
