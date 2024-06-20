const express = require('express');
const bodyParser = require('bodyParser');
const cors = require('cors');
const mongoose = require('mongoose');
const videos = require('./routes/video');

require('costum-env').env(process.env.NODE_ENV, './config');
mongoose.connect(process.env.CONNECTION_STRING,
                {   useNewParser: true,
                    useUnifiedTopology: true });

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extendes : true}));
app.use(express.json());
app.use('/videos', videos);
app.listen(process.env.PORT);
