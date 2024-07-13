const videoService = require('../services/video');

const createVideo = async (req, res) => {
    try {
        const img = req.files['img'] ? `/${req.files['img'][0].path.replace(/\\/g, '/')}` : null;
        const video = req.files['video'] ? `/${req.files['video'][0].path.replace(/\\/g, '/')}` : null;
        const { title, description, owner } = req.body;

        console.log("Request body: ", req.body);
        console.log("Files: ", req.files);

        const newVideo = await videoService.createVideo(title, description, img, video, owner);
        if (newVideo) {
            console.log("entered video controller success");
            return res.status(200).json(newVideo);
        } else {
            throw new Error('Failed to create video');
        }
    } catch (error) {
        console.error('An error occurred in createVideo:', error.message);
        return res.status(500).json({ error: 'Failed to create video' });
    }
};

const updateVideo = async (req, res) => {
    const img = req.files['img'] ? `/${req.files['img'][0].path.replace(/\\/g, '/')}` : null;
    const { title, description } = req.body;
    const updatedVideo = await videoService.updateVideo(req.params.pid, title, description, img, video);
    if (!updatedVideo) {
        return res.status(404).json({ errors: ['Video not found'] });
    }
    return res.status(200).json({ message: "Video has been updated" });
};

const deleteVideo = async (req, res) => {
    const video = await videoService.deleteVideo(req.params.id, req.params.pid);
    if (!video) {
        return res.status(404).json({ errors: ['Video not found'] });
    }
    return res.status(200).json({ message: "User has been deleted" });
};

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
};

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
};

const getVideoById = async (req, res) => {
    const video = await videoService.getVideoById(req.params.pid);
    if (!video) {
        return res.status(404).json({ error: "Video not found" });
    }
    return res.status(200).json(video);
};

module.exports = { createVideo, updateVideo, deleteVideo, getVideos, getTrendingVideos, getVideoById };
