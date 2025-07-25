import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Services from './components/pages/Services';
import Appointment from './components/pages/Appointment';
import Contact from './components/pages/Contact';
import Blog from './components/pages/Blog';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
   
  );
}

export default App;
