import { ethers } from "ethers";

// Central wallet details
const centralWalletAddress = process.env.CENTRAL_WALLET_ADDRESS;
const centralWalletPrivateKey = process.env.CENTRAL_WALLET_PRIVATE_KEY;

// Function to create a new wallet and fund it from the central wallet
const createWallet = async () => {
  try {
    console.log("Starting the wallet creation process...");

    // Connect to the blockchain provider
    console.log("Connecting to blockchain provider...");
    const provider = new ethers.JsonRpcProvider(
      process.env.BLOCKCHAIN_PROVIDER
    );
    console.log(`Provider connected to: ${process.env.BLOCKCHAIN_PROVIDER}`);

    // Create a new wallet
    console.log("Creating a new wallet...");
    const newWallet = ethers.Wallet.createRandom();
    console.log(`New wallet created with address: ${newWallet.address}`);
    console.log(`New wallet private key: ${newWallet.privateKey}`);

    // Connect the central wallet
    console.log("Connecting to the central wallet...");
    const centralWallet = new ethers.Wallet(centralWalletPrivateKey, provider);
    console.log(`Central wallet address: ${centralWallet.address}`);

    // Check central wallet balance
    console.log("Fetching central wallet balance...");
    const centralWalletBalance = await provider.getBalance(
      centralWallet.address
    );
    console.log(
      `Central wallet balance: ${ethers.formatEther(centralWalletBalance)} ETH`
    );

    // Verify if the central wallet has enough balance
    console.log("Verifying if the central wallet has enough balance...");
    const amountToSend = ethers.parseEther("1.0"); // Amount in ETH
    console.log(`Amount to send: ${ethers.formatEther(amountToSend)} ETH`);

    if (centralWalletBalance < amountToSend) {
      console.error("Insufficient balance in the central wallet");
      throw new Error("Insufficient balance in the central wallet");
    }

    // Create a transaction to fund the new wallet
    console.log(
      `Creating transaction to send ${ethers.formatEther(
        amountToSend
      )} ETH to new wallet...`
    );
    const tx = {
      to: newWallet.address,
      value: amountToSend,
    };

    // Send the transaction from the central wallet
    console.log("Sending the transaction...");
    const txResponse = await centralWallet.sendTransaction(tx);
    console.log(`Funding transaction hash: ${txResponse.hash}`);

    // Wait for the transaction to be confirmed
    console.log("Waiting for the transaction to be confirmed...");
    await txResponse.wait();
    console.log("Funding transaction confirmed");

    // Return the new wallet details
    console.log("Returning the new wallet details...");
    return {
      address: newWallet.address,
      privateKey: newWallet.privateKey,
      balance: ethers.formatEther(amountToSend), // New balance after funding
    };
  } catch (error) {
    console.error("Error during wallet creation and funding:", error.message);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export { createWallet };
