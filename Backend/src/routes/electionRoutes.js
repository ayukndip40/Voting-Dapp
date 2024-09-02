const express = require('express');
const router = express.Router();
const {createElection,
  getElections,
  getElectionById,
  updateElection,
  deleteElection,
  closeElection,} = require('../controllers/electionController');
const {authenticateToken} = require('../middlewares/authMiddleware');
const {adminAuth} = require('../middlewares/adminMiddleware');

// @route   POST api/elections
// @desc    Create a new election
// @access  Private/Admin

router.post('/createElection', [authenticateToken, adminAuth], createElection);
// @route   GET api/elections
// @desc    Get all elections
// @access  Private
router.get('/getElections', authenticateToken, getElections);

// @route   GET api/elections/:id
// @desc    Get election by ID
// @access  Private
router.get('/:id', authenticateToken, getElectionById);

// @route   PUT api/elections/:id
// @desc    Update election by ID
// @access  Private/Admin
router.put('/:id',[authenticateToken,adminAuth,],updateElection);

// @route   DELETE api/elections/:id
// @desc    Delete election by ID
// @access  Private/Admin
router.delete('/:id', [authenticateToken, adminAuth], deleteElection);

router.post('/:id', [authenticateToken, adminAuth], closeElection);

module.exports = router;
