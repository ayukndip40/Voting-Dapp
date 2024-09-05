/* eslint-disable no-unused-vars */
// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/authApi';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCurrentUser();
        setProfile(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-blue-500">Loading...</div>
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-lg">
        <div className="text-center mb-8">
          <UserCircleIcon className="w-24 h-24 text-blue-500 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Profile Information</h1>
        </div>
        {profile ? (
          <div className="space-y-6">
            <div className="flex items-center text-gray-700">
              <IdentificationIcon className="w-6 h-6 text-blue-500 mr-3" />
              <p className="text-lg">
                <span className="font-medium">Full Name:</span> {profile.fullName}
              </p>
            </div>
            <div className="flex items-center text-gray-700">
              <EnvelopeIcon className="w-6 h-6 text-blue-500 mr-3" />
              <p className="text-lg">
                <span className="font-medium">Email:</span> {profile.email}
              </p>
            </div>
            <div className="flex items-center text-gray-700">
              <PhoneIcon className="w-6 h-6 text-blue-500 mr-3" />
              <p className="text-lg">
                <span className="font-medium">Phone Number:</span> {profile.phoneNumber}
              </p>
            </div>
            <div className="flex items-center text-gray-700">
              <IdentificationIcon className="w-6 h-6 text-blue-500 mr-3" />
              <p className="text-lg">
                <span className="font-medium">National ID:</span> {profile.NationalIDNumber}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No profile data available</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
