/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../api/authApi";
import { getVotingHistory } from "../api/voteApi";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const ProfileInfo = ({ profile }) => (
  <div className="space-y-4">
    {[
      {
        label: "Full Name",
        value: profile.fullName,
        icon: <IdentificationIcon className="w-5 h-5 text-blue-600 mr-2" />,
      },
      {
        label: "Email",
        value: profile.email,
        icon: <EnvelopeIcon className="w-5 h-5 text-blue-600 mr-2" />,
      },
      {
        label: "Phone Number",
        value: profile.phoneNumber,
        icon: <PhoneIcon className="w-5 h-5 text-blue-600 mr-2" />,
      },
      {
        label: "National ID",
        value: profile.NationalIDNumber,
        icon: <IdentificationIcon className="w-5 h-5 text-blue-600 mr-2" />,
      },
    ].map(({ label, value, icon }, index) => (
      <div
        key={index}
        className="flex items-center bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
      >
        {icon}
        <p className="text-lg text-gray-800">
          <span className="font-semibold">{label}:</span> {value}
        </p>
      </div>
    ))}
  </div>
);

const VotingHistory = ({ votingHistory, loadingHistory, historyError }) => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
      Voting History
    </h2>

    {loadingHistory ? (
      <div className="text-blue-500 animate-pulse">
        Loading voting history...
      </div>
    ) : historyError ? (
      <div className="flex items-center text-red-500">
        <ExclamationCircleIcon className="w-5 h-5 mr-2" />
        <span>Error: {historyError}</span>
      </div>
    ) : votingHistory.length > 0 ? (
      <ul className="space-y-4">
        {votingHistory.map((vote, index) => (
          <li
            key={index}
            className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-blue-500 transition duration-200 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {vote.electionName}
              </h3>
              <span
                className={`text-sm font-medium ${
                  vote.confirmationStatus ? "text-green-500" : "text-yellow-500"
                }`}
              >
                {vote.confirmationStatus ? (
                  <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                ) : (
                  "Pending"
                )}
              </span>
            </div>
            <p className="text-gray-600">
              <span className="font-medium">Candidate:</span>{" "}
              {vote.candidateName}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Date:</span>{" "}
              {new Date(vote.timestamp * 1000).toLocaleString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Transaction Hash:</span>{" "}
              {vote.transactionHash}
            </p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-center text-gray-500">No voting history found.</p>
    )}
  </div>
);

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votingHistory, setVotingHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCurrentUser();
        setProfile(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchVotingHistory = async () => {
      try {
        const historyData = await getVotingHistory();
        setVotingHistory(historyData.data || []);
      } catch (err) {
        setHistoryError(err.message);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchProfile();
    fetchVotingHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-blue-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6">
        <div className="text-center mb-6">
          <UserCircleIcon className="w-32 h-32 text-blue-600 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-800 mt-2">
            Profile Info
          </h1>
          <button className="mt-3 px-4 py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition duration-300">
            <PencilIcon className="w-5 h-5 inline-block mr-1" />
            Edit Profile
          </button>
        </div>

        {profile ? (
          <ProfileInfo profile={profile} />
        ) : (
          <p className="text-center text-gray-500">No profile data available</p>
        )}

        <VotingHistory
          votingHistory={votingHistory}
          loadingHistory={loadingHistory}
          historyError={historyError}
        />
      </div>
    </div>
  );
};

export default Profile;
