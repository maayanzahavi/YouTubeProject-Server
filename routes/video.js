const videoController = require('../controllers/video');
const express = require("express");
const router = express.Router();

router.route("/")
    .get(videoController.getTrendingVideos);

    router.route("/all")
    .get(videoController.getVideos);

module.exports = router;
