const videoService = require('../services/video');

const createVideo = async (req, res) => {

    const newVideo = await videoService.createVideo(
        req.body.title,
        req.body.description,
        req.body.img,
        req.body.video,
        req.body.owner
    );
    if (newVideo) {
        return res.status(200).json(newVideo);;
    } else {
        return res.status(500).json({ error: "Failed to create video" });
    }
};

const updateVideo = async (req, res) => {
    const video = await videoService.updateVideo(
        req.params.pid, 
        req.body.title, 
        req.body.description, 
        req.body.img,
    );
    if (!video) {
        return res.status(404).json({ errors: ['Video not found'] });
    }
    return res.status(200).json({ message: "User has been updated" });
}

const deleteVideo = async (req, res) => {
    const video = await videoService.deleteVideo(req.params.id, req.params.pid);
    if (!video) {
        return res.status(404).json({ errors: ['Video not found'] });
    }
    return res.status(200).json({ message: "User has been deleted" });
}

// Get all videos
const getVideos = async (req, res) => {
    try {
        const videos = await videoService.getVideos();
        if (!videos) {
            return res.status(404).json({ error: "Couldn't get videos" });
        }
        return res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        return res.status(500).json({ error: 'Error fetching videos' });
    }
}

// Get 10 most popular videos + 10 random videos
const getTrendingVideos = async (req, res) => {
    try {
        const videos = await videoService.getTrendingVideos();
        if (!videos) {
            return res.status(404).json({ error: "Couldn't get videos" });
        }
        return res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        return res.status(500).json({ error: "Error fetching videos" });
    }
}

const getVideoById = async (req, res) => {
    const video = await videoService.getVideoById(req.params.pid);
    if (!video) {
        return res.status(404).json({ error: "Video not found" });
    }
    return res.status(200).json(video);
}

module.exports = {createVideo, updateVideo, deleteVideo, getVideos, getTrendingVideos, getVideoById}
