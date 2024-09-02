/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// CandidateCard.jsx
import React from 'react';
import './CandidateCard.css'; // Import relevant styles

const CandidateCard = ({ candidate, onDelete }) => {
  return (
    <div className="candidate-card">
      <h2>{candidate.name}</h2>
      <button onClick={onDelete} className="delete-btn">Delete</button>
    </div>
  );
};

export default CandidateCard;
