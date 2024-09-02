const { ethers } = require('ethers');
const Election = require('../models/electionModel');
const contractABI = require('../contracts/build/contracts/Voting.json').abi;
const moment = require('moment-timezone');
const BigNumber = ethers.BigNumber;

let nextNumericId = 187580;

async function initializeElectionContract() {
    try {
        console.log('Initializing ethers provider...');
        const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_PROVIDER);
        console.log('Provider initialized:', provider);

        const contractAddress = process.env.CONTRACT_ADDRESS;
        console.log('Contract address:', contractAddress);

        // Initialize wallet with provider to send transactions
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        console.log('Wallet initialized:', wallet.address);

        // Initialize contract with wallet (signer) to allow sending transactions
        const electionContract = new ethers.Contract(contractAddress, contractABI, wallet);
        console.log('Election contract initialized:', electionContract.address);

        return electionContract;
    } catch (error) {
        console.error('Error initializing election contract:', error.message);
        throw error;
    }
}

async function getNextNumericId() {
    const currentId = nextNumericId;
    nextNumericId++;
    return currentId;
}

const createElection = async (req, res) => {
    console.log('Creating election...');

    // Extract election details from request body
    const { title, description, startDate, endDate } = req.body;
    const cameroonTimeZone = 'Africa/Douala';

    try {
        // Convert start and end dates to Unix timestamps in UTC
        console.log('Converting dates to Unix timestamps...');
        const startTimestamp = moment.tz(startDate, cameroonTimeZone).utc().unix();
        const endTimestamp = moment.tz(endDate, cameroonTimeZone).utc().unix();

        console.log('Election data to be sent to the blockchain:', {
            title,
            description,
            startDate: startTimestamp,
            endDate: endTimestamp
        });

        // Get the ID of the user creating the election
        const createdBy = req.user.id;
        console.log('User creating the election:', createdBy);

        // Initialize the election contract
        console.log('Initializing election contract...');
        const electionContract = await initializeElectionContract();
        if (!electionContract) {
            throw new Error("Failed to initialize election contract");
        }
        console.log('Election contract initialized:', electionContract.address);

        // Send transaction to create election
        console.log('Sending transaction to create election...');
        const tx = await electionContract.createElection(
            title,
            description,
            startTimestamp,
            endTimestamp
        );
        console.log('Transaction sent:', tx.hash);

        // Wait for the transaction to be mined
        console.log('Waiting for transaction to be mined...');
        const receipt = await tx.wait();
        console.log('Transaction receipt:', receipt);

        // Retrieve the next numeric ID for the election
        console.log('Retrieving next numeric ID...');
        const numericId = await getNextNumericId();
        console.log('Numeric ID:', numericId);

        // Fetch the election details from the blockchain
        console.log('Fetching election details from the blockchain...');
        const electionDetails = await electionContract.elections(numericId);
        console.log('Election Details:', electionDetails);

        // Prepare election data to be saved in the database
        console.log('Preparing election data for database...');
        const createdElection = {
            title,
            description,
            startDate: moment.unix(startTimestamp).format(),
            endDate: moment.unix(endTimestamp).format(),
            blockchainTransactionHash: receipt.transactionHash,
            createdBy,
            numericId
        };

        // Save the new election to the database
        console.log('Saving new election to the database...');
        const newElection = new Election(createdElection);
        await newElection.save();

        console.log('Election added to blockchain and database successfully');
        res.json(newElection);
    } catch (error) {
        console.error('Error creating election:', error.message);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};

const getElections = async (req, res) => {
    console.log('Fetching elections from the blockchain...');

    try {
        const electionContract = await initializeElectionContract();
        if (!electionContract) {
            throw new Error("Failed to initialize election contract");
        }

        const electionCount = await electionContract.getElectionCount();
        const electionCountValue = BigInt(electionCount);

        console.log('Election Count:', electionCountValue);

        const elections = [];

        for (let i = 0; i < electionCountValue; i++) {
            console.log(`Fetching details for election ID: ${i}`);

            const electionDetails = await electionContract.getElection(i);
            console.log('Election Details:', electionDetails);

            if (!electionDetails || !electionDetails[3] || !electionDetails[4]) {
                throw new Error(`Election details for ID ${i} are incomplete`);
            }

            const candidates = [];
            try {
                const candidateList = await electionContract.getCandidates(i);
                console.log('Candidate List:', candidateList);

                for (const candidate of candidateList) {
                    candidates.push({
                        candidateId: candidate.id.toString(),
                        name: candidate.name,
                    });
                }
            } catch (candidateError) {
                console.warn(`Could not fetch candidates for election ID: ${i}`, candidateError.message);
            }

            elections.push({
                electionId: electionDetails[0].toString(),
                title: electionDetails[1],
                description: electionDetails[2],
                startDate: new Date(Number(electionDetails[3]) * 1000),
                endDate: new Date(Number(electionDetails[4]) * 1000),
                isActive: electionDetails[5],
                candidates,
            });

            console.log(`Election ${i} details fetched successfully`);
        }

        console.log('All elections fetched from the blockchain:', elections);
        res.json(elections);
    } catch (error) {
        console.error('Error fetching elections from the blockchain:', error.message);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};

const getElectionById = async (req, res) => {
    console.log('Fetching election by ID from the blockchain...');

    try {
        const electionContract = await initializeElectionContract();
        if (!electionContract) {
            throw new Error("Failed to initialize election contract");
        }

        const electionId = parseInt(req.params.id, 10);
        console.log(`Fetching details for election ID: ${electionId}`);

        const electionDetails = await electionContract.getElection(electionId);
        console.log('Election Details:', electionDetails);

        if (!electionDetails || !electionDetails[3] || !electionDetails[4]) {
            throw new Error(`Election details for ID ${electionId} are incomplete`);
        }

        const candidates = [];
        try {
            const candidateList = await electionContract.getCandidates(electionId);
            console.log('Candidate List:', candidateList);

            for (const candidate of candidateList) {
                candidates.push({
                    candidateId: candidate.id.toString(),
                    name: candidate.name,
                });
            }
        } catch (candidateError) {
            console.warn(`Could not fetch candidates for election ID: ${electionId}`, candidateError.message);
        }

        const election = {
            electionId: electionDetails[0].toString(),
            title: electionDetails[1],
            description: electionDetails[2],
            startDate: new Date(Number(electionDetails[3]) * 1000),
            endDate: new Date(Number(electionDetails[4]) * 1000),
            isActive: electionDetails[5],
            candidates,
        };

        console.log('Election fetched successfully:', election);
        res.json(election);
    } catch (error) {
        console.error('Error fetching election from the blockchain:', error.message);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};

const updateElection = async (req, res) => {
    console.log('Updating election...');
    const { title, description, startDate, endDate } = req.body;
    console.log('Updated election data:', title, description, startDate, endDate);

    try {
        const startTimestamp = moment(startDate).utc().unix();
        const endTimestamp = moment(endDate).utc().unix();

        if (isNaN(startTimestamp) || isNaN(endTimestamp) || endTimestamp <= startTimestamp) {
            return res.status(400).json({ msg: 'Invalid dates provided' });
        }

        let election = await Election.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ msg: 'Election not found' });
        }

        if (election.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'User not authorized' });
        }

        const electionContract = await initializeElectionContract();
        if (!electionContract) {
            throw new Error("Failed to initialize election contract");
        }

        const tx = await electionContract.updateElection(
            election.numericId,
            title,
            description,
            startTimestamp,
            endTimestamp
        );

        console.log('Transaction sent:', tx.hash);

        const receipt = await tx.wait();
        if (!receipt.status) {
            throw new Error('Transaction failed or reverted');
        }

        console.log('Transaction mined:', receipt.transactionHash);

        election.title = title;
        election.description = description;
        election.startDate = moment.unix(startTimestamp).format();
        election.endDate = moment.unix(endTimestamp).format();
        election.blockchainTransactionHash = receipt.transactionHash;
        await election.save();

        res.json({ msg: 'Election updated successfully', election });
    } catch (error) {
        console.error('Error updating election on blockchain:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message || 'Failed to update election on blockchain' });
        }
    }
};

