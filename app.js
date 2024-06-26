const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const videos = require('./routes/video');
const users = require('./routes/user');
const tokensRouter = require('./routes/token');
require('dotenv').config({ path: './config/.env.local' });

const app = express();

app.use(cors());
app.use(express.static('public'));


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
