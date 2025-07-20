import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="flex items-center">
              <img src="/images/logo.png" alt="Layole Hospital Logo" className="h-10 mr-2" />
            </h3>
            <p className="text-gray-400">
              Experience healthcare reimagined, Personalized care delivered in a state-of-the-art facility...
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/appointment" className="text-gray-400 hover:text-white transition-colors">Book Appointment</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-gray-400">
              <p className="flex items-start">
                <FaPhone className="w-4 h-4 mt-1 mr-2 flex-shrink-0" />
                +234-7081209617, +234-9067020311
              </p>
              <p className="flex items-start">
                <FaEnvelope className="w-4 h-4 mt-1 mr-2 flex-shrink-0" />
                layolehospital@yahoo.com <br /> layolesk@yahoo.com
              </p>
              <p className="flex items-start">
                <FaMapMarkerAlt className="w-4 h-4 mt-1 mr-2 flex-shrink-0" />
                Oyemekun Street, no 89 Off College Road, Ifako-Ijaiye, Lagos, Nigeria.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Layole Hospital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;