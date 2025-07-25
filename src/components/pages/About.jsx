import React from 'react';
import './about.css';

const About = () => {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>About Layole Hospital</h1>
          <p>Learn about our mission, vision, and commitment to healthcare excellence</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Our Story</h2>
              <div className="about-image">
                <img src="/images/room.jpeg" alt="Hospital Interior" />
              </div>
              <p>Layole and Sons Hospital Limited stands as a prestigious private healthcare institution...</p>
              <p>Furthermore, we proudly offer physiotherapy services as part of our comprehensive...</p>
            </div>
            <div className="about-image">
              <img src="/images/ceo.jpeg" alt="Hospital Interior" />
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            {/* Value cards */}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;