const deleteElection = async (req, res) => {
    console.log('Deleting election...');
    try {
        let election = await Election.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ msg: 'Election not found' });
        }

        if (election.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'User not authorized' });
        }

        const electionContract = await initializeElectionContract();

        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime < election.endDate) {
            return res.status(400).json({ msg: 'Election cannot be deleted before its end date' });
        }

        const tx = await electionContract.deleteElection(election.numericId);

        console.log('Transaction sent:', tx.hash);

        const receipt = await tx.wait();
        if (!receipt.status) {
            throw new Error('Transaction failed or reverted');
        }

        console.log('Transaction mined:', receipt.transactionHash);

        await Election.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Election deleted successfully' });
    } catch (error) {
        console.error('Error deleting election from blockchain:', error.message);
        res.status(500).json({ error: error.message || 'Failed to delete election from blockchain' });
    }
};

const closeElection = async (req, res) => {
    console.log('Closing election...');
    
    try {
        const { id } = req.params;

        // Initialize the election contract
        const electionContract = await initializeElectionContract();
        if (!electionContract) {
            throw new Error('Failed to initialize election contract');
        }

        console.log('Election contract initialized:', electionContract.address);

        // Close the election regardless of its status
        console.log(`Attempting to close election with numericId: ${id}`);
        const tx = await electionContract.closeElection(id);
        console.log('Transaction sent:', tx.hash);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        if (!receipt.status) {
            throw new Error('Transaction failed or reverted');
        }

        console.log('Transaction mined:', receipt.transactionHash);
        res.json({ msg: 'Election closed successfully' });

    } catch (error) {
        console.error('Error closing election on blockchain:', error.message);
        res.status(500).json({ error: error.message || 'Failed to close election on blockchain' });
    }
};


module.exports = {
    createElection,
    getElections,
    getElectionById,
    updateElection,
    deleteElection,
    closeElection,
};
