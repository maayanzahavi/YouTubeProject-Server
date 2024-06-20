const userService = require('../services/user');

const createUser = async (req, res) => {
    const { first_name, last_name, email, password, display_name, photo } = req.body;
    res.json(await userService.createUser(
        first_name,
        last_name, 
        email, password, 
        display_name, 
        photo));
};

module.exports = { createUser };
