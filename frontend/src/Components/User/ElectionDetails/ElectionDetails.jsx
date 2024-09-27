/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { getElectionById } from '../../../api/electionApi';
import VoteForm from '../VoteForm/VoteForm';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

const ElectionDetails = ({ electionId }) => {
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const result = await getElectionById(electionId);
        if (result && result.electionId) {
          setElection(result);
        } else {
          setError('Election not found.');
        }
      } catch (err) {
        setError(`Failed to fetch election details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchElection();
  }, [electionId]);

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    };
    return new Date(dateTimeString).toLocaleString('en-CM', options);
  };

  if (loading) return <div className="text-center text-gray-500 py-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 py-10">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-8">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{election.title}</h1>
          <p className="text-lg text-gray-600">{election.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-md p-4 shadow-sm transition-transform transform hover:scale-105">
            <div className="flex items-center">
              <CalendarIcon className="w-6 h-6 text-blue-600 mr-2" />
              <p className="text-sm font-semibold text-gray-600">Start Date</p>
            </div>
            <p className="text-xl font-medium text-gray-800">{formatDateTime(election.startDate)}</p>
          </div>
          <div className="bg-red-50 rounded-md p-4 shadow-sm transition-transform transform hover:scale-105">
            <div className="flex items-center">
              <ClockIcon className="w-6 h-6 text-red-600 mr-2" />
              <p className="text-sm font-semibold text-gray-600">End Date</p>
            </div>
            <p className="text-xl font-medium text-gray-800">{formatDateTime(election.endDate)}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Vote Now</h2>
          <VoteForm electionId={election.electionId} candidates={election.candidates} isElectionActive={election.isActive}/>
        </div>
      </div>
    </div>
  );
};

export default ElectionDetails;