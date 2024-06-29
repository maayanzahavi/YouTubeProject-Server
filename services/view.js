const videoService = require("./video");

const updateViews = async (id) => {
    const video = await videoService.getVideoById(id);
    if (!video) {
        return null;
    }
    video.views++;
    await video.save();
    return video;
};

module.exports = { updateViews };


