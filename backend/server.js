// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const dotenv = require('dotenv');
// // const http = require('http');
// // const socketIo = require('socket.io');
// // const path = require('path');
// // const multer = require('multer');
// // const fs = require('fs');

// // const uploadDir = path.join(__dirname, 'uploads');
// // if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// // // Multer storage
// // const storage = multer.diskStorage({
// //   destination: (_req, _file, cb) => cb(null, uploadDir),
// //   filename: (req, file, cb) => {
// //     // e.g. admin-1623456789012.png or userId-...
// //     const ext = path.extname(file.originalname);
// //     cb(null, `${req.user.id}-${Date.now()}${ext}`);
// //   }
// // });
// // const upload = multer({ storage });

// // // Import routes and controllers
// // const authRoutes = require('./routes/authRoutes');
// // const userRoutes = require('./routes/userRoutes');
// // const matchRoutes = require('./routes/matchRoutes');
// // const sessionRoutes = require('./routes/sessionRoutes');
// // const notificationRoutes = require('./routes/notificationRoutes');
// // const { setSocketIO: setSessionSocketIO } = require('./controllers/sessionController');
// // const { setSocket: setNotificationSocketIO } = require('./controllers/notificationController');
// // const adminRoutes = require('./routes/adminRoutes');  // ← Admin dashboard routes

// // dotenv.config();

// // const app = express();
// // const server = http.createServer(app);

// // // ✅ Create Socket.IO instance ONCE
// // const io = socketIo(server, {
// //   cors: {
// //     origin: 'http://localhost:5173',
// //     methods: ['GET', 'POST'],
// //     allowedHeaders: ['Content-Type'],
// //     credentials: true,
// //   },
// // });

// // // ✅ Create namespaces from single instance
// // const sessionSocket = io.of('/sessions');
// // const notificationSocket = io.of('/notifications');

// // // Pass the socket instances to controllers
// // setSessionSocketIO(sessionSocket);
// // setNotificationSocketIO(notificationSocket);

// // // Express Middleware
// // app.use(express.json());
// // app.use(cors());

// // // MongoDB connection
// // mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// // .then(async () => {
// //   console.log('Connected to MongoDB');

// //   // ─── Seed admin user ─────────────────────────────
// //   const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
// //   let admin = await User.findOne({ email: ADMIN_EMAIL });
// //   if (!admin) {
// //     const salt = await bcrypt.genSalt(10);
// //     const hash = await bcrypt.hash(ADMIN_PASSWORD, salt);
// //     admin = new User({
// //       name: ADMIN_NAME || 'Administrator',
// //       email: ADMIN_EMAIL,
// //       password: hash,
// //       role: 'admin'
// //     });
// //     await admin.save();
// //     console.log('🚀 Admin user seeded:', ADMIN_EMAIL);
// //   }
// // })
// // .catch(err => console.log('Error connecting to MongoDB:', err));

// // // Routes
// // app.use('/api/auth', authRoutes);
// // app.use('/api/users', userRoutes);
// // app.use('/api/matches', matchRoutes);
// // app.use('/api/sessions', sessionRoutes);
// // app.use('/api/notifications', notificationRoutes);
// // app.use('/api/admin', adminRoutes);  // ← Mount Admin Dashboard routes

// // // Serve uploads statically
// // app.use('/uploads', express.static(uploadDir));

// // // ... later, mount routes
// // app.use('/api/admin', upload.single('profilePicture'), adminRoutes);

// // // ✅ Session namespace handling
// // sessionSocket.on('connection', (socket) => {
// //   console.log('A user connected to session socket');

// //   socket.on('disconnect', () => {
// //     console.log('A user disconnected from session socket');
// //   });
// // });

// // // ✅ Notification namespace handling
// // notificationSocket.on('connection', (socket) => {
// //   console.log('A user connected to notification socket');
  
// //   socket.on('disconnect', () => {
// //     console.log('A user disconnected from notification socket');
// //   });
// // });

// // // Default route
// // app.get('/', (req, res) => {
// //   res.send('SkillSwap API is running');
// // });

// // // Start the server
// // const port = process.env.PORT || 5000;
// // server.listen(port, () => {
// //   console.log(`Server running on port ${port}`);
// // });

// // server.js

// const express    = require('express');
// const mongoose   = require('mongoose');
// const cors       = require('cors');
// const dotenv     = require('dotenv');
// const http       = require('http');
// const socketIo   = require('socket.io');
// const path       = require('path');
// const multer     = require('multer');
// const fs         = require('fs');

// // ─── MISSING IMPORTS ───────────────────────────────────────────────
// const bcrypt = require('bcryptjs');
// const User   = require('./models/User');

// dotenv.config();

// const app    = express();
// const server = http.createServer(app);
// const io     = socketIo(server, {
//   cors: {
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type'],
//     credentials: true,
//   },
// });

// // ─── SOCKET.IO NAMESPACES ─────────────────────────────────────────
// const { setSocketIO: setSessionSocketIO }       = require('./controllers/sessionController');
// const { setSocket: setNotificationSocketIO }    = require('./controllers/notificationController');
// const sessionSocket      = io.of('/sessions');
// const notificationSocket = io.of('/notifications');
// setSessionSocketIO(sessionSocket);
// setNotificationSocketIO(notificationSocket);

// // ─── MULTER SETUP ─────────────────────────────────────────────────
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, uploadDir),
//   filename:     (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${req.user.id}-${Date.now()}${ext}`);
//   }
// });
// const upload = multer({ storage });

