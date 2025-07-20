import React from 'react';
import { FaBaby, FaBone, FaFemale, FaUserMd, FaCut, FaHeartbeat, FaProcedures, FaAmbulance, FaClock, FaUserNurse, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const About = () => {
  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Layole Hospital</h1>
          <p className="text-xl opacity-90">Comprehensive healthcare services delivered by expert medical professionals</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Layole Hospital was founded with a vision to provide exceptional healthcare services to our community. 
                Since our inception, we have grown to become a leading healthcare provider in the region.
              </p>
              <p className="text-gray-600 mb-6">
                Our team of dedicated professionals is committed to delivering personalized care using the latest medical 
                technologies and evidence-based practices.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-blue-800 flex items-center">
                    <FaUserMd className="mr-2" /> Our Mission
                  </h3>
                  <p className="text-gray-600">
                    To provide compassionate, high-quality healthcare services that improve the lives of our patients.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-blue-800 flex items-center">
                    <FaUserMd className="mr-2" /> Our Vision
                  </h3>
                  <p className="text-gray-600">
                    To be the leading healthcare provider recognized for excellence in patient care and medical innovation.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/images/hospital-building.jpg" 
                alt="Layole Hospital Building" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUserMd className="text-blue-800 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Compassion</h3>
              <p className="text-gray-600">
                We treat every patient with empathy, kindness, and respect, understanding their unique needs.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHeartbeat className="text-blue-800 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Excellence</h3>
              <p className="text-gray-600">
                We strive for the highest standards in medical care, continuously improving our services.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaProcedures className="text-blue-800 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Innovation</h3>
              <p className="text-gray-600">
                We embrace new technologies and treatments to provide the best possible care for our patients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-16 bg-gradient-to-r from-red-700 to-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 flex items-center justify-center">
                <FaAmbulance className="mr-3" /> 24/7 Emergency Services
              </h2>
              <p className="text-xl mb-8">
                Our emergency department is staffed around the clock with experienced emergency physicians and nurses ready to handle any medical emergency.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <FaClock className="text-3xl mb-2" />
                  <span>24/7 Availability</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaAmbulance className="text-3xl mb-2" />
                  <span>Ambulance Services</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaUserNurse className="text-3xl mb-2" />
                  <span>Expert Medical Team</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-2xl font-semibold">
                  Emergency Hotline: <span className="block text-3xl font-bold mt-2">+234-7081209617<br />+234-9067020311</span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;