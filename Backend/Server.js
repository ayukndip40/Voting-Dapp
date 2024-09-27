require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const { ethers } = require("ethers");
const moment = require("moment-timezone");
const connectDB = require("./src/config/db");
const Election = require("./src/models/electionModel");
const contractABI = require("./src/contracts/build/contracts/Voting.json").abi;

// Initialize express app
const app = express();

// Middleware setup
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust as needed for your frontend
  })
);
app.use(express.json()); // Body parser
app.use(cookieParser()); // Cookie parser

// Connect to the database
connectDB();

// Define Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/votes", require("./src/routes/voteRoutes"));
app.use("/api/elections", require("./src/routes/electionRoutes"));
app.use("/api/candidates", require("./src/routes/candidateRoutes"));

// Function to initialize the election contract
async function initializeElectionContract() {
  try {
    console.log("Initializing ethers provider...");
    const provider = new ethers.JsonRpcProvider(
      process.env.BLOCKCHAIN_PROVIDER
    );
    console.log("Provider initialized:", provider);

    const contractAddress = process.env.CONTRACT_ADDRESS;
    console.log("Contract address:", contractAddress);

    // Initialize wallet with provider to send transactions
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("Wallet initialized:", wallet.address);

    // Initialize contract with wallet (signer) to allow sending transactions
    const electionContract = new ethers.Contract(
      contractAddress,
      contractABI,
      wallet
    );
    console.log("Election contract initialized:", electionContract);

    return electionContract;
  } catch (error) {
    console.error("Error initializing election contract:", error.message);
    throw error;
  }
}

// Function to close expired elections
const closeExpiredElections = async () => {
  try {
    console.log("Starting process to close expired elections...");

    // Get the current date in UTC
    console.log("Fetching current date in UTC...");
    const currentUTCDate = moment.utc().unix(); // Use Unix timestamp for blockchain comparison
    console.log("Current date in UTC (Unix timestamp):", currentUTCDate);

    // Initialize election contract
    console.log("Initializing election contract...");
    const electionContract = await initializeElectionContract();
    console.log("Election contract initialized:", electionContract);

    // Get the total number of elections on the blockchain
    console.log("Fetching total number of elections from the blockchain...");
    const totalElections = await electionContract.getElectionCount(); // Assuming this function exists in your smart contract
    console.log(
      "Total elections on the blockchain:",
      totalElections.toString()
    );

    if (totalElections > 0) {
      for (let i = 0; i < totalElections; i++) {
        console.log(`Checking election with ID: ${i}...`);

        // Fetch election details from the blockchain
        const election = await electionContract.elections(i);
        console.log("Election details:", election);

        const { endDate, isActive } = election;
        console.log("Election end date (Unix):", endDate.toString());
        console.log("Election active status:", isActive);

        // Check if the election has expired and is still active
        if (isActive && currentUTCDate > endDate) {
          try {
            // Interact with the smart contract to close the election
            console.log(
              `Closing expired election with ID: ${i} on the blockchain...`
            );
            const tx = await electionContract.closeElection(i); // Assuming closeElection(id) is a function in your smart contract
            console.log(
              "Transaction sent. Waiting for confirmation...",
              tx.hash
            );
            await tx.wait();
            console.log(`Election ${i} closed successfully on the blockchain.`);

            // Optionally, update the election status in your database if needed
            // You can skip this if you don't need to store the status in the database
          } catch (blockchainError) {
            console.error(
              `Error closing election ${i} on blockchain:`,
              blockchainError
            );
          }
        } else {
          console.log(`Election ${i} has not expired or is already closed.`);
        }
      }
    } else {
      console.log("No elections found on the blockchain.");
    }
  } catch (error) {
    console.error("Error while closing expired elections:", error);
  }
};

// Schedule the task to run every minute based on Africa/Douala timezone
cron.schedule("* * * * *", closeExpiredElections, {
  timezone: "Africa/Douala",
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
