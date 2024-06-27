const Video = require('../models/video'); 
const Comment = require('../models/comment'); 
const User = require('../models/user'); 
const userController = require('../controllers/user'); 
const userService = require('./user'); 

const createVideo = async (title, description, img, video, owner) => {
    let newVideo = new Video({
        title, description, img, video, owner
    });
    console.log("createVideo email:", owner);
    if (await addVideoToUser(newVideo, owner))
        return await newVideo.save();
    return null;
}

async function addVideoToUser(video, email) {
    try {
        const user = await userService.getUserByEmail(email);
        console.log("getUserByEmail email:", email);
        console.log("getUserByEmail:", user);
        if (user) {
            user.videos.push(video._id);
            await user.save();
            console.log("Video saved at user");
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getVideoById = async (id) => {
    console.log("getVideoById...");
    return await Video.findById(id);
};

const getVideos = async () => {
    const videos = await Video.find({});
    return videos;
};

const deleteVideo = async (userId, videoId) => {
    try {
        const video = await Video.findById(videoId).populate('comments');;
        // Make sure the user ia authorised to delete this post
        if (video && video.owner == userId) {
            await Video.findOneAndDelete({ _id: videoId });
            const commentIds = video.comments.map(comment => comment._id);
            await Comment.deleteMany({ _id: { $in: commentIds } });
            return removeVideoFromOwner(userId, videoId);
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
};

async function removeVideoFromOwner(userId, videoId) {
    try {
        await User.updateOne(
            { userId }, 
            { $pull: { videos: videoId } }) 
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const updateVideo = async (id, title, description, img) => {
    const video = await getVideoById(id);
    if (!video) {
        return null;
    }
    video.title = title;
    video.description = description;
    video.img = img;
    await video.save();
    return video;
};


const getTrendingVideos = async () => {
    try {
        const allVideos = await getVideos(); // Ensure await is used
        // Get top 10 videos
        const sortedVideos = allVideos.sort((a, b) => b.views - a.views);
        const top10Videos = sortedVideos.slice(0, 10);

        // Randomly choose 10 videos out of the remaning videos
        const remainingVideos = sortedVideos.slice(10);
        const random10Videos = remainingVideos.sort(() => 0.5 - Math.random()).slice(0, 10);

        // Combine the top 10 videos and the 10 random videos
        const combinedVideos = [...top10Videos, ...random10Videos].sort(() => 0.5 - Math.random());
        return combinedVideos;
    } catch (err) {
        throw new Error('Server Error');
    }
};



module.exports = {  
    createVideo,
    getVideos, 
    getTrendingVideos, 
    getVideoById, 
    updateVideo, 
    deleteVideo,  
};
