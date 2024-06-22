const bodyParser = require('bodyParser');
const cors = require('cors');
const mongoose = require('mongoose');
const videos = require('./routes/video');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({extendes : true}));
app.use(express.json());
app.use('/videos', videos);

require('costum-env').env(process.env.NODE_ENV, './config');
mongoose.connect(process.env.CONNECTION_STRING,
    {   useNewParser: true,
        useUnifiedTopology: true });
        
app.listen(8200);