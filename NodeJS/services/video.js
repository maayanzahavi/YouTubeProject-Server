const Video = require('../models/video'); 

const createVideo = async (title, img, video, description, owner) => {
    const video = new Video({ title, img, video, description, owner });
    return await video.save();
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

module.exports = { createVideo, getVideos, getVideoById, updateVideo, deleteVideo }