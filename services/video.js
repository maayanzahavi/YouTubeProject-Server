const Video = require('../models/video'); 

const createVideo = async (title, img, video, description, owner) => {
    const newVideo = new Video({ title, img, video, description, owner });
    return await newVideo.save();
}

const getVideoById = async (id) => {
    console.log("getVideoById...");
    return await Video.findById(id);
};

const getVideos = async () => {
    const videos = await Video.find({});
    return videos;
};

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
}

const deleteVideo = async (id) => {
    const video = await getVideoById(id);
    if (!video) {
        return null;
    }
    video.deleteOne();
    return video;
}


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
