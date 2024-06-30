const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { collection: 'Comments' });

module.exports = mongoose.model('Comment', commentSchema);
