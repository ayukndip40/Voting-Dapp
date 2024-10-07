// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // ========================================
    // |               Structures             |
    // ========================================

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Election {
        uint id;
        string title;
        string description;
        uint startDate;
        uint endDate;
        bool isActive;
    }

    struct VoteRecord {
        address voterAddress;      // Voter's public address
        uint256 electionId;       // Unique identifier for the election
        string electionName;       // Name of the election
        uint256 electionDate;      // Date of the election
        uint256 candidateId;       // Unique identifier for the candidate
        string candidateName;      // Name of the candidate
        uint256 timestamp;         // When the vote was cast
        bool confirmationStatus;   // Vote confirmation status
        bytes32 transactionHash;    // Transaction hash of the vote
    }

    // ========================================
    // |             State Variables          |
    // ========================================

    // Mapping from Election ID to an array of Candidates
    mapping(uint => Candidate[]) public candidatesByElection;

    // Mapping from Election ID to Election details
    mapping(uint => Election) public elections;

    // Mapping from Election ID to Voter Address to Voted Status
    mapping(uint => mapping(address => bool)) public votes;

    // Mapping from Election ID to next Candidate ID
    mapping(uint => uint) public nextCandidateIdByElection;

    // Counter for the next Election ID
    uint public nextElectionId;

    mapping(address => VoteRecord[]) public votingHistory;

    // ========================================
    // |                Events                |
    // ========================================

    // Election Events
    event ElectionCreated(uint indexed electionId, string title);
    event ElectionUpdated(uint indexed electionId, string title);
    event ElectionClosed(uint indexed electionId);

    // Candidate Events
    event CandidateAdded(uint indexed electionId, uint candidateId, string name);
    event CandidateUpdated(uint indexed electionId, uint candidateId, string name);
    event CandidateDeleted(uint indexed electionId, uint candidateId);

    // Voting Events
    event VoteCastingInitiated(uint indexed electionId, uint indexed candidateId, address indexed voter);
    event VoteCastingCompleted(uint indexed electionId, uint indexed candidateId, address indexed voter, bool success, string message);
    event ElectionRetrieved(uint indexed electionId, bool isActive, uint startDate, uint endDate);
    event CandidatesRetrieved(uint indexed electionId, uint numberOfCandidates);
    event ElectionStatusChecked(uint indexed electionId, bool isActive);
    event VotingPeriodChecked(uint indexed electionId, uint currentTimestamp, uint startDate, uint endDate);
    event VoterEligibilityChecked(uint indexed electionId, address indexed voter, bool hasVoted);
    event CandidateIndexFound(uint indexed electionId, uint candidateId, uint candidateIndex);
    event VoteCountIncremented(uint indexed electionId, uint candidateId, uint newVoteCount);
    event VoterMarked(uint indexed electionId, address indexed voter);
    event VoteCasted(uint indexed electionId, uint indexed candidateId, address indexed voter, uint256 timestamp);
    event VoteCastedEvent(uint indexed electionId, uint indexed candidateId, address indexed voter, uint256 timestamp);
    event ElectionNotStarted(uint electionId, string message);
    event ElectionNotActive(uint electionId, string message);
    event VotingEnded(uint electionId, string message);
    event CandidateDoesNotExist(uint electionId, uint candidateId);
    event AlreadyVoted(uint electionId, address voter);
    event AlreadyVotedMessage(uint electionId, address voter);


    // ========================================
    // |               Constructor            |
    // ========================================

    constructor() {
        // Optionally initialize some state variables here
        // For example: nextElectionId = 1;
    }

    // ========================================
    // |            Election Functions        |
    // ========================================

    /**
     * @dev Creates a new election.
     * @param _title The title of the election.
     * @param _description The description of the election.
     * @param _startDate The start timestamp of the election.
     * @param _endDate The end timestamp of the election.
     */
    function createElection(
        string memory _title,
        string memory _description,
        uint256 _startDate,
        uint256 _endDate
    ) public {
        require(_endDate > _startDate, "End date must be after start date");

        elections[nextElectionId] = Election({
            id: nextElectionId,
            title: _title,
            description: _description,
            startDate: _startDate,
            endDate: _endDate,
            isActive: true
        });

        emit ElectionCreated(nextElectionId, _title);
        nextElectionId++;
    }

    /**
     * @dev Updates the details of an existing election.
     * @param _electionId The ID of the election to update.
     * @param _title The new title of the election.
     * @param _description The new description of the election.
     * @param _startDate The new start timestamp of the election.
     * @param _endDate The new end timestamp of the election.
     */
    function updateElection(
        uint _electionId,
        string memory _title,
        string memory _description,
        uint _startDate,
        uint _endDate
    ) public {
        require(elections[_electionId].isActive, "Election is not active");
        require(_endDate > _startDate, "End date must be after start date");

        Election storage election = elections[_electionId];
        election.title = _title;
        election.description = _description;
        election.startDate = _startDate;
        election.endDate = _endDate;

        emit ElectionUpdated(_electionId, _title);
    }

    /**
     * @dev Closes an active election.
     * @param _electionId The ID of the election to close.
     */
    function closeElection(uint256 _electionId) public {
        // Ensure the election exists
        require(elections[_electionId].endDate != 0, "Election does not exist");

        // Set the election as inactive
        elections[_electionId].isActive = false;

        // Emit an event to signal that the election has been closed
        emit ElectionClosed(_electionId);
    }

    /**
     * @dev Checks the status of an election.
     * @param _electionId The ID of the election to check.
     * @return A string representing the election status.
     */
    function checkElectionStatus(uint _electionId) public returns (string memory) {
        Election storage election = elections[_electionId];
        emit ElectionRetrieved(_electionId, election.isActive, election.startDate, election.endDate);

        if (!election.isActive) {
            emit ElectionNotActive(_electionId, "Election is closed");
            return "Election is closed";
        }

        if (block.timestamp < election.startDate) {
            emit ElectionNotStarted(_electionId, "Election has not started yet");
            return "Election has not started yet";
        }

        if (block.timestamp > election.endDate) {
            emit VotingEnded(_electionId, "Election has ended");
            return "Election has ended";
        }

        emit ElectionStatusChecked(_electionId, election.isActive);
        return "Election is ongoing";
    }

    /**
     * @dev Retrieves the total number of elections created.
     * @return The count of elections.
     */
    function getElectionCount() public view returns (uint) {
        return nextElectionId;
    }

    // ========================================
    // |           Candidate Functions        |
    // ========================================

    /**
     * @dev Adds a new candidate to an election.
     * @param _electionId The ID of the election.
     * @param _name The name of the candidate.
     */
    function addCandidate(uint _electionId, string memory _name) public {
        Election storage election = elections[_electionId];
        emit ElectionRetrieved(_electionId, election.isActive, election.startDate, election.endDate);

        require(election.isActive, "Election is not active");
        require(bytes(_name).length > 0, "Candidate name is required");

        uint candidateId = nextCandidateIdByElection[_electionId];
        candidatesByElection[_electionId].push(Candidate({
            id: candidateId,
            name: _name,
            voteCount: 0
        }));

        emit CandidateAdded(_electionId, candidateId, _name);
        nextCandidateIdByElection[_electionId]++;
    }

    /**
     * @dev Updates the details of an existing candidate.
     * @param _electionId The ID of the election.
     * @param _candidateId The ID of the candidate to update.
     * @param _name The new name of the candidate.
     */
    function updateCandidate(
        uint _electionId,
        uint _candidateId,
        string memory _name
    ) public {
        require(elections[_electionId].isActive, "Election is not active");
        require(bytes(_name).length > 0, "Candidate name is required");

        Candidate[] storage electionCandidates = candidatesByElection[_electionId];
        bool candidateExists = false;

        for (uint i = 0; i < electionCandidates.length; i++) {
            if (electionCandidates[i].id == _candidateId) {
                electionCandidates[i].name = _name;
                candidateExists = true;
                emit CandidateUpdated(_electionId, _candidateId, _name);
                break;
            }
        }

        require(candidateExists, "Candidate does not exist");
    }

    /**
     * @dev Deletes a candidate from an election.
     * @param _electionId The ID of the election.
     * @param _candidateId The ID of the candidate to delete.
     */
    function deleteCandidate(uint _electionId, uint _candidateId) public {
        require(elections[_electionId].isActive, "Election is not active");

        Candidate[] storage electionCandidates = candidatesByElection[_electionId];
        uint indexToDelete = type(uint).max;
        bool candidateExists = false;

        for (uint i = 0; i < electionCandidates.length; i++) {
            if (electionCandidates[i].id == _candidateId) {
                indexToDelete = i;
                candidateExists = true;
                emit CandidateDeleted(_electionId, _candidateId);
                break;
            }
        }

        require(candidateExists, "Candidate does not exist");

        // Swap with the last candidate and remove
        if (indexToDelete < electionCandidates.length - 1) {
            electionCandidates[indexToDelete] = electionCandidates[electionCandidates.length - 1];
        }
        electionCandidates.pop();
    }

    // ========================================
    // |             Voting Functions         |
    // ========================================

    /**
     * @dev Casts a vote for a candidate in a specific election.
     * @param _electionId The ID of the election.
     * @param _candidateId The ID of the candidate to vote for.
     */
    function castVote(address _voter, uint _electionId, uint _candidateId) public returns (bool success, string memory message) {
    emit VoteCastingInitiated(_electionId, _candidateId, _voter);

    // Retrieve the election and candidates
    Election storage election = elections[_electionId];
    emit ElectionRetrieved(_electionId, election.isActive, election.startDate, election.endDate);

    Candidate[] storage electionCandidates = candidatesByElection[_electionId];
    emit CandidatesRetrieved(_electionId, electionCandidates.length);

    // Ensure the election is active
    if (!election.isActive) {
        emit ElectionStatusChecked(_electionId, election.isActive);
        return (false, "Election is not active");
    }
    emit ElectionStatusChecked(_electionId, election.isActive);

    // Ensure the current time is within the voting period
    uint currentTimestamp = block.timestamp;
    emit VotingPeriodChecked(_electionId, currentTimestamp, election.startDate, election.endDate);
    
    if (currentTimestamp < election.startDate) {
        return (false, "Voting has not started");
    }
    if (currentTimestamp > election.endDate) {
        return (false, "Voting has ended");
    }

    // Check if the sender has already voted
    if (votes[_electionId][_voter]) {
        emit VoterEligibilityChecked(_electionId, _voter, true); // Voter has already voted
        emit AlreadyVotedMessage(_electionId, _voter);
        return (false, "Voter has already voted");
    }

    // If we've reached here, the voter is eligible to vote
    emit VoterEligibilityChecked(_electionId, _voter, false);

    // Simulate the transaction hash
    bytes32 simulatedTransactionHash = keccak256(abi.encodePacked(_voter, _electionId, _candidateId, block.timestamp));

    // Record the vote
    VoteRecord memory newVote = VoteRecord({
        voterAddress: _voter,
        electionId: _electionId,
        electionName: election.title,
        electionDate: election.startDate,
        candidateId: _candidateId,
        candidateName: "",  // Placeholder, should be fetched from the candidate details
        timestamp: block.timestamp,
        confirmationStatus: true,
        transactionHash: simulatedTransactionHash
    });

    votingHistory[_voter].push(newVote);
    emit VoteCasted(_electionId, _candidateId, _voter, block.timestamp);

    // Find the candidate index
    uint candidateIndex = findCandidateIndex(_electionId, _candidateId);
    emit CandidateIndexFound(_electionId, _candidateId, candidateIndex);

    if (candidateIndex == type(uint).max) {
        return (false, "Candidate does not exist");
    }

    // Increment the vote count for the candidate
    electionCandidates[candidateIndex].voteCount++;
    uint newVoteCount = electionCandidates[candidateIndex].voteCount;
    emit VoteCountIncremented(_electionId, _candidateId, newVoteCount);

    // Mark the sender as having voted
    votes[_electionId][_voter] = true;
    emit VoterMarked(_electionId, _voter);

    // Emit the VoteCasted events
    emit VoteCasted(_electionId, _candidateId, _voter, block.timestamp);
    emit VoteCastedEvent(_electionId, _candidateId, _voter, block.timestamp);

    // Emit event: Vote casting completed successfully
    emit VoteCastingCompleted(_electionId, _candidateId, _voter, true, "Vote cast successfully");

    return (true, "Vote cast successfully");
}



    /**
     * @dev Finds the index of a candidate within an election.
     * @param _electionId The ID of the election.
     * @param _candidateId The ID of the candidate.
     * @return The index of the candidate in the candidates array, or type(uint).max if not found.
     */
    function findCandidateIndex(uint _electionId, uint _candidateId) internal view returns (uint) {
        Candidate[] storage electionCandidates = candidatesByElection[_electionId];
        for (uint i = 0; i < electionCandidates.length; i++) {
            if (electionCandidates[i].id == _candidateId) {
                return i;
            }
        }
        return type(uint).max; // Indicate that the candidate was not found
    }

    /**
     * @dev Tallies the votes for a specific election.
     * @param _electionId The ID of the election.
     * @return An array of Candidates with their vote counts.
     */
    function tallyVotes(uint _electionId) public view returns (Candidate[] memory) {
        // Fetch election details
        Election memory election = elections[_electionId];

        // Check if either condition is met
        bool votingEnded = block.timestamp > election.endDate;
        bool electionNotActive = !election.isActive;

        require(votingEnded || electionNotActive, "Voting is still ongoing and election is active");

        // Return the list of candidates
        return candidatesByElection[_electionId];
    }

    // ========================================
    // |             View Functions           |
    // ========================================

    /**
     * @dev Retrieves all candidates for a specific election.
     * @param _electionId The ID of the election.
     * @return An array of Candidates.
     */
    function getCandidates(uint _electionId) public view returns (Candidate[] memory) {
        return candidatesByElection[_electionId];
    }

    /**
     * @dev Retrieves the details of a specific election.
     * @param _electionId The ID of the election.
     * @return The Election struct.
     */
    function getElection(uint _electionId) public view returns (Election memory) {
        return elections[_electionId];
    }

    /**
     * @dev Retrieves the election results after voting has ended.
     * @param _electionId The ID of the election.
     * @return An array of Candidates with their final vote counts.
     */
    function getElectionResults(uint _electionId) public view returns (Candidate[] memory) {
        require(block.timestamp > elections[_electionId].endDate, "Voting has not ended");
        require(!elections[_electionId].isActive, "Election is still active");

        return candidatesByElection[_electionId];
    }

    // Function to get the voting history of a voter
    function getVotingHistory(address _voter) public view returns (VoteRecord[] memory) {
        return votingHistory[_voter];
    }
}
