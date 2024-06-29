const videoService = require("./video");

// Check if the user liked the video
const isLiked = async (userEmail, pid) => {
  try {
    const video = await videoService.getVideoById(pid);
    console.log("video isLiked:", video);
    if (video && Array.isArray(video.likedBy)) {
        return video.likedBy.includes(userEmail);
    } else {
        return false; 
    }
  } catch (error) {
    console.log("failed in catch isLiked");
    return false;
  }
};

//if the user liked the video, unlike
const setLikes = async (userEmail, pid) => {
    console.log("service userEmail", userEmail);
  try {
    const didLike = await isLiked(userEmail, pid);
    console.log("passed is liked");
    const video = await videoService.getVideoById(pid);
    console.log("passed video");
    if (!video) {
        console.log("failed in video");
        return false;
    }
    if (didLike) {
        // Remove user email from the video likes array
        video.likedBy.pull(userEmail);
        video.likes--;
        await video.save();
    } else {
        // Add user email to the video likes array
        video.likedBy.push(userEmail);
        video.likes++;
        await video.save();
    }
    return true;
  } catch (error) {
    console.log("failed in catch");
    return false;
  }
};

module.exports = { isLiked, setLikes };
