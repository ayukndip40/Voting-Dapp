/* eslint-disable no-unused-vars */
// src/pages/HomePage.js
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AcademicCapIcon, NewspaperIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { AuthContext } from '../../Context/AuthContext'; // Assuming you have an AuthContext

const HomePage = () => {
  const [featuredElections, setFeaturedElections] = useState([]);
  const [news, setNews] = useState([]);
  const { isAuthenticated } = useContext(AuthContext); // Access authentication status

  useEffect(() => {
    const fetchFeaturedElections = async () => {
      try {
        const response = await axios.get('/api/elections/featured');
        setFeaturedElections(response.data);
      } catch (error) {
        console.error('Error fetching featured elections:', error);
      }
    };

    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/news/latest');
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchFeaturedElections();
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-blue-500 text-white py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Welcome to BlockVote</h1>
          <p className="mt-4 text-lg">Participate in elections and make your voice heard.</p>
          <Link 
            to="/elections" 
            className="mt-6 inline-block px-8 py-3 bg-yellow-500 text-black font-semibold rounded-full shadow hover:bg-yellow-400 transition"
          >
            View Elections 
            <ArrowRightIcon className="w-5 h-5 inline ml-2" />
          </Link>
        </div>
      </header>

      {/* Featured Elections Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <AcademicCapIcon className="w-6 h-6 mr-2 text-blue-500" /> 
            Featured Elections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredElections.length > 0 ? (
              featuredElections.map((election) => (
                <div key={election._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
                  <h3 className="text-lg font-semibold">{election.title}</h3>
                  <p className="text-gray-700 mt-2">{election.description}</p>
                  <Link 
                    to={`/elections/${election._id}`} 
                    className="inline-block mt-4 text-blue-500 font-medium hover:text-blue-700 transition"
                  >
                    Learn More 
                    <ArrowRightIcon className="w-4 h-4 inline" />
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No featured elections at the moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <NewspaperIcon className="w-6 h-6 mr-2 text-yellow-500" /> 
            Latest News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.length > 0 ? (
              news.map((item) => (
                <div key={item._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                  <p className="text-gray-700 mt-2">{item.content}</p>
                  <Link 
                    to={`/news/${item._id}`} 
                    className="inline-block mt-4 text-blue-500 font-medium hover:text-blue-700 transition"
                  >
                    Read More 
                    <ArrowRightIcon className="w-4 h-4 inline" />
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No news available.</p>
            )}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Quick Links</h2>
          <div className="flex space-x-4">
            {!isAuthenticated && ( // Only show Register and Login if not authenticated
              <>
                <Link 
                  to="/register" 
                  className="px-6 py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-400 transition"
                >
                  Register
                </Link>
                <Link 
                  to="/login" 
                  className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-400 transition"
                >
                  Login
                </Link>
              </>
            )}
            <Link 
              to="/contact" 
              className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-full hover:bg-yellow-400 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
