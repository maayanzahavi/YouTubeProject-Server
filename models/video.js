const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = require('./comment').schema;

const videoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    comments: {
        type: [commentSchema],
        default: []
    },
    views: {
        type: Number,
        required: true,
        default: 0
    }
} , { collection: 'Videos' });

module.exports = mongoose.model('Video', videoSchema);
