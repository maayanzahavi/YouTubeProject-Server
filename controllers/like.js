const likeService = require("../services/like");
const jwt = require("jsonwebtoken");
const key = "I<3DuaLipa";

//if the user liked the video, return true. else, return false
const isLiked = async (req, res) => {
  console.log("reach isLiked ");
  if (req.headers.authorization) {
    console.log("authorization passed");
    const token = req.headers.authorization.split(" ")[1];
    console.log("token: ", token);
    try {
      console.log("reached try");
        const data = jwt.verify(token, key);
        console.log("data: ", data);
        const userEmail = data.email;
        const pid = req.params.pid;
        console.log("userEmail in likecontroller: ", userEmail);
        const isLiked = await likeService.isLiked(userEmail, pid);
        if (isLiked) {
          return res.status(200).json( true );
        } else {
          return res.status(404).json(false );
        }
    } catch {

    }
  }
};

//if the user liked, unlike and vice versa
const setLikes = async (req, res) => {
  const userEmail = req.body.userEmail;
  const pid = req.params.pid;
  console.log("controller userEmail", userEmail);
  const updatedVideo = await likeService.setLikes(userEmail, pid);
  if (updatedVideo) {
    return res.status(200).json( updatedVideo );
  } else {
    return res.status(404).json({ error: "video/user not found" });
  }
};

module.exports = { isLiked, setLikes };
