const Comment = require('../models/comment');

const createComment = async (user, text) => {
    const comment = new Comment({ user, text });
    return await comment.save();
}

module.exports = { createComment };
