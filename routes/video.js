const videoController = require('../controllers/post');
const tokenModel = require("../models/token");

const express = require("express");
var router = express.Router();

router.route("/")
    .get(tokenModel.isLoggedIn, videoController.getVideos);


module.exports = router;



