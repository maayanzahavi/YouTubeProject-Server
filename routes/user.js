const userController = require("../controllers/user");
const videoController = require("../controllers/video");
const tokenModel = require("../models/token.js");

const express = require("express");
var router = express.Router();

router.route("/:id").get(userController.getUserByEmail);

router.route("/:id").put(tokenModel.isLoggedIn ,userController.updateUser);

router.route("/:id").delete(tokenModel.isLoggedIn, userController.deleteUser);

router.route("/:id/videos").get(userController.getUserVideos);

router.route('/').post(userController.createUser);

router.route("/:id/videos/:pid").get(videoController.getVideoById);

module.exports = router;