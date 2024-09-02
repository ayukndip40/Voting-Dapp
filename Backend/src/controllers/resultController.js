const { ethers, BigNumber } = require('ethers');
const contractABI = require('../contracts/build/contracts/Voting.json').abi;

// Initialize election contract
async function initializeElectionContract() {
    console.log('Initializing ethers provider...');
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_PROVIDER);
    console.log('Provider initialized:', provider);

    const contractAddress = process.env.CONTRACT_ADDRESS;
    console.log('Contract address:', contractAddress);

    const signer = await provider.getSigner(); // Await the signer
    console.log('Signer initialized:', signer);

    const electionContract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log('Election contract initialized:', electionContract);

    return electionContract;
}

// Tally votes function
const tallyVotes = async (req, res) => {
    console.log('Tallying votes...');
    const { electionId } = req.params;

    if (!electionId) {
        console.error('Election ID is missing');
        return res.status(400).json({ msg: 'Election ID is missing' });
    }

    try {
        console.log('Initializing election contract...');
        const electionContract = await initializeElectionContract();
        console.log('Election contract initialized:', electionContract);

        if (!BigNumber) {
            console.error('ethers.BigNumber is not available');
            throw new Error('ethers.BigNumber is not available');
        }

        // Convert electionId to BigNumber
        let formattedElectionId;
        try {
            formattedElectionId = BigNumber.from(electionId);
        } catch (error) {
            console.error('Error converting electionId to BigNumber:', error.message);
            throw new Error('Invalid electionId format');
        }

        console.log(`Fetching details for electionId=${formattedElectionId.toString()}...`);
        const electionDetails = await electionContract.getElection(formattedElectionId);
        console.log('Fetched Election Details:', electionDetails);

        if (!electionDetails) {
            console.error('Election details are undefined');
            throw new Error('Election details are undefined');
        }

        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime <= electionDetails.endDate.toNumber() || electionDetails.isActive) {
            console.log('Election is still active or voting has not ended yet');
            return res.status(400).json({ msg: 'Election is still active or voting has not ended yet' });
        }

        console.log('Fetching candidates for the election...');
        const candidates = await electionContract.tallyVotes(formattedElectionId);
        console.log('Fetched Candidates:', candidates);

        const results = candidates.map((candidate) => ({
            candidateId: candidate.id.toString(),
            name: candidate.name,
            voteCount: candidate.voteCount.toString(),
        }));

        console.log('Results:', results);

        console.log('Returning tally results...');
        res.json({ election: electionDetails.title, results });
    } catch (error) {
        console.error(`Error tallying votes: ${error.message}`);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};

module.exports = {
    tallyVotes,
};