// // ─── MIDDLEWARE ───────────────────────────────────────────────────
// app.use(express.json());
// app.use(cors());

// // ─── MONGODB CONNECTION & ADMIN SEEDING ───────────────────────────
// mongoose
//   .connect(process.env.MONGO_URI)  // new driver ignores useNewUrlParser/Topology flags
//   .then(async () => {
//     console.log('Connected to MongoDB');

//     // Seed admin record if missing
//     const {
//       ADMIN_EMAIL,
//       ADMIN_PASSWORD,
//       ADMIN_NAME,
//       ADMIN_PIC_URL
//     } = process.env;

//     let admin = await User.findOne({ email: ADMIN_EMAIL });
//     if (!admin) {
//       const salt = await bcrypt.genSalt(10);
//       const hash = await bcrypt.hash(ADMIN_PASSWORD, salt);
//       admin = new User({
//         name:           ADMIN_NAME || 'Administrator',
//         email:          ADMIN_EMAIL,
//         password:       hash,
//         role:           'admin',
//         profilePicture: ADMIN_PIC_URL || ''
//       });
//       await admin.save();
//       console.log('🚀 Admin user seeded:', ADMIN_EMAIL);
//     }
//   })
//   .catch(err => console.error('Error connecting to MongoDB:', err));

// // ─── STATIC FILES ─────────────────────────────────────────────────
// app.use('/uploads', express.static(uploadDir));

// // ─── ROUTES ────────────────────────────────────────────────────────
// app.use('/api/auth',           require('./routes/authRoutes'));
// app.use('/api/users',          require('./routes/userRoutes'));
// app.use('/api/matches',        require('./routes/matchRoutes'));
// app.use('/api/sessions',       require('./routes/sessionRoutes'));
// app.use('/api/notifications',  require('./routes/notificationRoutes'));

// // Mount admin routes *once*, with multer to handle `profilePicture` uploads
// app.use('/api/admin', upload.single('profilePicture'), require('./routes/adminRoutes'));

// // ─── SOCKET.IO CONNECTION HANDLERS ────────────────────────────────
// sessionSocket.on('connection', socket => {
//   console.log('A user connected to session socket');
//   socket.on('disconnect', () => console.log('A user disconnected from session socket'));
// });

// notificationSocket.on('connection', socket => {
//   console.log('A user connected to notification socket');
//   socket.on('disconnect', () => console.log('A user disconnected from notification socket'));
// });

// // ─── DEFAULT ROUTE & SERVER START ─────────────────────────────────
// app.get('/', (_req, res) => res.send('SkillSwap API is running'));

// const port = process.env.PORT || 5000;
// server.listen(port, () => console.log(`Server running on port ${port}`));


// server.js

const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');
const http       = require('http');
const socketIo   = require('socket.io');
const path       = require('path');
const multer     = require('multer');
const fs         = require('fs');

// ─── MISSING IMPORTS ───────────────────────────────────────────────
const bcrypt = require('bcryptjs');
const User   = require('./models/User');

dotenv.config();

const app    = express();
const server = http.createServer(app);
const io     = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

// ─── SOCKET.IO NAMESPACES ─────────────────────────────────────────
const { setSocketIO: setSessionSocketIO }       = require('./controllers/sessionController');
const { setSocket: setNotificationSocketIO }    = require('./controllers/notificationController');
const sessionSocket      = io.of('/sessions');
const notificationSocket = io.of('/notifications');
setSessionSocketIO(sessionSocket);
setNotificationSocketIO(notificationSocket);

// ─── MULTER SETUP ─────────────────────────────────────────────────
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:     (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user?.id || 'admin'}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// ─── MIDDLEWARE ───────────────────────────────────────────────────
app.use(express.json());
app.use(cors());

// ─── MONGODB CONNECTION & ADMIN SEEDING ───────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    const {
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      ADMIN_NAME,
      ADMIN_PIC_URL
    } = process.env;

    let admin = await User.findOne({ email: ADMIN_EMAIL });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(ADMIN_PASSWORD, salt);
      admin = new User({
        name:           ADMIN_NAME || 'Administrator',
        email:          ADMIN_EMAIL,
        password:       hash,
        role:           'admin',
        profilePicture: ADMIN_PIC_URL || ''
      });
      await admin.save();
      console.log('🚀 Admin user seeded:', ADMIN_EMAIL);
    }
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// ─── STATIC FILES ─────────────────────────────────────────────────
app.use('/uploads', express.static(uploadDir));

// ─── ROUTES ────────────────────────────────────────────────────────
app.use('/api/auth',           require('./routes/authRoutes'));
app.use('/api/users',          require('./routes/userRoutes'));
app.use('/api/matches',        require('./routes/matchRoutes'));
app.use('/api/sessions',       require('./routes/sessionRoutes'));
app.use('/api/notifications',  require('./routes/notificationRoutes'));
app.use('/api/admin',          upload.single('profilePicture'), require('./routes/adminRoutes'));

// ─── SOCKET.IO CONNECTION HANDLERS ────────────────────────────────
sessionSocket.on('connection', socket => {
  console.log('A user connected to session socket');
  socket.on('disconnect', () => console.log('A user disconnected from session socket'));
});

notificationSocket.on('connection', socket => {
  console.log('A user connected to notification socket');
  socket.on('disconnect', () => console.log('A user disconnected from notification socket'));
});

// ─── DEFAULT ROUTE & SERVER START ─────────────────────────────────
app.get('/', (_req, res) => res.send('SkillSwap API is running'));

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port ${port}`));
