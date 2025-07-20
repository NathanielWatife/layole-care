import { useState } from 'react';
import { FaCalendarCheck, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const Appointment = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    department: '',
    doctor: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    insurance: '',
    terms: false,
    newsletter: false
  });

  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = [];
    
    if (!formData.firstName) newErrors.push("First name is required");
    if (!formData.lastName) newErrors.push("Last name is required");
    if (!formData.email) newErrors.push("Email is required");
    if (!formData.phone) newErrors.push("Phone number is required");
    if (!formData.gender) newErrors.push("Gender is required");
    if (!formData.department) newErrors.push("Department is required");
    if (!formData.appointmentDate) newErrors.push("Appointment date is required");
    if (!formData.appointmentTime) newErrors.push("Appointment time is required");
    if (!formData.reason) newErrors.push("Reason for visit is required");
    if (!formData.terms) newErrors.push("You must agree to the terms and conditions");

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push("Please enter a valid email address");
    }

    if (formData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.push("Please enter a valid phone number");
    }

    if (formData.appointmentDate) {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.push("Appointment date must be today or in the future");
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage("Appointment booked successfully! We've sent a confirmation to your email.");
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '',
        address: '',
        department: '',
        doctor: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        insurance: '',
        terms: false,
        newsletter: false
      });
    } catch (error) {
      console.error("Appointment error:", error);
      setErrors([error.message || "An error occurred. Please try again or call us directly."]);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessMessage = () => {
    setSuccessMessage('');
  };

  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Book an Appointment</h1>
          <p className="text-xl opacity-90">Schedule your visit with our expert medical professionals</p>
        </div>
      </section>

      {/* Appointment Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Appointment Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Why Choose Layole Hospital?</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaCalendarCheck className="text-blue-800 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Expert medical professionals</span>
                  </div>
                  <div className="flex items-start">
                    <FaCalendarCheck className="text-blue-800 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">State-of-the-art facilities</span>
                  </div>
                  <div className="flex items-start">
                    <FaCalendarCheck className="text-blue-800 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Comprehensive healthcare services</span>
                  </div>
                  <div className="flex items-start">
                    <FaCalendarCheck className="text-blue-800 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Patient-centered care</span>
                  </div>
                  <div className="flex items-start">
                    <FaCalendarCheck className="text-blue-800 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">24/7 emergency services</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Need Help?</h3>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start">
                    <FaPhone className="text-blue-800 mt-1 mr-2 flex-shrink-0" />
                    +234-7081209617, +234-9067020311
                  </p>
                  <p className="flex items-start">
                    <FaEnvelope className="text-blue-800 mt-1 mr-2 flex-shrink-0" />
                    layolehospital@yahoo.com <br /> layolesk@yahoo.com
                  </p>
                  <p className="flex items-start">
                    <FaClock className="text-blue-800 mt-1 mr-2 flex-shrink-0" />
                    Office Hours: 24/7
                  </p>
                </div>
              </div>
            </div>

            {/* Appointment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Schedule Your Appointment</h2>
                
                {errors.length > 0 && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    {errors.map((error, index) => (
                      <p key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{error}</span>
                      </p>
                    ))}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">Gender *</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Address</label>
                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="department" className="block text-gray-700 font-medium mb-2">Department *</label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="paediatric">Paediatric Care</option>
                        <option value="orthopedic">Orthopedic Surgery</option>
                        <option value="obstetrics">Obstetrics and Gynaecology</option>
                        <option value="consultants">Medical Consultants</option>
                        <option value="general-surgery">General Surgery</option>
                        <option value="internal-medicine">Internal Medicine</option>
                        <option value="emergency">Emergency</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="doctor" className="block text-gray-700 font-medium mb-2">Preferred Doctor</label>
                      <select
                        id="doctor"
                        name="doctor"
                        value={formData.doctor}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Any Available Doctor</option>
                        <option value="orthopedic">Orthopedic Surgery</option>
                        <option value="obstetrics">Obstetrics and Gynaecology</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="appointmentDate" className="block text-gray-700 font-medium mb-2">Preferred Date *</label>
                      <input
                        type="date"
                        id="appointmentDate"
                        name="appointmentDate"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="appointmentTime" className="block text-gray-700 font-medium mb-2">Preferred Time *</label>
                      <select
                        id="appointmentTime"
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="reason" className="block text-gray-700 font-medium mb-2">Reason for Visit *</label>
                    <textarea
                      id="reason"
                      name="reason"
                      rows="4"
                      placeholder="Please describe your symptoms or reason for the appointment"
                      value={formData.reason}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    ></textarea>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="insurance" className="block text-gray-700 font-medium mb-2">Insurance Provider</label>
                    <input
                      type="text"
                      id="insurance"
                      name="insurance"
                      placeholder="Enter your insurance provider"
                      value={formData.insurance}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id="terms"
                          name="terms"
                          checked={formData.terms}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          required
                        />
                      </div>
                      <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                        I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> *
                      </label>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id="newsletter"
                          name="newsletter"
                          checked={formData.newsletter}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
                        I would like to receive health tips and updates via email
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center transition-colors disabled:opacity-70"
                  >
                    <FaCalendarCheck className="mr-2" />
                    {isLoading ? 'Processing...' : 'Book Appointment'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Message Modal */}
      {successMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <FaCalendarCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-3">Appointment Booked Successfully!</h3>
              <p className="text-sm text-gray-500 mt-2">{successMessage}</p>
              <div className="mt-4">
                <button
                  onClick={closeSuccessMessage}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-800 text-base font-medium text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;