//transactionService
const { Wallet, providers } = require('ethers');

const provider = new providers.JsonRpcProvider('http://localhost:8545'); // Example for local Ethereum network

const sendTransaction = async (senderPrivateKey, recipientAddress, amount) => {
  const senderWallet = new Wallet(senderPrivateKey, provider);
  
  const tx = {
    to: recipientAddress,
    value: ethers.utils.parseEther(amount), // Convert amount to wei
  };

  const transactionResponse = await senderWallet.sendTransaction(tx);
  await transactionResponse.wait(); // Wait for transaction to be mined

  return transactionResponse;
};
