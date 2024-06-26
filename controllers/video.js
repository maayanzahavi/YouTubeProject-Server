const videoService = require('../services/video');

const createVideo = async (req, res) => {
    res.json(await videoService.createVideo(
        req.body.title, 
        req.body.img, 
        req.body.video, 
        req.body.description, 
        req.body.owner
    ));
};

const updateVideo = async (req, res) => {
    const video = await videoService.updateVideo(
        req.params.pid, 
        req.body.title, 
        req.body.description, 
        req.body.img
    );
    if (!video) {
        return res.status(404).json({ errors: ['Video not found'] });
    }
    res.json(video);
}

const deleteVideo = async (req, res) => {
    const video = await videoService.deleteVideo(req.params.id, req.params.pid);
    if (!video) {
        return res.status(404).json({ errors: ['Video not found'] });
    }
    res.json(video);
}

const getVideos = async (req, res) => {
    try {
        const videos = await videoService.getVideos();
        console.log('Fetched videos:', videos); // Log the fetched videos
        res.json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Error fetching videos' });
    }
}

const getTrendingVideos = async (req, res) => {
    try {
        const videos = await videoService.getTrendingVideos();
        console.log('Fetched videos:', videos); // Log the fetched videos
        res.json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Error fetching videos' });
    }
}

const getVideoById = async (req, res) => {
    console.log("getVideoById in controller")
    const video = await videoService.getVideoById(req.params.pid);
    if (!video) {
        return res.status(404).json({ errors: ['Video not found'] });
    }
    res.json(video);
}

module.exports = {createVideo, updateVideo, deleteVideo, getVideos, getTrendingVideos, getVideoById}
