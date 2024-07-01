const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const base64Img = require('base64-img');
const customENV = require('custom-env');
const UserService = require('./services/user');
const CommentService = require('./services/comment');
const VideoService = require('./services/video');

customENV.env(process.env.NODE_ENV, './config');

async function collectionExists(collectionName) {
  const collections = await mongoose.connection.db.listCollections().toArray();
  return collections.some((collection) => collection.name === collectionName);
}

async function insertDataFromJson() {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const usersCollectionExists = await collectionExists('users');
    const videosCollectionExists = await collectionExists('videos');
    const commentsCollectionExists = await collectionExists('comments');

    if (usersCollectionExists || videosCollectionExists || commentsCollectionExists) {
      await mongoose.disconnect();
      console.log('Data already inserted. Starting server.');
      return;
    }

    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf-8'));
    for (const user of usersData) {
      const { firstName, lastName, email, password, displayName, photo } = user;
      const base64EncodedPhoto = base64Img.base64Sync(photo);
      await UserService.createUser(firstName, lastName, email, password, displayName, base64EncodedPhoto);
    }

    const videosData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/videos.json'), 'utf-8'));
    for (const videoData of videosData) {
      const { title, img, video, description, owner, comments } = videoData;
      const base64EncodedImg = base64Img.base64Sync(img);
      const base64EncodedVideo = base64Img.base64Sync(video);
      const newVideo = await VideoService.createVideo(title, base64EncodedImg, base64EncodedVideo, description, owner);

      for (const comment of comments) {
        const base64EncodedProfilePic = base64Img.base64Sync(comment.profilePic);
        await CommentService.createComment(comment.userName, comment.email, base64EncodedProfilePic, comment.text);
      }
    }

    console.log('Data inserted successfully.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

insertDataFromJson();