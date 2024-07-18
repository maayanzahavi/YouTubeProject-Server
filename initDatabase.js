const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const customENV = require('custom-env');
const UserService = require('./services/user');
const CommentService = require('./services/comment');
const VideoService = require('./services/video');
const Video = require('./models/video');

customENV.env(process.env.NODE_ENV, './config');

async function collectionExists(collectionName) {
  const collections = await mongoose.connection.db.listCollections().toArray();
  return collections.some((collection) => collection.name === collectionName);
}

async function insertDataFromJson() {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);

    const collectionsExist = await Promise.all([
      collectionExists('Users'),
      collectionExists('Videos'),
      collectionExists('Comments')
    ]);

    if (collectionsExist.some(exists => exists)) {
      console.log('Data already inserted. Starting server.');
      await mongoose.disconnect();
      return;
    }

    await insertUsers();
    await insertVideosAndComments();

    console.log('Data inserted successfully.');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

async function insertUsers() {
  const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf-8'));
  for (const user of usersData) {
    const { firstName, lastName, email, password, displayName, photo } = user;
    const existingUser = await UserService.getUserByEmail(email);
    if (!existingUser) {
      const photoPath = path.join(__dirname, photo);
      if (!fs.existsSync(photoPath)) {
        throw new Error(`File not found: ${photoPath}`);
      }
      await UserService.createUser(firstName, lastName, email, password, displayName, ensureRelativePath(photo));
    } else {
      console.log(`User with email ${email} already exists.`);
    }
  }
}

async function insertVideosAndComments() {
  const videosData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/videos.json'), 'utf-8'));
  const videoMap = new Map();

  for (const videoData of videosData) {
    const { title, img, video, description, owner, likes, views, comments } = videoData;
    const imgPath = path.join(__dirname, img);
    const videoPath = path.join(__dirname, video);

    console.log(`Creating video with data: ${JSON.stringify({ title, description, img, video, owner })}`);

    if (!fs.existsSync(imgPath) || !fs.existsSync(videoPath)) {
      throw new Error(`File not found: ${imgPath} or ${videoPath}`);
    }

    const newVideo = await VideoService.createVideo(title, description, ensureRelativePath(img), ensureRelativePath(video), owner);
    if (newVideo) {
      await Video.findByIdAndUpdate(newVideo._id, { likes: likes || 0, views: views || 0 });
      videoMap.set(newVideo.title, newVideo._id);

      for (const comment of comments) {
        await insertComment(comment, newVideo._id);
      }
    }
  }

  const commentsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comments.json'), 'utf-8'));
  for (const comment of commentsData) {
    const videoId = videoMap.get(comment.videoTitle);
    if (videoId) {
      await insertComment(comment, videoId);
    } else {
      console.error(`Video not found for title: ${comment.videoTitle}`);
    }
  }
}

async function insertComment(comment, videoId) {
  const { userName, email, profilePic, text } = comment;
  const profilePicPath = path.join(__dirname, profilePic);

  if (!fs.existsSync(profilePicPath)) {
    throw new Error(`File not found: ${profilePicPath}`);
  }
  if (!userName || !email || !profilePic || !text) {
    console.error('Comment validation failed: All fields are required.', comment);
    return;
  }

  try {
    console.log(`Inserting comment for video ID: ${videoId}`);
    await CommentService.createComment({
      userName,
      email,
      profilePic: ensureRelativePath(profilePic),
      text,
      videoId,
    });
  } catch (error) {
    console.error('Error inserting comment:', error);
  }
}

function ensureRelativePath(filePath) {
  return filePath.replace(/^public/, '');
}

insertDataFromJson();

