/* eslint-disable no-unused-vars */
// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/authApi';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon, PencilIcon } from '@heroicons/react/24/outline';

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow rounded w-full max-w-sm">
        <div className="text-center mb-6">
          <UserCircleIcon className="w-20 h-20 text-blue-500 mx-auto" />
          <h1 className="text-2xl font-semibold text-gray-800 mt-2">Profile Info</h1>
          <button className="mt-2 flex items-center text-blue-600 hover:underline">
            <PencilIcon className="w-5 h-5 mr-1" />
            Edit Profile
          </button>
        </div>
        
        {profile ? (
          <div className="space-y-4">
            {[
              { label: 'Full Name', value: profile.fullName, icon: <IdentificationIcon className="w-5 h-5 text-blue-500 mr-2" /> },
              { label: 'Email', value: profile.email, icon: <EnvelopeIcon className="w-5 h-5 text-blue-500 mr-2" /> },
              { label: 'Phone Number', value: profile.phoneNumber, icon: <PhoneIcon className="w-5 h-5 text-blue-500 mr-2" /> },
              { label: 'National ID', value: profile.NationalIDNumber, icon: <IdentificationIcon className="w-5 h-5 text-blue-500 mr-2" /> },
            ].map(({ label, value, icon }, index) => (
              <div key={index} className="flex items-center bg-gray-50 p-2 rounded shadow-sm">
                {icon}
                <p className="text-lg">
                  <span className="font-medium">{label}:</span> {value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No profile data available</p>
        )}
      </div>
    </div>
  );
};

export default Profile;