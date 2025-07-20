import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center text-2xl font-bold text-blue-800" onClick={closeMenu}>
            <img src="/images/logo.png" alt="Layole Hospital" className="h-10 mr-2" />
            Layole Hospital
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`text-gray-800 hover:text-blue-800 font-medium ${isActive('/') ? 'text-blue-800 border-b-2 border-blue-800' : ''}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-gray-800 hover:text-blue-800 font-medium ${isActive('/about') ? 'text-blue-800 border-b-2 border-blue-800' : ''}`}
              onClick={closeMenu}
            >
              About
            </Link>
            <Link 
              to="/services" 
              className={`text-gray-800 hover:text-blue-800 font-medium ${isActive('/services') ? 'text-blue-800 border-b-2 border-blue-800' : ''}`}
              onClick={closeMenu}
            >
              Services
            </Link>
            <Link 
              to="/appointment" 
              className={`text-gray-800 hover:text-blue-800 font-medium ${isActive('/appointment') ? 'text-blue-800 border-b-2 border-blue-800' : ''}`}
              onClick={closeMenu}
            >
              Appointment
            </Link>
            <Link 
              to="/blog" 
              className={`text-gray-800 hover:text-blue-800 font-medium ${isActive('/blog') ? 'text-blue-800 border-b-2 border-blue-800' : ''}`}
              onClick={closeMenu}
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              className={`text-gray-800 hover:text-blue-800 font-medium ${isActive('/contact') ? 'text-blue-800 border-b-2 border-blue-800' : ''}`}
              onClick={closeMenu}
            >
              Contact
            </Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-blue-800 focus:outline-none"
            >
              <div className={`hamburger ${isOpen ? 'active' : ''}`}>
                <span className="block w-6 h-0.5 bg-gray-800 mb-1.5 transition-all"></span>
                <span className="block w-6 h-0.5 bg-gray-800 mb-1.5 transition-all"></span>
                <span className="block w-6 h-0.5 bg-gray-800 transition-all"></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-blue-100 text-blue-800' : 'text-gray-800 hover:bg-blue-50 hover:text-blue-800'}`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/about') ? 'bg-blue-100 text-blue-800' : 'text-gray-800 hover:bg-blue-50 hover:text-blue-800'}`}
            onClick={closeMenu}
          >
            About
          </Link>
          <Link 
            to="/services" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/services') ? 'bg-blue-100 text-blue-800' : 'text-gray-800 hover:bg-blue-50 hover:text-blue-800'}`}
            onClick={closeMenu}
          >
            Services
          </Link>
          <Link 
            to="/appointment" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/appointment') ? 'bg-blue-100 text-blue-800' : 'text-gray-800 hover:bg-blue-50 hover:text-blue-800'}`}
            onClick={closeMenu}
          >
            Appointment
          </Link>
          <Link 
            to="/blog" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/blog') ? 'bg-blue-100 text-blue-800' : 'text-gray-800 hover:bg-blue-50 hover:text-blue-800'}`}
            onClick={closeMenu}
          >
            Blog
          </Link>
          <Link 
            to="/contact" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/contact') ? 'bg-blue-100 text-blue-800' : 'text-gray-800 hover:bg-blue-50 hover:text-blue-800'}`}
            onClick={closeMenu}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;