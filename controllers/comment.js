const commentService = require('../services/comment');

const createComment = async (req, res) => {
    res.json(await commentService.createComment(req.body.user, req.body.text));
};

const getComments = async (req, res) => {
    res.json(await commentService.getComments(req.body.video));
};


module.exports = { createComment, getComments };
