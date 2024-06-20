const commentService = require('../services/comment');

const createComment = async (req, res) => {
    const { user, text } = req.body;
    res.json(await commentService.createComment(user, text));
};

module.exports = { createComment };
