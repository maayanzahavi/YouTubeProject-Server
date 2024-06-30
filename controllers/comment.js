const commentService = require('../services/comment');

const createComment = async (req, res) => {
  const { pid: videoId } = req.params;
  const { userName, email, profilePic, text } = req.body;
  try {
    const comment = await commentService.createComment({ userName, email, profilePic, text, videoId });
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: error.message });
  }
};

const getComments = async (req, res) => {
  const { pid: videoId } = req.params;
  try {
    const comments = await commentService.getComments(videoId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  const { pid: videoId, cid: commentId } = req.params;
  try {
    const success = await commentService.deleteComment(videoId, commentId);
    if (success) {
      res.status(200).json({ message: 'Comment deleted successfully' });
    } else {
      res.status(404).json({ error: 'Comment not found or could not be deleted' });
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: error.message });
  }
};

const editComment = async (req, res) => {
  const { pid: videoId, cid: commentId } = req.params;
  const { newText } = req.body;

  try {
    const success = await commentService.editComment(videoId, commentId, newText);
    if (success) {
      res.status(200).json({ message: 'Comment edited successfully' });
    } else {
      res.status(404).json({ error: 'Comment not found or could not be edited' });
    }
  } catch (error) {
    console.error('Error editing comment:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createComment, getComments, deleteComment, editComment };
