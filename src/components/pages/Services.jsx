import React from 'react';
import { FaBaby, FaBone, FaFemale, FaUserMd, FaCut, FaHeartbeat, FaProcedures, FaAmbulance, FaClock, FaUserNurse } from 'react-icons/fa';

const Services = () => {
  const services = [
    {
      icon: <FaBaby className="text-3xl" />,
      title: "Paediatric Care",
      description: "Comprehensive medical care for infants, children, and adolescents. Our pediatric specialists provide preventive care, treatment of acute and chronic conditions, and developmental assessments.",
      features: [
        "Well-child checkups",
        "Immunizations",
        "Developmental screenings",
        "Pediatric emergency care"
      ]
    },
    {
      icon: <FaBone className="text-3xl" />,
      title: "Orthopedic Surgery",
      description: "Advanced orthopedic care for bone, joint, and muscle conditions. Our orthopedic surgeons specialize in both surgical and non-surgical treatments for musculoskeletal disorders.",
      features: [
        "Joint replacement surgery",
        "Sports injury treatment",
        "Fracture care",
        "Arthroscopic procedures"
      ]
    },
    {
      icon: <FaFemale className="text-3xl" />,
      title: "Obstetrics and Gynaecology",
      description: "Complete women's health services including pregnancy care, childbirth, and gynecological treatments. Our OB/GYN specialists provide compassionate care for women of all ages.",
      features: [
        "Prenatal care",
        "Labor and delivery",
        "Gynecological exams",
        "Family planning"
      ]
    },
    {
      icon: <FaUserMd className="text-3xl" />,
      title: "Medical Consultants",
      description: "Expert medical consultations across various specialties. Our consultant physicians provide specialized diagnosis, treatment plans, and ongoing care for complex medical conditions.",
      features: [
        "Specialist consultations",
        "Second opinions",
        "Treatment planning",
        "Follow-up care"
      ]
    },
    {
      icon: <FaCut className="text-3xl" />,
      title: "General Surgery",
      description: "Comprehensive surgical services for a wide range of conditions. Our general surgeons are skilled in both minimally invasive and traditional surgical techniques.",
      features: [
        "Laparoscopic surgery",
        "Emergency surgery",
        "Hernia repair",
        "Gallbladder surgery"
      ]
    },
    {
      icon: <FaHeartbeat className="text-3xl" />,
      title: "Internal Medicine",
      description: "Comprehensive care for adult patients with focus on prevention, diagnosis, and treatment of internal diseases. Our internists manage complex medical conditions and coordinate care.",
      features: [
        "Chronic disease management",
        "Preventive care",
        "Health screenings",
        "Medication management"
      ]
    },
    {
      icon: <FaProcedures className="text-3xl" />,
      title: "Operating Theatre",
      description: "State-of-the-art surgical facilities equipped with the latest technology. Our operating theatres maintain the highest standards of safety and sterility for all surgical procedures.",
      features: [
        "Advanced surgical equipment",
        "Sterile environments",
        "Experienced surgical teams",
        "Post-operative care"
      ]
    }
  ];

  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Medical Services</h1>
          <p className="text-xl opacity-90">Comprehensive healthcare services delivered by expert medical professionals</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-800">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a 
                    href="/appointment" 
                    className="inline-block bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    Book Appointment
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-16 bg-gradient-to-r from-red-700 to-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
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
      </section>
    </div>
  );
};

export default Services;