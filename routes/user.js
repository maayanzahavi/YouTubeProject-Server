const userController = require("../controllers/user");
const videoController = require("../controllers/video");
const tokenModel = require("../models/token.js");

const express = require("express");
var router = express.Router();

router.route("/:id").get(userController.getUserByEmail);

router.route("/:id/videos").get(userController.getUserVideos);

router.route("/:id/videos/:pid").get(videoController.getVideoById);

module.exports = router;