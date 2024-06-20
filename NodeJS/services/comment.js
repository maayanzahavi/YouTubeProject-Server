const Comment = require('../models/comment');
const Video = require('../models/video');

const createComment = async (user, text) => {
    const comment = new Comment({ user, text });
    return await comment.save();
}

const getComments = async (video_id) => {
    const video = await Video.find({ video_id });
    if (!video) {
        return null;
    }
    const comments = await post.populate("comments");
    return comments.comments; 
};

module.exports = { createComment, getComments };
