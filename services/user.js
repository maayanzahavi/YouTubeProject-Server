const User = require('../models/user');

const createUser = async (first_name, last_name, email, password, display_name, photo) => {
    const user = new User({ first_name, last_name, email, password, display_name, photo });
    return await user.save();
}

const getUserById = async (id) => {
    return await User.findById(id);
};

const getUsers = async () => {
    return await User.find({});
};

module.exports = { createUser, getUserById, getUsers };
