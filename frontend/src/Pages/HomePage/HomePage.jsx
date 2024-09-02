/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css'; // Make sure to create this CSS file for styling

const HomePage = () => {
  const [featuredElections, setFeaturedElections] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch featured elections
    const fetchFeaturedElections = async () => {
      try {
        const response = await axios.get('/api/elections/featured'); // Update this endpoint
        setFeaturedElections(response.data);
      } catch (error) {
        console.error('Error fetching featured elections:', error);
      }
    };

    // Fetch latest news or announcements
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/news/latest'); // Update this endpoint
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchFeaturedElections();
    fetchNews();
  }, []);

  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Welcome to BlockVote</h1>
        <p>Participate in elections and make your voice heard.</p>
        <Link to="/elections" className="btn-primary">View Elections</Link>
      </header>

      <section className="featured-elections">
        <h2>Featured Elections</h2>
        <div className="election-cards">
          {featuredElections.length > 0 ? (
            featuredElections.map((election) => (
              <div key={election._id} className="election-card">
                <h3>{election.title}</h3>
                <p>{election.description}</p>
                <Link to={`/elections/${election._id}`} className="btn-secondary">Learn More</Link>
              </div>
            ))
          ) : (
            <p>No featured elections at the moment.</p>
          )}
        </div>
      </section>

      <section className="latest-news">
        <h2>Latest News</h2>
        <div className="news-items">
          {news.length > 0 ? (
            news.map((item) => (
              <div key={item._id} className="news-item">
                <h4>{item.title}</h4>
                <p>{item.content}</p>
                <Link to={`/news/${item._id}`} className="btn-secondary">Read More</Link>
              </div>
            ))
          ) : (
            <p>No news available.</p>
          )}
        </div>
      </section>

      <section className="quick-links">
        <h2>Quick Links</h2>
        <div className="links">
          <Link to="/register" className="btn-primary">Register</Link>
          <Link to="/login" className="btn-primary">Login</Link>
          <Link to="/contact" className="btn-primary">Contact Us</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
