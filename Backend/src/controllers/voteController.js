const { ethers } = require("ethers");
const contractABI = require("../contracts/build/contracts/Voting.json").abi;
const User = require("../models/userModel");
// Custom function to check if a string is a valid hexadecimal string
function isHexString(value) {
  return /^0x[0-9A-Fa-f]*$/.test(value);
}

const castVote = async (req, res) => {
  console.log("Casting vote...");

  try {
    // Extract and parse input data
    let { electionId, candidateId } = req.body;
    console.log(
      `Received raw vote data: electionId=${electionId}, candidateId=${candidateId}`
    );

    electionId = parseInt(electionId, 10);
    candidateId = parseInt(candidateId, 10);
    console.log(
      `Parsed vote data: electionId=${electionId}, candidateId=${candidateId}`
    );

    const userPrivateKey = req.user.wallet?.privateKey;
    console.log(
      `User private key retrieved: ${
        userPrivateKey ? "Available" : "Not Available"
      }`
    );

    // Validate input data
    console.log("Validating input data...");
    if (!Number.isInteger(electionId) || !Number.isInteger(candidateId)) {
      console.log("Invalid input data:", { electionId, candidateId });
      return res
        .status(400)
        .json({ error: "Invalid electionId or candidateId" });
    }
    console.log("Input data validation passed.");

    // Validate private key
    console.log("Validating private key...");
    if (
      !userPrivateKey ||
      !isHexString(userPrivateKey) ||
      userPrivateKey.length !== 66
    ) {
      console.log("Invalid private key:", userPrivateKey);
      return res.status(400).json({ error: "Invalid private key" });
    }
    console.log("Private key validation passed.");

    // Initialize provider and admin wallet
    console.log("Initializing provider and admin wallet...");
    const provider = new ethers.JsonRpcProvider(
      process.env.BLOCKCHAIN_PROVIDER
    );
    console.log("Provider initialized.");

    // Admin wallet setup (the wallet that will pay for the gas)
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY; // Store this securely
    console.log(`Admin private key found: ${!!adminPrivateKey}`);
    if (!adminPrivateKey) {
      throw new Error("Admin private key not found in environment variables");
    }
    const adminWallet = new ethers.Wallet(adminPrivateKey, provider);
    console.log(
      `Admin wallet instance created. Address: ${adminWallet.address}`
    );

    // Initialize contract instance using admin wallet
    console.log("Initializing contract instance...");
    const contractAddress = process.env.CONTRACT_ADDRESS;
    console.log(`Contract address: ${contractAddress}`);
    console.log(
      "ABI contains castVote:",
      contractABI.some(
        (item) => item.name === "castVote" && item.type === "function"
      )
    );
    const electionContract = new ethers.Contract(
      contractAddress,
      contractABI,
      adminWallet
    );
    console.log("Contract instance created:", electionContract);

    // Log available methods
    console.log(
      "Available methods:",
      Object.keys(electionContract).filter(
        (key) => typeof electionContract[key] === "function"
      )
    );

    console.log("Contract instance initialized.");

    // Ensure the castVote function is defined
    if (typeof electionContract.castVote !== "function") {
      console.error(
        "castVote function is not defined in the contract instance."
      );
      return res.status(500).json({ error: "Contract function not found." });
    }

    // Log the castVote function if it exists
    if (electionContract.castVote) {
      console.log("castVote function:", electionContract.castVote);
    }

    // Fetch current gas price with retries
    const fetchGasPrice = async (retries = 3) => {
      console.log(`Fetching gas price... Attempts left: ${retries}`);
      try {
        const feeData = await provider.getFeeData();
        console.log(
          "Gas price fetched successfully:",
          feeData.gasPrice.toString()
        );
        return feeData.gasPrice;
      } catch (error) {
        console.warn("Error fetching gas price:", error);
        if (retries > 0) {
          console.warn("Retrying to fetch gas price...");
          return fetchGasPrice(retries - 1);
        } else {
          throw new Error("Failed to fetch gas price after retries");
        }
      }
    };

    console.log("Fetching current gas price...");
    const gasPrice = await fetchGasPrice();
    console.log(
      `Current Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} gwei`
    );

    console.log("Fetching user ID from request...");
    const userId = req.user.id; // Assuming you have user ID in the request
    console.log(`User ID: ${userId}`);

    console.log("Fetching user from database...");
    const user = await User.findById(userId).exec(); // Adjust based on your user fetching method
    console.log("User fetched:", user);

    const userWalletAddress = user.wallet.address;

    // Set a default gas limit

    console.log("Preparing to cast vote...");
    console.log(`electionId: ${electionId}, candidateId: ${candidateId}`);
    console.log(`Admin wallet address: ${adminWallet.address}`);

    // Prepare transaction data
    console.log("Preparing transaction data...");
    const txData = await electionContract.castVote.populateTransaction(
      userWalletAddress,
      electionId,
      candidateId
    );
    console.log("Transaction data:", txData);

    // Manually create the transaction object
    const transaction = {
      to: contractAddress,
      data: txData.data,
      //gasLimit: gasLimit,
      gasPrice: gasPrice,
    };

    console.log("Transaction object:", transaction);

    // Sign and send the transaction
    console.log("Signing and sending the transaction...");
    const signedTx = await adminWallet.sendTransaction(transaction);
    console.log(`Transaction sent. Hash: ${signedTx.hash}`);

    // Wait for the transaction to be mined
    console.log("Waiting for transaction to be mined...");
    const receipt = await signedTx.wait();
    console.log("Transaction mined.");

    // Log the entire receipt
    console.log("Transaction receipt:", receipt);

    // Check transaction status
    if (receipt.status !== 1) {
      console.error("Transaction failed or reverted.");
      return res.status(500).json({ error: "Transaction failed or reverted" });
    }
    console.log("Transaction successful.");

    // Parse and log emitted events from the receipt
    console.log("Parsing emitted events...");
    let alreadyVoted = false; // Initialize flag for voter eligibility
    receipt.logs.forEach((log, index) => {
      try {
        const parsedLog = electionContract.interface.parseLog(log);
        console.log(`Event ${index + 1}:`, parsedLog);

        // Check for the VoterEligibilityChecked event
        if (parsedLog.name === "VoterEligibilityChecked") {
          alreadyVoted = parsedLog.args[2]; // Assuming args[2] indicates if the voter has already voted
          console.log(`Voter Eligibility Checked: ${alreadyVoted}`);
        }
      } catch (err) {
        console.log(`Log ${index + 1} is not related to the contract's ABI.`);
      }
    });

    // Prepare response based on voter eligibility
    if (alreadyVoted) {
      console.log("Voter has already voted.");
      return res
        .status(400)
        .json({ error: "You have already voted in this election." });
    }

    // Send success response if the voter hasn't already voted
    console.log("Sending success response to client.");
    res.json({
      message: "Vote cast successfully",
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    console.error("Error casting vote:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

const getVotingHistory = async (req, res) => {
  try {
    console.log("Fetching user ID from request...");
    const userId = req.user.id; // Assuming you have user ID in the request
    console.log(`User ID: ${userId}`);

    console.log("Fetching user from database...");
    const user = await User.findById(userId).exec(); // Adjust based on your user fetching method
    console.log("User fetched:", user);

    if (!user || !user.wallet?.address) {
      console.log("Unauthorized: No wallet address found.");
      return res
        .status(401)
        .json({ error: "Unauthorized: No wallet address found." });
    }

    const userWalletAddress = user.wallet.address; // Fetch the user's wallet address from the user object
    console.log(`User wallet address: ${userWalletAddress}`);

    // Initialize provider and contract
    console.log("Initializing provider...");
    const provider = new ethers.JsonRpcProvider(
      process.env.BLOCKCHAIN_PROVIDER
    );
    console.log("Provider initialized.");

    console.log("Initializing contract...");
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      contractABI,
      provider
    );
    console.log("Contract initialized.");

    // Call the getVotingHistory function from the smart contract using the user's wallet address
    console.log("Calling getVotingHistory from smart contract...");
    const votingHistory = await contract.getVotingHistory(
      req.user.wallet.address
    );
    console.log("Voting history fetched:", votingHistory);

    // Format the voting history
    console.log("Formatting voting history...");
    const formattedHistory = votingHistory.map((vote) => ({
      voterAddress: vote.voterAddress,
      electionId: vote.electionId.toString(),
      electionName: vote.electionName,
      electionDate: vote.electionDate.toString(), // Convert if necessary
      candidateId: vote.candidateId.toString(),
      candidateName: vote.candidateName, // Assuming this will be populated in the contract
      timestamp: vote.timestamp.toString(),
      confirmationStatus: vote.confirmationStatus,
      transactionHash: vote.transactionHash, // Adjust based on actual implementation
    }));
    console.log("Formatted voting history:", formattedHistory);

    // Return the voting history
    console.log("Returning voting history response...");
    res.json({ success: true, data: formattedHistory });
  } catch (error) {
    console.error("Error fetching voting history:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

module.exports = {
  castVote,
  getVotingHistory,
};
