const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
  let votingInstance;

  // Accounts
  const owner = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];

  beforeEach(async () => {
    votingInstance = await Voting.new();
  });

  it("should create an election", async () => {
    const startDate = Math.floor(Date.now() / 1000);
    const endDate = startDate + 3600;

    await votingInstance.createElection(
      "Election 1",
      "Description of Election 1",
      startDate,
      endDate,
      { from: owner }
    );

    const election = await votingInstance.getElection(0);
    assert.equal(election.title, "Election 1", "Election title is incorrect");
    assert.equal(election.description, "Description of Election 1", "Election description is incorrect");
    assert.equal(election.startDate.toNumber(), startDate, "Election start date is incorrect");
    assert.equal(election.endDate.toNumber(), endDate, "Election end date is incorrect");
    assert.equal(election.isActive, true, "Election should be active");
  });

  it("should add a candidate to an election", async () => {
    const startDate = Math.floor(Date.now() / 1000);
    const endDate = startDate + 3600;

    await votingInstance.createElection(
      "Election 1",
      "Description of Election 1",
      startDate,
      endDate,
      { from: owner }
    );

    await votingInstance.addCandidate(0, "Candidate 1", { from: owner });
    const candidates = await votingInstance.getCandidates(0);

    assert.equal(candidates.length, 1, "There should be 1 candidate");
    assert.equal(candidates[0].name, "Candidate 1", "Candidate name is incorrect");
  });

  it("should cast a vote", async () => {
    const startDate = Math.floor(Date.now() / 1000);
    const endDate = startDate + 3600;

    await votingInstance.createElection(
      "Election 1",
      "Description of Election 1",
      startDate,
      endDate,
      { from: owner }
    );

    await votingInstance.addCandidate(0, "Candidate 1", { from: owner });
    await votingInstance.addCandidate(0, "Candidate 2", { from: owner });

    await votingInstance.castVote(0, 0, { from: voter1 }); // Voter1 votes for Candidate 1
    const candidates = await votingInstance.getCandidates(0);

    assert.equal(candidates[0].voteCount.toNumber(), 1, "Candidate 1 should have 1 vote");
    assert.equal(candidates[1].voteCount.toNumber(), 0, "Candidate 2 should have 0 votes");
  });

  it("should not allow double voting", async () => {
    const startDate = Math.floor(Date.now() / 1000);
    const endDate = startDate + 3600;

    await votingInstance.createElection(
      "Election 1",
      "Description of Election 1",
      startDate,
      endDate,
      { from: owner }
    );

    await votingInstance.addCandidate(0, "Candidate 1", { from: owner });

    await votingInstance.castVote(0, 0, { from: voter1 });

    try {
      await votingInstance.castVote(0, 0, { from: voter1 });
      assert.fail("Voter should not be able to vote twice");
    } catch (error) {
      assert(error.message.includes("You have already voted"), "Expected double voting to fail");
    }
  });

  it("should close an election", async () => {
    const startDate = Math.floor(Date.now() / 1000);
    const endDate = startDate + 3600;

    await votingInstance.createElection(
      "Election 1",
      "Description of Election 1",
      startDate,
      endDate,
      { from: owner }
    );

    // Move time forward
    await new Promise((resolve) => setTimeout(resolve, 3600 * 1000)); // Wait 1 hour

    await votingInstance.closeElection(0, { from: owner });
    const election = await votingInstance.getElection(0);

    assert.equal(election.isActive, false, "Election should be closed");
  });

  it("should tally votes after the election has ended", async () => {
    const startDate = Math.floor(Date.now() / 1000);
    const endDate = startDate + 3600;

    await votingInstance.createElection(
      "Election 1",
      "Description of Election 1",
      startDate,
      endDate,
      { from: owner }
    );

    await votingInstance.addCandidate(0, "Candidate 1", { from: owner });
    await votingInstance.addCandidate(0, "Candidate 2", { from: owner });

    await votingInstance.castVote(0, 0, { from: voter1 });
    await votingInstance.castVote(0, 1, { from: voter2 });

    // Move time forward
    await new Promise((resolve) => setTimeout(resolve, 3600 * 1000)); // Wait 1 hour

    await votingInstance.closeElection(0, { from: owner });

    const candidates = await votingInstance.tallyVotes(0);
    assert.equal(candidates[0].voteCount.toNumber(), 1, "Candidate 1 should have 1 vote");
    assert.equal(candidates[1].voteCount.toNumber(), 1, "Candidate 2 should have 1 vote");
  });
});
