const { ethers } = require("ethers");
const contractABI = require("../contracts/build/contracts/Voting.json").abi;
const Election = require("../models/electionModel");
// Initialize election contract
async function initializeElectionContract() {
  console.log("Initializing ethers provider...");
  const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_PROVIDER);
  console.log("Provider initialized:", provider);

  const contractAddress = process.env.CONTRACT_ADDRESS;
  console.log("Contract address:", contractAddress);

  const signer = await provider.getSigner(0); // Get the first signer
  console.log("Signer initialized:", signer);

  const electionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  console.log("Election contract initialized:", electionContract);

  return electionContract;
}

// Tally votes function
const tallyVotes = async (req, res) => {
  console.log("Tallying votes...");
  const { electionId } = req.params;

  if (!electionId) {
    console.error("Election ID is missing");
    return res.status(400).json({ msg: "Election ID is missing" });
  }

  try {
    const electionContract = await initializeElectionContract();
    console.log("Election contract initialized:", electionContract);

    // Convert electionId to BigInt
    const formattedElectionId = BigInt(electionId);
    console.log(
      "Fetching details for electionId=",
      formattedElectionId.toString()
    );
    const electionDetails = await electionContract.getElection(
      formattedElectionId
    );
    console.log("Fetched Election Details:", electionDetails);

    // Check if electionDetails exists
    if (!electionDetails) {
      console.error("Election details are undefined");
      throw new Error("Election details are undefined");
    }

    // Logging start and end dates
    console.log("Election Start Date:", electionDetails.startDate);
    console.log("Election End Date:", electionDetails.endDate);

    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    console.log("Current time:", currentTime);

    // Check if the election has ended
    if (currentTime <= electionDetails.endDate || electionDetails.isActive) {
      console.log("Election is still active or voting has not ended yet");
      return res
        .status(400)
        .json({ msg: "Election is still active or voting has not ended yet" });
    }

    console.log("Fetching candidates for the election...");
    const candidates = await electionContract.tallyVotes(formattedElectionId);
    console.log("Fetched Candidates:", candidates);

    // Ensure results keys are strings
    const results = {};
    candidates.forEach((candidate) => {
      results[candidate.id.toString()] = {
        name: candidate.name,
        voteCount: candidate.voteCount.toString(),
      };
    });

    console.log("Results:", results);

    console.log("Saving results to database...");
    await Election.findOneAndUpdate(
      { electionId },
      { results },
      { new: true, upsert: true }
    );

    // Include startDate and endDate in the response
    res.json({
      election: {
        title: electionDetails.title,
        startDate: electionDetails.startDate.toString(),
        endDate: electionDetails.endDate.toString(),
      },
      results,
    });
  } catch (error) {
    console.error(`Error tallying votes: ${error.message}`);
    // Error handling
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

module.exports = {
  tallyVotes,
};
