const User = require('../models/user');

const createUser = async (firstName, lastName, email, password, displayName, photo) => {
    const user = new User({ firstName: firstName, lastName: lastName, email, password, displayName: displayName, photo });
    return await user.save();
    
};

const getUserById = async (id) => {
    return await User.findById(id);
};

const getUserByEmail = async (email) => {
    return await User.findOne({ email: email });
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

module.exports = { createUser, getUserById, getUserByEmail, getUsers, checkPassword };
