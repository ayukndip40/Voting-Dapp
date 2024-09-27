const { ethers } = require("ethers");
const contractABI = require("../contracts/build/contracts/Voting.json").abi;

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
    const electionContract = new ethers.Contract(
      contractAddress,
      contractABI,
      adminWallet
    );
    console.log("Contract instance initialized.");

    // Ensure the castVote function is defined
    if (typeof electionContract.castVote !== "function") {
      console.error(
        "castVote function is not defined in the contract instance."
      );
      return res.status(500).json({ error: "Contract function not found." });
    }

    // Fetch current gas price with retries
    const fetchGasPrice = async (retries = 3) => {
      try {
        const feeData = await provider.getFeeData();
        return feeData.gasPrice;
      } catch (error) {
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

    // Set a default gas limit
    const defaultGasLimit = ethers.parseUnits("300000", "wei"); // Adjust this value as needed
    console.log(`Default Gas Limit: ${defaultGasLimit.toString()}`);

    console.log("Preparing to cast vote...");
    console.log(`electionId: ${electionId}, candidateId: ${candidateId}`);
    console.log(`Admin wallet address: ${adminWallet.address}`);

    // Prepare transaction data
    const txData = await electionContract.castVote.populateTransaction(
      electionId,
      candidateId
    );
    console.log("Transaction data:", txData);

    // Manually create the transaction object
    const transaction = {
      to: contractAddress,
      data: txData.data,
      gasLimit: defaultGasLimit,
      gasPrice: gasPrice,
    };

    console.log("Transaction object:", transaction);

    // Sign and send the transaction
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

module.exports = { castVote };
