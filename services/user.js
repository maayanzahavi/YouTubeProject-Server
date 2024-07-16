const User = require('../models/user');
const Video = require('../models/video');

const createUser = async (firstName, lastName, email, password, displayName, photo) => {
    console.log("create user photo service", photo);
    const user = new User({ firstName, lastName, email, password, displayName, photo });
    console.log("create user photo service new ", user.photo);
    return await user.save();
};

const getUserById = async (id) => {
    return await User.findById(id);
};

const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const getUsers = async () => {
    return await User.find({});
};

const checkPassword = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    if (user.password !== password) {
        throw new Error('Password incorrect');
    }

    return user;
};

const getUserVideos = async (email) => {
    try {
        const user = await User.findOne({ email }).populate('videos');
        if (!user) {
            throw new Error('User not found');
        }
        return user.videos;
    } catch (err) {
        console.error(err);
        throw new Error('Server Error');
    }
};

const updateUser = async (email, updateData) => {
    try {
        const user = await getUserByEmail(email);
        console.log("user email", email);
        if (!user) {
            throw new Error('User not found');
        }
        const updatedUser = await User.findOneAndUpdate({ email }, updateData, { new: true });
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

const deleteUser = async (email) => {
    try {
        const userToDelete = await User.findOne({ email: email });
        if (userToDelete) {
            await User.findOneAndDelete({ email: email });
            await Video.deleteMany({ email: userToDelete.email }); 
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

async function isSigned(user_name, password) {
    try {
      let user = await User.findOne({ user_name, password });
      if (!user) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

module.exports = { createUser, getUserById, getUserByEmail, getUsers, checkPassword, getUserVideos, updateUser, deleteUser, isSigned };
