import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3><img src="/images/logo.png" alt="Layole Hospital Logo" /></h3>
            <p>Experience healthcare reimagined, Personalized care delivered in a state-of-the-art facility...</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/appointment">Book Appointment</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p><i className="fas fa-phone"></i> +234-7081209617, +234-9067020311</p>
              <p><i className="fas fa-envelope"></i> layolehospital@yahoo.com <br /> layolesk@yahoo.com</p>
              <p><i className="fas fa-map-marker-alt"></i> Oyemekun Street, no 89 Off College Road, Ifako-Ijaiye, Lagos, Nigeria.</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Layole Hospital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;