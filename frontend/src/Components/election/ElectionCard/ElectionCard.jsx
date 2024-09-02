/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// ElectionCard.jsx
import React from 'react';
import './ElectionCard.css'; // Import relevant CSS

const ElectionCard = ({ election, onEdit }) => {
  const formatDateTime = (dateTimeString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  return (
    <div className="election-card">
      <h2>{election.title}</h2>
      <p>{election.description}</p>
      <p>
        <strong>Start Date and Time:</strong> {formatDateTime(election.startDate)}
      </p>
      <p>
        <strong>End Date and Time:</strong> {formatDateTime(election.endDate)}
      </p>
      <button onClick={() => onEdit(election)}>Edit</button>
    </div>
  );
};

export default ElectionCard;
