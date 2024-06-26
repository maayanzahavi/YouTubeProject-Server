const mongoose = require('mongoose');
const fs = require('fs');

// Connect to your MongoDB database
mongoose.connect('mongodb://localhost:27017/yourDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const User = require('./models/user'); // Adjust the path as necessary
const Video = require('./models/video'); // Adjust the path as necessary

async function updateUsersWithVideos() {
    try {
        // Read video data from the JSON file
        const videosData = JSON.parse(fs.readFileSync('/mnt/data/YouTubeDB.Videos.json', 'utf8'));
        const usersData = JSON.parse(fs.readFileSync('/mnt/data/YouTubeDB.Users.json', 'utf8'));

        // Create a map to store videos by owner's email
        const videosByOwner = {};

        // Populate the map with video IDs
        videosData.forEach(video => {
            const ownerEmail = video.owner;
            if (!videosByOwner[ownerEmail]) {
                videosByOwner[ownerEmail] = [];
            }
            videosByOwner[ownerEmail].push(video._id.$oid);
        });

        // Update each user with their videos
        for (const user of usersData) {
            const userEmail = user.email;
            const userVideos = videosByOwner[userEmail] || [];
            await User.updateOne(
                { _id: user._id.$oid },
                { $set: { videos: userVideos } }
            );
        }

        console.log('Users updated with videos successfully.');
    } catch (error) {
        console.error('Error updating users with videos:', error);
    } finally {
        mongoose.connection.close();
    }
}

updateUsersWithVideos();
