const userController = require("../controllers/user");
const videoController = require("../controllers/video");
const tokenModel = require("../models/token.js");

const express = require("express");
const video = require("../models/video.js");
var router = express.Router();

router.route("/:id").get(userController.getUserByEmail);

router.route("/:id/videos").get(userController.getUserVideos);

router.route('/').post(userController.createUser);

router.route("/:id/videos/:pid")
    .get(videoController.getVideoById)
    .patch(videoController.updateVideo);

module.exports = router;