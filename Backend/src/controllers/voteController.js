const ethers = require('ethers');
const contractABI = require('../contracts/build/contracts/Voting.json').abi;

async function initializeElectionContract() {
    console.log('Initializing ethers provider...');
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_PROVIDER);
    console.log('Provider initialized:', provider);

    const contractAddress = process.env.CONTRACT_ADDRESS;
    console.log('Contract address:', contractAddress);

    // Validate contract address
    if (!ethers.utils.isAddress(contractAddress)) {
        throw new Error('Invalid contract address');
    }

    const signer = provider.getSigner();
    console.log('Signer:', signer);

    const electionContract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log('Election contract initialized:', electionContract.address);

    return electionContract;
}

const castVote = async (req, res) => {
    console.log('Casting vote...');
    let { electionId, candidateId } = req.body;
    electionId = parseInt(electionId, 10);
    candidateId = parseInt(candidateId, 10);

    const wallet = req.user.wallet; // Adjust this if your structure is different
    const userPrivateKey = wallet ? wallet.privateKey : null;

    console.log(`Received vote request: electionId=${electionId}, candidateId=${candidateId}`);
    console.log('Validating private key...');

    if (!Number.isInteger(electionId) || !Number.isInteger(candidateId)) {
        console.log('Invalid input data:', { electionId, candidateId });
        return res.status(400).json({ error: 'Invalid electionId or candidateId' });
    }

    if (!userPrivateKey || !ethers.isHexString(userPrivateKey) || userPrivateKey.length !== 66) {
        console.log('Invalid private key:', userPrivateKey);
        return res.status(400).json({ error: 'Invalid private key' });
    }

    try {
        console.log('Initializing provider and wallet...');
        const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_PROVIDER);
        const walletInstance = new ethers.Wallet(userPrivateKey, provider);

        console.log(`Wallet address: ${walletInstance.address}`);

        const electionContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, walletInstance);

        console.log('Casting vote on the blockchain...');
        const tx = await electionContract.castVote(electionId, candidateId, {
            gasLimit: 1000000 // Specify a gas limit
        });
        console.log('Transaction sent:', tx.hash);

        const receipt = await tx.wait();
        console.log('Transaction receipt:', receipt);

        if (!receipt.status) {
            throw new Error('Transaction failed or reverted');
        }

        res.json({ message: 'Vote cast successfully', transactionHash: receipt.transactionHash });
    } catch (error) {
        console.error('Error casting vote:', error.message);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};

module.exports = {
    castVote,
};
