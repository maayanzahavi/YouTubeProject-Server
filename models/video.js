const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Video = new Schema({
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
        ref: User,
        require: true
    }, 
    likes: {
        type: Number,
        required: true,
        default: 0 
    },
    comments: {
        type: [CommentSchema], 
        required: true,
        default: [] 
    },
    views: {
        type: Number, 
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Video', Video);