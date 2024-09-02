// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // Structures
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

    // State Variables
    mapping(uint => Candidate[]) public candidatesByElection; // Election ID to candidates array
    mapping(uint => Election) public elections; // Election ID to Election
    mapping(uint => mapping(address => bool)) public votes; // Election ID to voter to boolean
    mapping(uint => uint) public nextCandidateIdByElection; // Election ID to next Candidate ID
    uint public nextElectionId;

    // Events
    event ElectionCreated(uint indexed electionId, string title);
    event CandidateAdded(uint indexed electionId, uint candidateId, string name);
    event CandidateUpdated(uint indexed electionId, uint candidateId, string name);
    event CandidateDeleted(uint indexed electionId, uint candidateId);
    event VoteCasted(uint indexed electionId, uint indexed candidateId, address indexed voter);
    event ElectionUpdated(uint indexed electionId, string title);
    event ElectionClosed(uint indexed electionId);

    // Constructor
    constructor() {
        // Optionally initialize some state variables here
        // For example: nextElectionId = 1;
    }

    // Create a new election
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

    // Update an election's details
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

    // Add a candidate to an election
    function addCandidate(uint _electionId, string memory _name) public {
        Election storage election = elections[_electionId];
        
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

    // Update a candidate's details
    function updateCandidate(uint _electionId, uint _candidateId, string memory _name) public {
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

    // Delete a candidate from an election
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

    // Cast a vote
    function castVote(uint _electionId, uint _candidateId) public {
        Election storage election = elections[_electionId];
        Candidate[] storage electionCandidates = candidatesByElection[_electionId];

        require(election.isActive, "Election is not active");
        require(block.timestamp >= election.startDate, "Voting has not started");
        require(block.timestamp <= election.endDate, "Voting has ended");
        require(!votes[_electionId][msg.sender], "You have already voted");

        uint candidateIndex = findCandidateIndex(_electionId, _candidateId);
        require(candidateIndex != type(uint).max, "Candidate does not exist");

        electionCandidates[candidateIndex].voteCount++;
        votes[_electionId][msg.sender] = true;

        emit VoteCasted(_electionId, _candidateId, msg.sender);
    }

    // Internal function to find candidate index
    function findCandidateIndex(uint _electionId, uint _candidateId) internal view returns (uint) {
        Candidate[] storage electionCandidates = candidatesByElection[_electionId];
        for (uint i = 0; i < electionCandidates.length; i++) {
            if (electionCandidates[i].id == _candidateId) {
                return i;
            }
        }
        return type(uint).max; // Return a value indicating the candidate was not found
    }

    // Tally votes
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


    // Get candidates for an election
    function getCandidates(uint _electionId) public view returns (Candidate[] memory) {
        return candidatesByElection[_electionId];
    }

    // Get election details
    function getElection(uint _electionId) public view returns (Election memory) {
        return elections[_electionId];
    }

    // Close an election
    function closeElection(uint256 _electionId) public {
    // Ensure the election exists
    require(elections[_electionId].endDate != 0, "Election does not exist");

    // Set the election as inactive
    elections[_electionId].isActive = false;
    
    // Emit an event to signal that the election has been closed
    emit ElectionClosed(_electionId);
   }


    // Get election results
    function getElectionResults(uint _electionId) public view returns (Candidate[] memory) {
        require(block.timestamp > elections[_electionId].endDate, "Voting has not ended");
        require(!elections[_electionId].isActive, "Election is still active");

        return candidatesByElection[_electionId];
    }

    // Check election status
    function checkElectionStatus(uint _electionId) public view returns (string memory) {
        Election storage election = elections[_electionId];
        
        if (!election.isActive) {
            return "Election is closed";
        }
        
        if (block.timestamp < election.startDate) {
            return "Election has not started yet";
        }
        
        if (block.timestamp > election.endDate) {
            return "Election has ended";
        }
        
        return "Election is ongoing";
    }

    // Get the total number of elections
    function getElectionCount() public view returns (uint) {
        return nextElectionId;
    }
}
