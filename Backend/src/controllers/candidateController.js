// src/controllers/CandidateController.js
const { ethers } = require('ethers');
const Candidate = require('../models/candidateModel'); // Assume you have a Candidate model
const contractABI = require('../contracts/build/contracts/Voting.json').abi;
const Election = require('../models/electionModel');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Ensure you have installed uuid package

async function initializeElectionContract() {
    console.log('Initializing ethers provider...');
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_PROVIDER);
    console.log('Provider initialized:', provider);

    const contractAddress = process.env.CONTRACT_ADDRESS;
    console.log('Contract address:', contractAddress);

    const signer = await provider.getSigner();
    console.log('Signer:', signer);

    const electionContract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log('Election contract initialized:', electionContract);

    return electionContract;
}


const getNumericIdForElection = async (electionId) => {
    try {
        // Convert electionId to ObjectId using the `new` keyword
        const objectId = new mongoose.Types.ObjectId(electionId);

        // Fetch numeric ID from the database
        const election = await Election.findById(objectId);
        return election ? election.numericId : undefined;
    } catch (error) {
        console.error('Error fetching numeric ID:', error.message);
        return undefined;
    }
};





const addCandidate = async (req, res) => {
    console.log('Adding candidate...');
    const { electionId } = req.params;
    const { name } = req.body;

    console.log('Candidate data:', { electionId, name });

    try {
        // Initialize the ethers provider and contract
        console.log('Initializing ethers provider...');
        const electionContract = await initializeElectionContract();
        if (!electionContract) {
            throw new Error("Failed to initialize election contract");
        }

        // Check if the election is active
        const election = await electionContract.elections(electionId);
        console.log('Election details:', election);

        // Update isActive status based on the smart contract logic
        const isActive = election.isActive;
        console.log('Election isActive status:', isActive);

        if (!isActive) {
            throw new Error("Election is not active");
        }

        // Get the next candidate ID before adding the candidate
        const nextCandidateId = await electionContract.nextCandidateIdByElection(electionId);
        console.log("Next Candidate ID:", nextCandidateId.toString());

        // Call the smart contract function to add a candidate
        console.log('Sending transaction to add candidate...');
        const tx = await electionContract.addCandidate(electionId, name);
        console.log('Transaction sent:', tx.hash);

        // Wait for the transaction to be mined
        console.log('Waiting for transaction to be mined...');
        const receipt = await tx.wait();
        console.log('Transaction receipt:', receipt);

        // The candidate ID is the one we got before adding the candidate
        const candidateId = nextCandidateId.toString();
        console.log('Candidate ID:', candidateId);

        // Save candidate to the database
        const newCandidate = new Candidate({
            _id: candidateId, // Storing as string
            electionId: electionId, // Storing as string
            name,
            blockchainTransactionHash: receipt.transactionHash,
        });

        await newCandidate.save();
        console.log('Candidate added to database:', newCandidate);

        // Respond with success
        res.json({ message: 'Candidate added successfully', candidate: newCandidate });
    } catch (error) {
        // Log and handle errors
        console.error('Error adding candidate:', error.message);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};




// Update candidate in an election
const updateCandidate = async (req, res) => {
    console.log('Updating candidate...');
    const { electionId } = req.params;
    const { candidateId, name } = req.body;

    console.log('Candidate data:', { electionId, candidateId, name });

    try {
        // Initialize the ethers provider and contract
        console.log('Initializing ethers provider...');
        const electionContract = await initializeElectionContract();
        if (!electionContract) {
            throw new Error("Failed to initialize election contract");
        }

        // Check if the election is active
        const election = await electionContract.elections(electionId);
        console.log('Election details:', election);

        const isActive = election.isActive;
        console.log('Election isActive status:', isActive);

        if (!isActive) {
            throw new Error("Election is not active");
        }

        // Call the smart contract function to update the candidate
        console.log('Sending transaction to update candidate...');
        const tx = await electionContract.updateCandidate(electionId, candidateId, name);
        console.log('Transaction sent:', tx.hash);

        // Wait for the transaction to be mined
        console.log('Waiting for transaction to be mined...');
        const receipt = await tx.wait();
        console.log('Transaction receipt:', receipt);

        // Update candidate in the database
        console.log('Updating candidate in database...');
        const updatedCandidate = await Candidate.findByIdAndUpdate(candidateId, {
            name,
            blockchainTransactionHash: receipt.transactionHash,
        }, { new: true });
        console.log('Candidate updated:', updatedCandidate);

        // Respond with success
        res.json({ message: 'Candidate updated successfully', candidate: updatedCandidate });
    } catch (error) {
        // Log and handle errors
        console.error('Error updating candidate:', error.message);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};


  
  // Delete candidate from an election
  const deleteCandidate = async (req, res) => {
    console.log('Deleting candidate...');
    const { candidateId } = req.params;
    console.log('Candidate ID:', candidateId);

    try {
        // Initialize the ethers provider and contract
        console.log('Initializing ethers provider...');
        const electionContract = await initializeElectionContract();
        if (!electionContract) {
            throw new Error("Failed to initialize election contract");
        }

        // Fetch the candidate from the database
        console.log('Fetching candidate from database...');
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        // Delete candidate from blockchain
        console.log('Sending transaction to remove candidate from blockchain...');
        const tx = await electionContract.deleteCandidate(candidate.electionId, candidateId);
        console.log('Transaction sent:', tx.hash);

        // Wait for the transaction to be mined
        console.log('Waiting for transaction to be mined...');
        const receipt = await tx.wait();
        console.log('Transaction mined:', receipt);

        // Delete candidate from database
        console.log('Deleting candidate from database...');
        await Candidate.findByIdAndDelete(candidateId);
        console.log('Candidate deleted successfully');

        // Respond with success
        res.json({ message: 'Candidate removed', blockchainTransactionHash: receipt.transactionHash });
    } catch (error) {
        // Log and handle errors
        console.error('Error deleting candidate:', error.message);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};

  
  // Get all candidates for an election
  const getCandidates = async (req, res) => {
    console.log('Fetching all candidates...');

    try {
        // Initialize the ethers provider and contract
        console.log('Initializing ethers provider...');
        const electionContract = await initializeElectionContract();
        if (!electionContract) {
            throw new Error("Failed to initialize election contract");
        }

        // Fetch the total number of elections
        console.log('Fetching election count...');
        const electionCount = await electionContract.getElectionCount();
        const totalElections = electionCount.toNumber ? electionCount.toNumber() : parseInt(electionCount);

        if (totalElections === 0) {
            return res.status(404).json({ error: 'No elections found' });
        }

        // Fetch all candidates from blockchain and their election details
        const allCandidates = [];
        for (let i = 0; i < totalElections; i++) {
            console.log(`Fetching candidates for election ${i}...`);
            const election = await electionContract.getElection(i);
            const candidates = await electionContract.getCandidates(i);

            // Map each candidate to include election details
            const candidatesWithElectionDetails = candidates.map(candidate => ({
                id: candidate.id.toNumber ? candidate.id.toNumber() : parseInt(candidate.id),
                name: candidate.name,
                voteCount: candidate.voteCount.toNumber ? candidate.voteCount.toNumber() : parseInt(candidate.voteCount),
                electionId: i,
                electionTitle: election.title
            }));

            allCandidates.push(...candidatesWithElectionDetails);
        }

        if (allCandidates.length === 0) {
            return res.status(404).json({ error: 'No candidates found' });
        }

        console.log('Candidates fetched:', allCandidates);

        // Respond with the list of candidates including election details
        res.json(allCandidates);
    } catch (error) {
        // Log and handle errors
        console.error('Error fetching candidates:', error.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

  
  // Export functions
  module.exports = {
      addCandidate,
      updateCandidate,
      deleteCandidate,
      getCandidates,
  };
  
