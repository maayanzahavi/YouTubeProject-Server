const mongoose = require('mongoose');
const Video = require('./video'); 
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
        required: true,
        unique: true
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
        type: String, 
        required: true
    },
    liked_videos: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Video' }], 
        default: [] 
    },
    videos: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
        default: []
    }
}, { collection: 'Users' });

module.exports = mongoose.model('User', UserSchema);
