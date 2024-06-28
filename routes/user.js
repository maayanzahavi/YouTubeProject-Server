const userController = require("../controllers/user");
const videoController = require("../controllers/video");
const commentController = require("../controllers/comment");
const likeController = require("../controllers/like");
const viewController = require("../controllers/view");
const tokenModel = require("../models/token.js");
const express = require("express");
var router = express.Router();

router.route("/:id")
  .get(userController.getUserByEmail)
  .put(tokenModel.isLoggedIn ,userController.updateUser)
  .delete(tokenModel.isLoggedIn, userController.deleteUser);

router.route("/:id/videos")
  .get(userController.getUserVideos)
  .post(videoController.createVideo);

router.route('/')
  .post(userController.createUser);

router.route("/:id/videos/:pid")
    .get(videoController.getVideoById)
    .patch(videoController.updateVideo)
    .delete(videoController.deleteVideo);
  
router.route("/:id/videos/:pid/comments")
    .post(tokenModel.isLoggedIn, commentController.createComment)
    .get(tokenModel.isLoggedIn, commentController.getComments);

  router.route("/:id/videos/:pid/likes")
    .patch(likeController.setLikes);
    
  router.route("/:id/videos/:pid/likes/:uid")
    .get(likeController.isLiked)

  router.route("/:id/videos/:pid/views")
    .patch(viewController.updateViews);
  
  router.route("/:id/videos/:pid/comments/:cid")
    .delete(tokenModel.isLoggedIn, commentController.deleteComment)
    .patch(tokenModel.isLoggedIn, commentController.editComment);

module.exports = router;