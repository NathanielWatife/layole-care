const Features = () => {
    return (
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-user-md"></i>
              <h3>Expert Doctors</h3>
              <p>Highly qualified and experienced medical professionals</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-clock"></i>
              <h3>24/7 Emergency</h3>
              <p>Round-the-clock emergency medical services</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-microscope"></i>
              <h3>Modern Equipment</h3>
              <p>State-of-the-art medical technology and equipment</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-heart"></i>
              <h3>Compassionate Care</h3>
              <p>Patient-centered care with empathy and understanding</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Features;