const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');  // Add this line
const videos = require('./routes/video');
const users = require('./routes/user');
const tokensRouter = require('./routes/token');
require('dotenv').config({ path: './config/.env.local' });
const multer = require('multer');

// Configure Multer for different file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.static('public'));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(bodyParser.json({ limit: '50mb' }));  
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

console.log('Connection String:', process.env.CONNECTION_STRING);
console.log('Port:', process.env.PORT);

mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

// Connecting to routers
app.use('/api/videos', videos);
app.use('/api/users', users);
app.use('/api/tokens', tokensRouter);

// Port listening to
app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}/`);
});
