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

const editComment = async (newContent, id) => {
    try {
        const updatedComment = await Comment.findOneAndUpdate(
          { _id: id },
          { $set: { content: newContent } },
          { new: true }
        );
    
        if (updatedComment) {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
};

const deleteComment = async (videoId, commentId) => {
    try {
        const deletedComment = await Comment.findOneAndDelete({ _id: commentId });
        if (!deletedComment) {
          return false;
        }
        const post = await Video.findByIdAndUpdate(videoId, {
          $pull: { comments: commentId },
        });
    
        if (!post) {
          return false;
        }
        return true;
      } catch (error) {
        return false;
      }
};

module.exports = { createComment, getComments, editComment, deleteComment };
