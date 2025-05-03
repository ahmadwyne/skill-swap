import React from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import Footer from "../components/footer/Footer";
import "./Home.css";
import bgImage from "../assets/auth-bg.jpg";

const Home = () => {
  return (
    <div
      className="home-hero"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="overlay" />

      <div className="hero-content">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Skill Swap
        </h1>
        <h1 className="hero-title text-white">– Connect, Learn, and Grow</h1>

        <p className="hero-subtitle">
          A platform where learners meet learners. <br />
          Share knowledge, teach others, and elevate your skills together.
        </p>

        <div className="cta-buttons">
          <Link to="/login" className="btn primary">
            <LogIn size={20} /> <span>Login</span>
          </Link>
          <Link to="/register" className="btn secondary">
            <UserPlus size={20} /> <span>Register</span>
          </Link>
        </div>
      </div>

      <section className="glass-panel">
        <div className="info-grid">
          <div>
            <h3>Discover Skills</h3>
            <p>
              Explore a wide range of topics offered by peers across the globe.
            </p>
          </div>
          <div>
            <h3>Find Your Match</h3>
            <p>Let smart matching pair you with ideal learning partners.</p>
          </div>
          <div>
            <h3>Grow Together</h3>
            <p>Teach what you know, learn what you love—side by side.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
