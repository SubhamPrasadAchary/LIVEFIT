import React from 'react';
import ParticlesBackground from './components/ParticlesBackground';
import './App.css';

function App() {
  return (
    <div className="app">
      <ParticlesBackground />
      <div className="content">
        <div className="scanlines"></div>
        
        <header>
          <nav>
            <div className="nav-left">
              <button id="theme-toggle" className="theme-toggle" aria-label="Toggle dark mode">
                <i className="fas fa-moon"></i>
                <i className="fas fa-sun"></i>
              </button>
              <div className="logo">
                <i className="fas fa-heartbeat"></i>
                <span>LiveFit</span>
              </div>
            </div>
            <ul className="nav-links">
              <li><a href="#dashboard" className="active">Dashboard</a></li>
              <li><a href="#tracker">Meal Tracker</a></li>
              <li><a href="#nutrition">Nutrition</a></li>
              <li><a href="#profile">Profile</a></li>
            </ul>
            <div className="auth-buttons">
              <button className="btn btn-outline">Log In</button>
              <button className="btn btn-primary">Sign Up</button>
            </div>
          </nav>
        </header>

        <main>
          <section className="hero">
            <div className="hero-image">
              <img src="https://static.vecteezy.com/system/resources/previews/021/534/411/non_2x/healthy-food-on-old-wooden-background-concept-of-proper-nutrition-top-view-flat-lay-photo.jpg" alt="Healthy food illustration" />
            </div>
            <div className="hero-content">
              <h1>Track Your Nutrition, Transform Your Life</h1>
              <p>Monitor your daily food intake, count calories, and achieve your fitness goals with LiveFit.</p>
              <button className="btn btn-primary btn-lg">Get Started - It's Free</button>
            </div>
          </section>
        </main>

        <footer>
          <div className="footer-content">
            <div className="footer-section">
              <h4>LiveFit</h4>
              <p>Your personal nutrition and fitness companion.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="https://mail.google.com/mail/?view=cm&fs=1&to=nutrition.livefit@gmail.com&su=Contact%20Us%20-%20LiveFit%20Support&body=Hello%20LiveFit%20Team,%0D%0A%0D%0A" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Connect With Us</h4>
              <div className="social-links">
                <a href="https://www.facebook.com/profile.php?id=61584737936696" className="social-link" target="_blank" rel="noopener noreferrer nofollow"><i className="fab fa-facebook"></i></a>
                <a href="https://x.com/_Live_fit_" className="social-link" target="_blank" rel="noopener noreferrer nofollow" style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px'}}><svg viewBox="0 0 24 24" aria-hidden="true" style={{width: '20px', height: '20px', fill: 'currentColor'}}><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg></a>
                <a href="https://www.instagram.com/livefit_nutritionapp/" className="social-link" target="_blank" rel="noopener noreferrer nofollow"><i className="fab fa-instagram"></i></a>
                <a href="https://www.youtube.com/@LiveFitNutrition-d2i" className="social-link" target="_blank" rel="noopener noreferrer nofollow"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} LiveFit. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
