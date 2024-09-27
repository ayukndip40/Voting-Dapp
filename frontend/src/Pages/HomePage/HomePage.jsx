/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AcademicCapIcon, NewspaperIcon, ArrowRightIcon, UsersIcon, LifebuoyIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const [featuredElections, setFeaturedElections] = useState([]);
  const [news, setNews] = useState([]);

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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold">Vote With Peace Of Mind</h1>
          <p className="mt-4 text-lg max-w-xl mx-auto">
            BlockVote is a secure, transparent blockchain voting platform ensuring tamper-proof elections with verifiable results.
          </p>
          <Link 
            to="/contact" 
            className="mt-6 inline-block px-8 py-3 bg-yellow-500 text-black font-semibold rounded-full shadow hover:bg-yellow-400 transition"
          >
            Explore 
            <ArrowRightIcon className="w-5 h-5 inline ml-2" />
          </Link>
        </div>
      </header>

      {/* Featured Elections Section */}
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <AcademicCapIcon className="w-6 h-6 mr-2 text-blue-400" /> 
            Featured Elections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Static Featured Elections */}
            <div className="bg-gray-700 shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
              <h3 className="text-lg font-semibold">Yaounde Local Council Elections 2024</h3>
              <p className="text-gray-300 mt-2">
                Join us for the upcoming local council elections and make your voice heard in your community.
              </p>
              <Link 
                to="/elections/1" 
                className="inline-block mt-4 text-blue-400 font-medium hover:text-blue-600 transition"
              >
                Learn More 
                <ArrowRightIcon className="w-4 h-4 inline" />
              </Link>
            </div>

            <div className="bg-gray-700 shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
              <h3 className="text-lg font-semibold">Regional Elections 2024</h3>
              <p className="text-gray-300 mt-2">
                Participate in the Regional Elections and help shape the future of our state policies.
              </p>
              <Link 
                to="/elections/2" 
                className="inline-block mt-4 text-blue-400 font-medium hover:text-blue-600 transition"
              >
                Learn More 
                <ArrowRightIcon className="w-4 h-4 inline" />
              </Link>
            </div>

            <div className="bg-gray-700 shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
              <h3 className="text-lg font-semibold">Presidential Elections 2025</h3>
              <p className="text-gray-300 mt-2">
                Get ready for the Presidential elections! Understand the candidates and their platforms.
              </p>
              <Link 
                to="/elections/3" 
                className="inline-block mt-4 text-blue-400 font-medium hover:text-blue-600 transition"
              >
                Learn More 
                <ArrowRightIcon className="w-4 h-4 inline" />
              </Link>
            </div>

            {/* Dynamic elections rendering */}
            {featuredElections.length > 0 ? (
              featuredElections.map((election) => (
                <div key={election._id} className="bg-gray-700 shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
                  <h3 className="text-lg font-semibold">{election.title}</h3>
                  <p className="text-gray-300 mt-2">{election.description}</p>
                  <Link 
                    to={`/elections/${election._id}`} 
                    className="inline-block mt-4 text-blue-400 font-medium hover:text-blue-600 transition"
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
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <NewspaperIcon className="w-6 h-6 mr-2 text-yellow-400" /> 
            Latest News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Static News Articles */}
            <div className="bg-gray-700 shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
              <h4 className="text-lg font-semibold">New Voting Features Launched</h4>
              <p className="text-gray-300 mt-2">
                We have introduced new features to enhance your voting experience. Discover what’s new!
              </p>
              <Link 
                to="/news/1" 
                className="inline-block mt-4 text-blue-400 font-medium hover:text-blue-600 transition"
              >
                Read More 
                <ArrowRightIcon className="w-4 h-4 inline" />
              </Link>
            </div>

            <div className="bg-gray-700 shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
              <h4 className="text-lg font-semibold">Election Day Approaches</h4>
              <p className="text-gray-300 mt-2">
                Get ready for Election Day! Here’s everything you need to know to make your vote count.
              </p>
              <Link 
                to="/news/2" 
                className="inline-block mt-4 text-blue-400 font-medium hover:text-blue-600 transition"
              >
                Read More 
                <ArrowRightIcon className="w-4 h-4 inline" />
              </Link>
            </div>

            <div className="bg-gray-700 shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
              <h4 className="text-lg font-semibold">Join Our Community Events</h4>
              <p className="text-gray-300 mt-2">
                Participate in our upcoming community events to learn more about the voting process.
              </p>
              <Link 
                to="/news/3" 
                className="inline-block mt-4 text-blue-400 font-medium hover:text-blue-600 transition"
              >
                Read More 
                <ArrowRightIcon className="w-4 h-4 inline" />
              </Link>
            </div>

            {/* Dynamic news rendering */}
            {news.length > 0 ? (
              news.map((item) => (
                <div key={item._id} className="bg-gray-700 shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                  <p className="text-gray-300 mt-2">{item.content}</p>
                  <Link 
                    to={`/news/${item._id}`} 
                    className="inline-block mt-4 text-blue-400 font-medium hover:text-blue-600 transition"
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
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Quick Links</h2>
          <div className="flex space-x-4">
            <Link 
              to="/contact" 
              className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-400 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-6">What Our Users Say</h2>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6 mb-4 md:mb-0 flex-1">
              <p className="text-lg italic">"BlockVote has transformed the way I participate in elections. It’s easy and efficient!"</p>
              <p className="mt-4 font-semibold">Micheal Kamdem</p>
              <p className="text-sm">User</p>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6 mb-4 md:mb-0 flex-1">
              <p className="text-lg italic">"I love the transparency and ease of use. Highly recommend!"</p>
              <p className="mt-4 font-semibold">Rapheal Patrick</p>
              <p className="text-sm">User</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <LifebuoyIcon className="w-6 h-6 mr-2 text-purple-400" />
            Need Help?
          </h2>
          <p className="text-gray-300 mb-4">If you have any questions or need assistance, feel free to reach out to our support team.</p>
          <Link 
            to="/support" 
            className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-full hover:bg-purple-400 transition"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;