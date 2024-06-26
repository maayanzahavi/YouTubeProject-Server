const userService = require('../services/user');
const videoService = require('../services/video');

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

const getUserByEmail = async (req, res) => {
    res.json(await userService.getUserByEmail(
        req.params.id));
};

const getUsers = async (req, res) => {
    res.json(await userService.getUsers());
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
        // const user = await userService.getUserById(req.params.id);
        // if (!user) {
        //     return res.status(404).json({ message: "User not found" });
        // }
        const userVideos = await userService.getUserVideos(req.params.id);
        res.json({ user, videos: userVideos });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = { createUser, getUserById, getUsers, getUserVideos };



module.exports = { createUser, getUserById, getUserByEmail, getUsers, getUserVideos, getUserAndVideos };
