const Video = require('../models/video'); 

const createVideo = async (title, img, video, description, owner) => {
    const newVideo = new Video({ title, img, video, description, owner });
    return await newVideo.save();
}

const getVideoById = async (id) => {
    return await Video.findById(id);
};

const getVideos = async () => {
    return await Video.find({});

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
        const allVideos = getVideos();
        const top10Videos = allVideos.sort((a, b) => b.views - a.views).slice(0, 10);
        const random10Videos = allVideos.sort(() => 0.5 - Math.random()).slice(0, 10);
        
        const combinedVideos = [...new Set([...top10Videos, ...random10Videos])].sort(() => 0.5 - Math.random()).slice(0, 20);
    
        res.json(combinedVideos);
      } catch (err) {
        res.status(500).send('Server Error');
      }
};


const getUserVideos = async (username) => {
    try {
        const allVideos = await getVideos();
        const userVideos = allVideos.filter(video => video.owner === username);
        return userVideos;
    } catch (err) {
        throw new Error('Server Error');
    }
};


module.exports = {  createVideo,
                    getVideos, 
                    getTrendingVideos, 
                    getVideoById, 
                    updateVideo, 
                    deleteVideo, 
                    getUserVideos }