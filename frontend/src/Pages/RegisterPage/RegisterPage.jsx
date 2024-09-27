/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi';
import { UserIcon, EnvelopeIcon, KeyIcon, PhoneIcon, IdentificationIcon } from '@heroicons/react/24/outline';

const Spinner = () => (
  <svg
    className="w-6 h-6 border-t-2 border-blue-600 border-solid rounded-full"
    style={{
      animation: 'spin 4s linear infinite', // Adjust the duration to make it slower (4s for slower spinning)
    }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
  </svg>
);


const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await register({ fullName, email, password, phoneNumber, nationalId, role });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <UserIcon className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              id="fullName"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border-none focus:ring-0"
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border-none focus:ring-0"
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <KeyIcon className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border-none focus:ring-0"
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <PhoneIcon className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="tel"
              id="phoneNumber"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 border-none focus:ring-0"
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <IdentificationIcon className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              id="nationalId"
              placeholder="National ID"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full p-2 border-none focus:ring-0"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="role" className="mb-2 text-sm text-gray-700">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-0"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Spinner />
                <span className="ml-2">Registering...</span>
              </>
            ) : (
              'Register'
            )}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
