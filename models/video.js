const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = require('./comment').schema; // Import schema, not the model

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
        type: Schema.Types.ObjectId,
        ref: 'User', // Referencing the model name as a string
        required: true // Correct spelling
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    comments: {
        type: [commentSchema], // Embedding commentSchema correctly
        default: []
    },
    views: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Video', videoSchema);
