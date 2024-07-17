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

module.exports = { createVideo, getVideos, getTrendingVideos, getVideoById, updateVideo, deleteVideo };
