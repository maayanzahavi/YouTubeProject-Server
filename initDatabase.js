const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
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
    await mongoose.connect(process.env.CONNECTION_STRING);

    const usersCollectionExists = await collectionExists('users');
    const videosCollectionExists = await collectionExists('videos');
    const commentsCollectionExists = await collectionExists('comments');

    if (usersCollectionExists || videosCollectionExists || commentsCollectionExists) {
      await mongoose.disconnect();
      console.log('Data already inserted. Starting server.');
      return;
    }

    // Insert Users
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf-8'));
    for (const user of usersData) {
      const { firstName, lastName, email, password, displayName, photo } = user;
      const existingUser = await UserService.getUserByEmail(email);
      if (!existingUser) {
        const photoPath = path.join(__dirname, photo);
        if (!fs.existsSync(photoPath)) {
          throw new Error(`File not found: ${photoPath}`);
        }
        await UserService.createUser(firstName, lastName, email, password, displayName, photo);
      } else {
        console.log(`User with email ${email} already exists.`);
      }
    }

    // Insert Videos
    const videosData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/videos.json'), 'utf-8'));
    const videoMap = new Map(); // Map to store video IDs

    for (const videoData of videosData) {
      const { title, img, video, description, owner, comments } = videoData;
      const imgPath = path.join(__dirname, img);
      const videoPath = path.join(__dirname, video);

      console.log(`Creating video with data: ${JSON.stringify({ title, description, imgPath, videoPath, owner })}`);

      if (!fs.existsSync(imgPath)) {
        throw new Error(`File not found: ${imgPath}`);
      }
      if (!fs.existsSync(videoPath)) {
        throw new Error(`File not found: ${videoPath}`);
      }

      const newVideo = await VideoService.createVideo(title, description, imgPath, videoPath, owner);
      videoMap.set(newVideo.title, newVideo._id);

      // Insert Comments for the Video
      for (const comment of comments) {
        const { userName, email, profilePic, text, date } = comment;
        const profilePicPath = path.join(__dirname, profilePic);

        console.log(`Inserting comment for video: ${newVideo.title}`);

        if (!fs.existsSync(profilePicPath)) {
          throw new Error(`File not found: ${profilePicPath}`);
        }
        if (!userName || !email || !profilePic || !text) {
          console.error('Comment validation failed: All fields are required.', comment);
          continue; // Skip invalid comments
        }
        try {
          await CommentService.createComment({
            userName,
            email,
            profilePic: profilePicPath,
            text,
            videoId: newVideo._id,
          });
        } catch (error) {
          console.error('Error inserting comment:', error);
        }
      }
    }

    // Insert Standalone Comments
    const commentsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comments.json'), 'utf-8'));
    for (const comment of commentsData) {
      const { userName, email, profilePic, text, date, videoTitle } = comment;
      const profilePicPath = path.join(__dirname, profilePic);
      if (!fs.existsSync(profilePicPath)) {
        throw new Error(`File not found: ${profilePicPath}`);
      }
      if (!userName || !email || !profilePic || !text || !videoTitle) {
        console.error('Comment validation failed: All fields are required.', comment);
        continue; // Skip invalid comments
      }

      const videoId = videoMap.get(videoTitle);
      if (!videoId) {
        console.error(`Video not found for title: ${videoTitle}`);
        continue; // Skip comments with invalid video titles
      }

      try {
        console.log(`Inserting standalone comment for video: ${videoTitle}`);
        await CommentService.createComment({
          userName,
          email,
          profilePic: profilePicPath,
          text,
          videoId,
        });
      } catch (error) {
        console.error('Error inserting comment:', error);
      }
    }

    console.log('Data inserted successfully.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

insertDataFromJson();
