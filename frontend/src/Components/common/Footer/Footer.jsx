/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, PhoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-center md:text-left text-sm mb-4 md:mb-0">
          &copy; 2024 BlockVote. All rights reserved.
        </p>
        <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          <Link to="/privacy-policy" className="hover:text-blue-400 transition duration-300">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="hover:text-blue-400 transition duration-300">
            Terms of Service
          </Link>
          <Link to="/contact" className="hover:text-blue-400 transition duration-300">
            Contact Us
          </Link>
        </nav>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <a href="mailto:support@blockvote.com" className="text-gray-400 hover:text-white transition duration-300">
            <EnvelopeIcon className="w-6 h-6" />
          </a>
          <a href="tel:+123456789" className="text-gray-400 hover:text-white transition duration-300">
            <PhoneIcon className="w-6 h-6" />
          </a>
          <a href="https://www.blockvote.com" className="text-gray-400 hover:text-white transition duration-300">
            <GlobeAltIcon className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
