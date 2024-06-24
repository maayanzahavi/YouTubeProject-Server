const videoController = require('../controllers/video');
const tokenModel = require("../models/token");

const express = require("express");
const router = express.Router();

router.route("/")
    .get(videoController.getVideos);

module.exports = router;