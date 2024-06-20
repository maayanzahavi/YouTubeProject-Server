const User = require('../models/user');

const createUser = async (first_name, last_name, email, password, display_name, photo) => {
    const user = new User({ first_name, last_name, email, password, display_name, photo });
    return await user.save();
}

module.exports = { createUser };
