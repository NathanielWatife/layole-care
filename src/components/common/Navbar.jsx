import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
    const [isActive, setIsActive] = useState(false);

    const toggleMenu = () => {
        setIsActive(!isActive)
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-logo">
                    <span>Layole Hospital</span>
                </div>
                <ul className="{`nav-menu ${isActive ? 'active' : ''}`}">
                    <li><Link to="/" className="nav-link">Home</Link></li>
                    <li><Link to="/about" className="nav-link">About</Link></li>
                    <li><Link to="/services" className="nav-link">Services</Link></li>
                    <li><Link to="/appointment" className="nav-link">Appointment</Link></li>
                    <li><Link to="/blog" className="nav-link">Blog</Link></li>
                    <li><Link to="/contact" className="nav-link">Contact</Link></li>
                </ul>
                <div className={`hamburger ${isActive ? 'active' : ''}`} onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </div>
        </nav>
    );
};


export default Navbar;