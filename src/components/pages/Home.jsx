import React, { useState, useEffect } from 'react';
import HeroCarousel from '../common/HeroCarousel';
import './home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    "/images/ban.jpeg",
    "/images/ward.jpg",
    "/images/lab4.jpg",
    "/images/ban2.jpeg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <section className="hero">
        <HeroCarousel images={images} currentSlide={currentSlide} />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Your Health, Our Priority</h1>
            <p>Providing exceptional healthcare services with compassion, expertise, and state-of-the-art medical technology.</p>
            <div className="hero-buttons">
              <a href="/appointment" className="btn btn-primary">Book Appointment</a>
              <a href="/services" className="btn btn-secondary">Our Services</a>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            {/* Feature cards */}
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>17+</h3>
              <p>Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;