const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const videos = require('./routes/video');
const users = require('./routes/user');
const tokensRouter = require('./routes/token');
const customEnv = require('custom-env');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

customEnv.env(process.env.NODE_ENV, './config');

mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Connecting to routers
app.use('/api/videos', videos);
//app.use('/api/users', users);
app.use('/api/tokens', tokensRouter);

// Port listening to
app.listen(process.env.PORT);