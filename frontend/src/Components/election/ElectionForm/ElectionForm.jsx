/* eslint-disable no-unused-vars */
// src/components/ElectionForm.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CalendarIcon, ClockIcon, PencilSquareIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

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
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-semibold mb-6 flex items-center">
        <PencilSquareIcon className="w-6 h-6 text-blue-600 mr-2" />
        Create Election
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            <PencilSquareIcon className="w-5 h-5 text-gray-500 inline-block mr-2" />
            Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleChange('title')}
            placeholder="Enter election title"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            <DocumentTextIcon className="w-5 h-5 text-gray-500 inline-block mr-2" />
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange('description')}
            placeholder="Enter election description"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows="3"
            required
          />
        </div>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h2 className="text-md font-semibold mb-2 text-gray-700">Start Date & Time</h2>
            <div className="flex items-center mb-4">
              <CalendarIcon className="w-5 h-5 text-gray-500 mr-2" />
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange('startDate')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 text-gray-500 mr-2" />
              <input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange('startTime')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h2 className="text-md font-semibold mb-2 text-gray-700">End Date & Time</h2>
            <div className="flex items-center mb-4">
              <CalendarIcon className="w-5 h-5 text-gray-500 mr-2" />
              <input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange('endDate')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 text-gray-500 mr-2" />
              <input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange('endTime')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Election
        </button>
      </form>
    </div>
  );
};

ElectionForm.propTypes = {
  onCreateElection: PropTypes.func.isRequired,
};

export default ElectionForm;
