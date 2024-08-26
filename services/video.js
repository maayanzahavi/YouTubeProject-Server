const Video = require('../models/video');
const Comment = require('../models/comment');
const User = require('../models/user');
const userService = require('./user');
const video = require('../models/video');

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

// Converts an array of video IDs to video objects based on the provided list of all videos
const convertIdsToVideos = async (videoIds, allVideos) => {
  console.log("videoIds: ", videoIds);

  // Map each video ID to its corresponding video object from the list of all videos
  const videoList = videoIds.map(id => allVideos.filter(video => video._id === id));
  
  console.log("video list: ", videoList);
  return videoList;
};

const filterRecommendations = async (recommendations) => {
  try {
    // Parse the recommendations if they are in string format
    if (typeof recommendations === 'string') {
      recommendations = JSON.parse(recommendations);
    }

    console.log("Recommendations in filter: ", recommendations);

    // Check if recommendations contain invalid entries like "[]"
    recommendations = recommendations.filter(videoId => videoId !== "[]");

    // Convert recommendation IDs to video objects using getVideoById
    let videoList = [];
    for (const videoId of recommendations) {
      try {
        const video = await getVideoById(videoId);  // Attempt to retrieve the video
        if (video) {
          videoList.push(video);  // Add valid videos to the list
        }
      } catch (error) {
        console.warn(`Failed to retrieve video for ID: ${videoId}`);
      }
    }

    console.log("Converted recommendations: ", videoList);

    // If the videoList has more than 10 videos, keep the 10 most viewed
    if (videoList.length > 10) {
      videoList.sort((a, b) => b.views - a.views); // Sort by views descending
      videoList = videoList.slice(0, 10);          // Keep only the top 10
    }

    // If the videoList has fewer than 6 videos, add random videos
    if (videoList.length < 6) {
      const allVideos = await getVideos();
      console.log("All videos: ", allVideos);

      // Filter out videos that are already recommended
      const availableVideos = allVideos.filter(video => !videoList.includes(video));
      console.log("Available videos for recommendation: ", availableVideos);

      // Shuffle and select enough random videos to make the total 6
      const randomVideos = availableVideos
        .sort(() => 0.5 - Math.random())   // Shuffle the available videos
        .slice(0, 6 - videoList.length);   // Pick as many as needed to reach 6
      console.log("Random videos: ", randomVideos);

      // Add random videos to recommendations
      videoList.push(...randomVideos);
    }

    console.log("Final recommendations: ", videoList);
    return videoList; // Return the final list of video objects
  } catch (error) {
    console.error('Error in filterRecommendations:', error.message);
    return recommendations; // Return original recommendations even in case of an error
  }
};



module.exports = { createVideo, getVideos, getTrendingVideos, getVideoById, updateVideo, deleteVideo, filterRecommendations};
