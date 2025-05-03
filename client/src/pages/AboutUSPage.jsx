import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";

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
  return (
    <div className="bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="h-1/4 flex flex-col justify-center text-center py-8 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 shadow-lg">
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
          className="text-lg font-light max-w-xl mx-auto"
        >
          A futuristic peer-to-peer skill exchange platform, connecting learners
          and experts worldwide.
        </motion.p>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900 p-6 rounded-2xl shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
          <p className="text-gray-300">
            To empower individuals to grow through collaborative learning and
            skill-sharing communities.
          </p>
        </motion.div>

        <motion.div
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900 p-6 rounded-2xl shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
          <p className="text-gray-300">
            A global network where anyone can teach and learn any
            skill—seamlessly, affordably, and quickly.
          </p>
        </motion.div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 px-6 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-10">Meet the Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 p-4 rounded-xl text-center shadow-lg"
            >
              <div className="h-40 w-40 mx-auto rounded-full overflow-hidden mb-4 border-2 border-gray-600">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-400">{member.role}</p>
              <div className="flex justify-center gap-4 mt-3">
                <a href={member.linkedin} target="_blank" rel="noreferrer">
                  <FaLinkedin
                    className="text-blue-400 hover:text-blue-500"
                    size={20}
                  />
                </a>
                <a href={member.github} target="_blank" rel="noreferrer">
                  <FaGithub
                    className="text-gray-400 hover:text-white"
                    size={20}
                  />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-center text-white">
        <h2 className="text-4xl font-extrabold mb-4">
          Join the Skill Revolution
        </h2>
        <p className="mb-6 text-lg">
          Start teaching, learning, and growing with the global SkillSwap
          community.
        </p>
        <button className="bg-white text-indigo-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
          Explore Skills
        </button>
      </section>
    </div>
  );
};

export default AboutUsPage;
