const Comment = require('../models/comment');
const Video = require('../models/video');

const createComment = async (commentData) => {
  const { userName, email, profilePic, text, videoId } = commentData;
  const comment = new Comment({ userName, email, profilePic, text });
  await comment.save();

  // Find the video and add the comment to its comments array
  const video = await Video.findById(videoId);
  if (!video) {
    throw new Error('Video not found');
  }

  video.comments.push(comment);
  await video.save();
  return comment;
};

const getComments = async (videoId) => {
  const video = await Video.findById(videoId);
  if (!video) {
    throw new Error('Video not found');
  }
  return video.comments;
};

const deleteComment = async (videoId, commentId) => {
  try {
    const deletedComment = await Comment.findOneAndDelete({ _id: commentId });
    if (!deletedComment) {
      return false;
    }

    const video = await Video.findByIdAndUpdate(videoId, {
      $pull: { comments: { _id: commentId } },
    });

    if (!video) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

const editComment = async (videoId, commentId, newText) => {
  try {
    // Find and update the comment in the comments collection
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { text: newText } },
      { new: true }
    );

    // Find the video and update the comment in its comments array
    const video = await Video.findById(videoId);
    const commentIndex = video.comments.findIndex(comment => comment._id.toString() === commentId);

    video.comments[commentIndex].text = newText;
    await video.save();
    return updatedComment;
  } catch (error) {
    return false;
  }
};

module.exports = { createComment, getComments, editComment, deleteComment };
