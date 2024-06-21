const Comment = require('../models/comment');
const Video = require('../models/video');

const createComment = async (user, text) => {
    const comment = new Comment({ user, text });
    return await comment.save();
}

const getComments = async (videoId) => {
    const video = await Video.findById(videoId).populate('comments');
    if (!video) {
        return null;
    }
    return video.comments;
};

module.exports = { createComment, getComments };
