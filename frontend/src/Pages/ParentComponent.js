/* eslint-disable no-unused-vars */
// ParentComponent.jsx
import React, { useState } from 'react';
import ElectionList from '../Components/election/ElectionLists/ElectionLists';
import ElectionDetails from '../Components/User/ElectionDetails/ElectionDetails';

const ParentComponent = () => {
  const [selectedElectionId, setSelectedElectionId] = useState(null);

  const handleSelectElection = (electionId) => {
    setSelectedElectionId(electionId);
  };

  return (
    <div>
      <ElectionList onSelectElection={handleSelectElection} />
      {selectedElectionId && <ElectionDetails electionId={selectedElectionId} />}
    </div>
  );
};

export default ParentComponent;
