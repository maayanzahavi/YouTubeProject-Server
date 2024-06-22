const userService = require('../services/user');

const createUser = async (req, res) => {
    res.json(await userService.createUser(
        req.body.first_name,
        req.body.last_name, 
        req.body.email, password, 
        req.body.display_name, 
        req.body.photo));
};

const getUserById = async (req, res) => {
    res.json(await userService.getUserById(
        req.params.id));
};

const getUsers = async (req, res) => {
    res.json(await userService.getUsers());
};

module.exports = { createUser, getUserById, getUsers };
