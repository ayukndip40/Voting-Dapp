const Voting = artifacts.require("Voting");
const truffleAssert = require("truffle-assertions");

contract("Voting", (accounts) => {
  let votingInstance;
  const owner = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];

  beforeEach(async () => {
    votingInstance = await Voting.new({ from: owner });
  });

  describe("Election Management", () => {
    it("should create a new election", async () => {
      const title = "Test Election";
      const description = "This is a test election";
      const startDate = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const endDate = startDate + 86400; // 1 day after start

      const tx = await votingInstance.createElection(
        title,
        description,
        startDate,
        endDate,
        { from: owner }
      );

      truffleAssert.eventEmitted(tx, "ElectionCreated", (ev) => {
        return ev.title === title;
      });

      const election = await votingInstance.getElection(0);
      assert.equal(election.title, title);
      assert.equal(election.description, description);
      assert.equal(election.startDate, startDate.toString());
      assert.equal(election.endDate, endDate.toString());
      assert.equal(election.isActive, true);
    });

    it("should update an election", async () => {
      await votingInstance.createElection(
        "Original",
        "Description",
        1000,
        2000,
        { from: owner }
      );

      const newTitle = "Updated Election";
      const newDescription = "Updated description";
      const newStartDate = 1500;
      const newEndDate = 2500;

      const tx = await votingInstance.updateElection(
        0,
        newTitle,
        newDescription,
        newStartDate,
        newEndDate,
        { from: owner }
      );

      truffleAssert.eventEmitted(tx, "ElectionUpdated", (ev) => {
        return ev.title === newTitle;
      });

      const updatedElection = await votingInstance.getElection(0);
      assert.equal(updatedElection.title, newTitle);
      assert.equal(updatedElection.description, newDescription);
      assert.equal(updatedElection.startDate, newStartDate.toString());
      assert.equal(updatedElection.endDate, newEndDate.toString());
    });
  });

  describe("Candidate Management", () => {
    beforeEach(async () => {
      await votingInstance.createElection(
        "Test Election",
        "Description",
        1000,
        2000,
        { from: owner }
      );
    });

    it("should add a candidate", async () => {
      const candidateName = "John Doe";
      const tx = await votingInstance.addCandidate(0, candidateName, {
        from: owner,
      });

      truffleAssert.eventEmitted(tx, "CandidateAdded", (ev) => {
        return ev.name === candidateName;
      });

      const candidates = await votingInstance.getCandidates(0);
      assert.equal(candidates[0].name, candidateName);
      assert.equal(candidates[0].voteCount.toString(), "0");
    });

    it("should update a candidate", async () => {
      await votingInstance.addCandidate(0, "Original Name", { from: owner });

      const newName = "Updated Name";
      const tx = await votingInstance.updateCandidate(0, 0, newName, {
        from: owner,
      });

      truffleAssert.eventEmitted(tx, "CandidateUpdated", (ev) => {
        return ev.name === newName;
      });

      const candidates = await votingInstance.getCandidates(0);
      assert.equal(candidates[0].name, newName);
    });

    it("should delete a candidate", async () => {
      await votingInstance.addCandidate(0, "Candidate 1", { from: owner });
      await votingInstance.addCandidate(0, "Candidate 2", { from: owner });

      const tx = await votingInstance.deleteCandidate(0, 0, { from: owner });

      truffleAssert.eventEmitted(tx, "CandidateDeleted", (ev) => {
        return ev.candidateId.toString() === "0";
      });

      const candidates = await votingInstance.getCandidates(0);
      assert.equal(candidates.length, 1);
      assert.equal(candidates[0].name, "Candidate 2");
    });
  });

  describe("Voting Process", () => {
    beforeEach(async () => {
      const now = Math.floor(Date.now() / 1000);
      await votingInstance.createElection(
        "Test Election",
        "Description",
        now,
        now + 3600,
        { from: owner }
      );
      await votingInstance.addCandidate(0, "Candidate 1", { from: owner });
      await votingInstance.addCandidate(0, "Candidate 2", { from: owner });
    });

    it("should allow a voter to cast a vote", async () => {
      const tx = await votingInstance.castVote(0, 0, { from: voter1 });

      truffleAssert.eventEmitted(tx, "VoteCasted", (ev) => {
        return (
          ev.electionId.toString() === "0" &&
          ev.candidateId.toString() === "0" &&
          ev.voter === voter1
        );
      });

      const candidates = await votingInstance.getCandidates(0);
      assert.equal(candidates[0].voteCount.toString(), "1");
    });

    it("should not allow double voting", async () => {
      await votingInstance.castVote(0, 0, { from: voter1 });

      await truffleAssert.reverts(
        votingInstance.castVote(0, 1, { from: voter1 }),
        "You have already voted"
      );
    });
  });

  describe("Election Results", () => {
    beforeEach(async () => {
      const now = Math.floor(Date.now() / 1000);
      await votingInstance.createElection(
        "Test Election",
        "Description",
        now - 3600,
        now + 1800,
        { from: owner }
      );
      await votingInstance.addCandidate(0, "Candidate 1", { from: owner });
      await votingInstance.addCandidate(0, "Candidate 2", { from: owner });
      await votingInstance.castVote(0, 0, { from: voter1 });
      await votingInstance.castVote(0, 1, { from: voter2 });
    });

    it("should tally votes correctly", async () => {
      // Fast-forward time (this requires a custom provider or ganache-cli)
      // await time.increase(time.duration.hours(2));

      await votingInstance.closeElection(0, { from: owner });
      const results = await votingInstance.tallyVotes(0);

      assert.equal(results[0].voteCount.toString(), "1");
      assert.equal(results[1].voteCount.toString(), "1");
    });

    it("should not allow tallying votes for an ongoing election", async () => {
      await truffleAssert.reverts(
        votingInstance.tallyVotes(0),
        "Voting is still ongoing and election is active"
      );
    });
  });

  describe("Election Status", () => {
    it("should return correct election status", async () => {
      const now = Math.floor(Date.now() / 1000);
      await votingInstance.createElection(
        "Status Test",
        "Description",
        now + 1800, // start time 30 minutes in the future
        now + 3600, // end time 1 hour in the future
        { from: owner }
      );

      // Check the election status (before the election starts)
      let status = await votingInstance.checkElectionStatus.call(0); // Use .call() to get the return value
      assert.equal(status, "Election has not started yet");

      // Uncomment and use time manipulation functions with ganache-cli or a similar tool for fast-forwarding time.
      // await time.increase(time.duration.hours(1));

      // Check during the election
      // status = await votingInstance.checkElectionStatus.call(0);
      // assert.equal(status, "Election is ongoing");

      // After the election has ended
      // await time.increase(time.duration.hours(2));
      // status = await votingInstance.checkElectionStatus.call(0);
      // assert.equal(status, "Election has ended");

      // Close the election
      await votingInstance.closeElection(0, { from: owner });

      // Check the election status after closing
      status = await votingInstance.checkElectionStatus.call(0); // Use .call() again for the return value
      assert.equal(status, "Election is closed");
    });
  });
});
