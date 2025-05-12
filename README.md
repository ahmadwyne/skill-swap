---

# SkillSwap

## Project Overview

SkillSwap is a web-based platform where users can exchange skills instead of money. Users can list the skills they offer and the skills they want to learn, and the platform will recommend them suitable partners. This system creates a collaborative and cost-effective learning environment.

For instance, a web developer can offer to teach React.js in exchange for learning video editing from another user. The platform provides structured, yet flexible skill exchanges based on users' interests and availability.

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Installation](#installation)
5. [How to Use](#how-to-use)
6. [Contributing](#contributing)
7. [License](#license)

## Technologies Used

* **Frontend:**

  * React.js
  * Redux for state management
  * Vite for bundling
  * TailwindCSS for styling
  * Socket.io for real-time messaging
  * Framer Motion for animations

* **Backend:**

  * Node.js
  * Express.js
  * MongoDB for database
  * Mongoose for database interaction
  * JWT for authentication
  * bcrypt for password hashing
  * Multer for handling file uploads

## Features

1. **User Authentication**

   * Sign-in/Sign-up via email or social authentication
   * Role-based authentication

2. **User Profile & Skill Management**

   * Profile creation and updates
   * List skills users can teach and want to learn
   * Display user rating and past exchanges

3. **Skill Matching Algorithm**

   * Suggest users based on skill demand and availability
   * Uses an intelligent algorithm for optimized matching

4. **Real-Time Chat & Messaging System**

   * Real-time chat for communication
   * Session scheduling within the chat
   * Media sharing for learning materials

5. **Session Booking System**

   * Users can book and manage sessions
   * Calendar integration for scheduling
   * In-app notifications and reminders for sessions

6. **Peer Rating & Reviews**

   * Users can rate and review their exchange partners
   * Ensures quality control and prevents misuse

7. **Learning Progress Tracking**

   * Users can mark sessions as completed
   * Track progress and history
   * Personalized recommendations

8. **Admin Dashboard**

   * Admin controls to manage users, reports, and disputes
   * Monitor platform analytics and engagement statistics

## Getting Started

These instructions will guide you to set up and run the project locally. Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine. You will also need a code editor like [VS Code](https://code.visualstudio.com/).

### Prerequisites

1. Clone the repository:

   ```bash
   git clone https://github.com/ahmadwyne/skill-swap.git
   ```

2. Install dependencies for both the backend and frontend.

### Installation

1. **Backend Setup:**

   * Go to the backend directory:

     ```bash
     cd skill-swap/backend
     ```
   * Install the required dependencies:

     ```bash
     npm install
     ```

2. **Frontend Setup:**

   * Go to the frontend directory:

     ```bash
     cd skill-swap/client
     ```
   * Install the required dependencies:

     ```bash
     npm install
     ```

3. **Environment Variables:**

   * Create a `.env` file in `backend` directory with the following content:

     * For **backend**:

       ```
       MONGO_URI=<Your MongoDB URI>
       JWT_SECRET=<Your JWT Secret>
       ADMIN_EMAIL=<Your Admin Email>
       ADMIN_PASSWORD=<Your Admin Password>
       ```

### Running the Application

1. **Start the Backend:**

   * From the backend directory, run:

     ```bash
     npm start
     ```

2. **Start the Frontend:**

   * From the frontend directory, run:

     ```bash
     npm run dev
     ```

This will start both the backend and frontend locally. You can now open `http://localhost:5173` in your browser to access the SkillSwap application.

## How to Use

1. **Sign Up / Log In:**

   * Create a new account by signing up with your email, or log in using your existing account credentials.

2. **Profile Setup:**

   * Update your profile with skills you want to teach and learn.

3. **Skill Matching:**

   * Use the skill matching algorithm to find people you can teach or learn from.

4. **Real-Time Chat:**

   * Start chatting with your session partner. You can also send multimedia files such as images, videos, and audio.

5. **Session Booking & Management:**

   * Schedule a session directly through the chat interface and track your progress.

6. **Feedback and Reviews:**

   * After completing a session, provide feedback and a rating for your session partner.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
