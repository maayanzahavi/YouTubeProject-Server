const userService = require('../services/user');
const videoService = require('../services/video');
const tokenModule = require('../models/token'); 

const createUser = async (req, res) => {  
    const { firstName, lastName, email, password, displayName, photo } = req.body;

    try {
        const newUser = await userService.createUser(firstName, lastName, email, password, displayName, photo);
        res.status(201).json({ newUser }); 
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

  
const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserByEmail = async (req, res) => {
    const { password } = req.query;
    const email = req.params.id;

    if (password) {
        try {
            const user = await userService.checkPassword(email, password);
            res.json({ message: 'Login successful', token: tokenModule.getToken(req) }); 
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    } else {
        try {
            const user = await userService.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserVideos = async (req, res) => {

    try {
 
        const userVideos = await userService.getUserVideos(req.params.id);
 
        res.json(userVideos);
 
    } catch (err) {
 
        res.status(500).json({ message: err.message });
 
    }
 
 };

const getUserAndVideos = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userVideos = await videoService.getUserVideos(user.username);
        res.json({ user, videos: userVideos });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createUser, getUserById, getUserByEmail, getUsers, getUserVideos, getUserAndVideos };
