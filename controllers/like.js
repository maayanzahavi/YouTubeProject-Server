const likeService = require("../services/like");

//if the user liked the video, return true. else, return false
const isLiked = async (req, res) => {
console.log("userEmail in likecontroller: ", userEmail);
  const userEmail = req.body.userEmail;
  const pid = req.params.pid;
  const isLiked = await likeService.isLiked(userEmail, pid);
  if (isLiked) {
    return res.status(200).json({ isLiked: true });
  } else {
    return res.status(200).json({ isLiked: false });
  }
};

//if the user liked, unlike and vice versa
const setLikes = async (req, res) => {
  const userEmail = req.body.userEmail;
  const pid = req.params.pid;
  console.log("controller userEmail", userEmail);
  const setLike = await likeService.setLikes(userEmail, pid);
  if (setLike) {
    return res.status(200).json({ message: "like has been set" });
  } else {
    return res.status(404).json({ error: "video/user not found" });
  }
};

module.exports = { isLiked, setLikes };
