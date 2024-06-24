const videoController = require('../controllers/video');
const express = require("express");
const router = express.Router();

router.route("/")
    .get(videoController.getTrendingVideos); // Removed tokenModel.isLoggedIn

module.exports = router;
