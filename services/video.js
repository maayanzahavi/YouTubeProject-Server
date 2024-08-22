const Video = require('../models/video');
const Comment = require('../models/comment');
const User = require('../models/user');
const userService = require('./user');

const createVideo = async (title, description, img, video, owner) => {
    try {
      const newVideo = new Video({
        title,
        description,
        img,
        video,
        owner
      });
  
      if (await addVideoToUser(newVideo, owner)) {
        return await newVideo.save();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error in videoService.createVideo:', error.message);
      return null;
    }
  };
  
const addVideoToUser = async (video, email) => {
    try {
        const user = await userService.getUserByEmail(email);
        if (user) {
            user.videos.push(video._id);
            await user.save();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error in addVideoToUser:', error.message);
        return false;
    }
};

const getVideoById = async (id) => {
    return await Video.findById(id);
};

const getVideos = async () => {
    return await Video.find({});
};

const deleteVideo = async (userId, videoId) => {
    try {
        const video = await Video.findById(videoId).populate('comments');
        if (video && video.owner == userId) {
            await Video.findOneAndDelete({ _id: videoId });
            await Comment.deleteMany({ _id: { $in: video.comments.map(comment => comment._id) } });
            return removeVideoFromOwner(userId, videoId);
        }
        return false;
    } catch (error) {
        console.error('Error in deleteVideo:', error.message);
        return false;
    }
};

const removeVideoFromOwner = async (userId, videoId) => {
    try {
        await User.updateOne({ email: userId }, { $pull: { videos: videoId } });
        return true;
    } catch (error) {
        console.error('Error in removeVideoFromOwner:', error.message);
        return false;
    }
};

const updateVideo = async (id, title, description, img) => {
  try {
    const video = await Video.findById(id);
    if (!video) {
      return null;
    }

    video.title = title || video.title;
    video.description = description || video.description;
    video.img = img || video.img;

    await video.save();
    return video;
  } catch (error) {
    throw new Error('Failed to update video: ' + error.message);
  }
};

const getTrendingVideos = async () => {
    try {
        const allVideos = await getVideos();
        const top10Videos = allVideos.sort((a, b) => b.views - a.views).slice(0, 10);
        const random10Videos = allVideos.sort(() => 0.5 - Math.random()).slice(10, 20);
        return [...top10Videos, ...random10Videos].sort(() => 0.5 - Math.random());
    } catch (err) {
        throw new Error('Server Error');
    }
};

const filterRecommendations = async (recommendations) => {
  try {
    // Fetch all available videos from the database (do this only once)
    const allVideos = await getVideos();
    console.log("all videos: ", allVideos);

    // If the recommendations array has more than 10 videos, keep the 10 most viewed
    if (recommendations.length > 10) {
      recommendations.sort((a, b) => b.views - a.views);
      recommendations = recommendations.slice(0, 10);
    }

    // If the recommendations array has fewer than 6 videos, add random videos
    if (recommendations.length < 6) {
      const recommendedVideoIds = new Set(recommendations.map(video => video._id));
      console.log("recommendationVideos: ", recommendedVideoIds);

      // Filter out videos that are already recommended
      const availableVideos = allVideos.filter(video => !recommendedVideoIds.has(video._id));
      console.log("available: ", availableVideos);

      // Shuffle and select enough random videos to make the total 6
      const randomVideos = availableVideos
        .sort(() => 0.5 - Math.random())
        .slice(0, 6 - recommendations.length);
      console.log("random vidoes: ", randomVideos);


      // Add random videos to recommendations
      recommendations.push(...randomVideos);
    }
    console.log("recommendations: ", recommendations);
    return recommendations;
  } catch (error) {
    console.error('Error in filterRecommendations:', error.message);
    return recommendations;
  }
};

module.exports = { createVideo, getVideos, getTrendingVideos, getVideoById, updateVideo, deleteVideo, filterRecommendations};
