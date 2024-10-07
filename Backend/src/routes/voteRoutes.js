const express = require("express");
const router = express.Router();
const { castVote } = require("../controllers/voteController");
const { tallyVotes } = require("../controllers/resultController");
const { getVotingHistory } = require("../controllers/voteController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { adminAuth } = require("../middlewares/adminMiddleware"); // Middleware to check if the user is an admin

// @route   POST api/votes/cast
// @desc    Cast a vote
// @access  Private
router.post("/cast", authenticateToken, castVote);

// @route   GET api/votes/:id/tally
// @desc    Tally votes for a specific vote (Admin only)
// @access  Private (Admin)
//refers to the process of calculating and summarizing the votes cast for each candidate in a particular voting instance.
router.get("/elections/:electionId/tally", authenticateToken, tallyVotes);

router.get("/getVotingHistory", authenticateToken, getVotingHistory);

module.exports = router;
