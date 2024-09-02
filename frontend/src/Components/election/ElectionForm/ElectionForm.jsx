/* eslint-disable no-unused-vars */
// src/components/ElectionForm.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ElectionForm.css';

const ElectionForm = ({ onCreateElection }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  // Handler for form input changes
  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  // Handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { startDate, startTime, endDate, endTime } = formData;
    // Combine date and time fields
    const startDateTime = `${startDate}T${startTime}`;
    const endDateTime = `${endDate}T${endTime}`;
    onCreateElection({
      ...formData,
      startDate: startDateTime,
      endDate: endDateTime,
    });
  };

  return (
    <div className="election-form">
      <h1>Create Election</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleChange('title')}
            placeholder="Enter election title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange('description')}
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
            onChange={handleChange('startDate')}
            required
          />
          <input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={handleChange('startTime')}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange('endDate')}
            required
          />
          <input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={handleChange('endTime')}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Create Election</button>
      </form>
    </div>
  );
};

ElectionForm.propTypes = {
  onCreateElection: PropTypes.func.isRequired,
};

export default ElectionForm;
