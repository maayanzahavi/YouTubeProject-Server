const mongoose = require('mongoose');
const Video = require('./video'); // Correctly import the Video model
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true
    }, 
    last_name: {
        type: String, 
        required: true
    }, 
    email: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true
    }, 
    display_name: {
        type: String,
        required: true
    }, 
    photo: {
        type: Number,
        required: true,
        default: 0 
    },
    liked_videos: {
        type: [{ type: Schema.Types.ObjectId, ref: Video }], 
        required: true,
        default: [] 
    },
    videos: {
        type: [{ type: Schema.Types.ObjectId, ref: Video }],
        required: true,
        default: []
    }
}, { collection: 'Users' });

module.exports = mongoose.model('User', UserSchema);
