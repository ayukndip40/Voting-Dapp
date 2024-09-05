/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { CalendarIcon, PencilIcon } from '@heroicons/react/24/outline'; // Importing relevant icons
import './ElectionCard.css'; // Import relevant CSS

const ElectionCard = ({ election, onEdit }) => {
  const formatDateTime = (dateTimeString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  return (
    <div className="election-card bg-white shadow-lg rounded-lg p-6 mb-6 flex flex-col max-w-xs mx-auto">
      <h2 className="text-xl font-semibold mb-2 text-center">{election.title}</h2>
      <p className="text-gray-700 mb-4 text-center">{election.description}</p>
      <div className="flex items-center mb-2">
        <CalendarIcon className="w-5 h-5 text-blue-500 mr-2" />
        <span className="font-medium">Start Date and Time:</span>
        <span className="ml-2 text-gray-600">{formatDateTime(election.startDate)}</span>
      </div>
      <div className="flex items-center mb-4">
        <CalendarIcon className="w-5 h-5 text-blue-500 mr-2" />
        <span className="font-medium">End Date and Time:</span>
        <span className="ml-2 text-gray-600">{formatDateTime(election.endDate)}</span>
      </div>
      <button
        onClick={() => onEdit(election)}
        className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700 transition duration-300 w-full"
      >
        <PencilIcon className="w-5 h-5 mr-2" />
        Edit
      </button>
    </div>
  );
};

export default ElectionCard;
