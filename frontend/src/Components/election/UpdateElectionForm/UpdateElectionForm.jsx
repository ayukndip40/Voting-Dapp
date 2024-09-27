/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';


const UpdateElectionForm = ({ election, onUpdateElection }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: [], // Candidates removed as it's not being used in the form
  });

  // Update formData when election prop changes
  useEffect(() => {
    if (election) {
      setFormData({
        title: election.title || '',
        description: election.description || '',
        startDate: election.startDate || '',
        endDate: election.endDate || '',
      });
    }
  }, [election]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    onUpdateElection(formData);
  };

  return (
    <div className="update-election-form">
      <h1>Update Election</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(event) => setFormData({ ...formData, title: event.target.value })}
            placeholder="Enter election title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(event) => setFormData({ ...formData, description: event.target.value })}
            placeholder="Enter election description"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(event) => setFormData({ ...formData, startDate: event.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(event) => setFormData({ ...formData, endDate: event.target.value })}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Update Election</button>
      </form>
    </div>
  );
};

export default UpdateElectionForm;
