import React, { useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";

// Importing components
import Navbar from "../components/navbar/Navbar"; // Import the Navbar component
import Footer from "../components/footer/Footer";
import Background from "../components/background/Background";
import "../components/background/Background.css";

// Importing images
import ahmadImg from "../assets/ahmad.jpg";
import wahajImg from "../assets/wahaj.jpg";
import miraalImg from "../assets/miraal.jpg";
import muneebImg from "../assets/muneeb.jpg";

// Team data with images
const team = [
  {
    name: "Ahmad Wyne",
    role: "Backend Developer",
    image: ahmadImg,
    linkedin: "https://www.linkedin.com/in/ahmad-wyne-179511253/",
    github: "https://github.com/ahmadwyne",
  },
  {
    name: "Wahaj Asif",
    role: "Frontend Developer",
    image: wahajImg,
    linkedin: "https://www.linkedin.com/in/muhammad-wahaj-asif-7a9118254/",
    github: "https://github.com/coderwahaj",
  },
  {
    name: "Miraal Fatima",
    role: "Frontend Developer",
    image: miraalImg,
    linkedin: "https://www.linkedin.com/in/miraal-fatima-/",
    github: "https://github.com/MiraalFatima",
  },
  {
    name: "Muhammad Muneeb",
    role: "Backend Developer",
    image: muneebImg,
    linkedin: "https://www.linkedin.com/in/muhammad-muneeb-147322247/",
    github: "https://github.com/themuneeeb",
  },
];

const AboutUsPage = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="text-white">
      {/* Navbar */}
      <Navbar />

      <div
        className="home-hero"
        style={{
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Hero Section */}
        <Background />

        <div />
        <section className="h-1/4 flex flex-col justify-center text-center py-8 px-4 ">
          <motion.h1
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-3"
          >
            About SkillSwap
          </motion.h1>
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-lg font-semibold italic font-light max-w-xl mx-auto"
          >
            A futuristic peer-to-peer skill exchange platform, connecting
            learners and experts worldwide.
          </motion.p>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 px-6 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Mission Block */}
          <div>
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20"
            >
              <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
              <p className="text-white ">
                To empower individuals to grow through collaborative learning
                and skill-sharing communities.
              </p>
            </motion.div>
          </div>

          {/* Vision Block */}
          <div>
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20"
            >
              <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
              <p className="text-white">
                A global network where anyone can teach and learn any
                skill—seamlessly, affordably, and quickly.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section
          id="team"
          className="py-16 px-6 bg-gradient-to-r from-blue-550 via-blue-450 to-white"
        >
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">
            Meet the Team
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white/70 p-6 rounded-xl text-center shadow-lg border border-blue-500"
              >
                <div className="h-40 w-40 mx-auto rounded-full overflow-hidden mb-4 border-2 border-blue-500">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-sm text-blue-500">{member.role}</p>
                <div className="flex justify-center gap-4 mt-3">
                  <a href={member.linkedin} target="_blank" rel="noreferrer">
                    <FaLinkedin
                      className="text-blue-500 hover:text-blue-600"
                      size={20}
                    />
                  </a>
                  <a href={member.github} target="_blank" rel="noreferrer">
                    <FaGithub
                      className="text-gray-500 hover:text-gray-700"
                      size={20}
                    />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-white-300 via-blue-500 to-blue-400 text-center text-white">
          <h2 className="text-4xl font-extrabold mb-4">
            Join the Skill Revolution
          </h2>
          <p className="mb-6 text-lg italic">
            Start teaching, learning, and growing with the global SkillSwap
            community.
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
            Explore Skills
          </button>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default AboutUsPage;
