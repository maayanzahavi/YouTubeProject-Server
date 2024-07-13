const userService = require('../services/user');

const createUser = async (req, res) => {  
    const { firstName, lastName, email, password, displayName, photo } = req.body;
    console.log("create user photo ", photo);
    try {
        const newUser = await userService.createUser(firstName, lastName, email, password, displayName, photo);
        console.log("create user returned photo ", newUser.photo);

        if (!newUser) {
            return res.status(409).json({ error: "User with this email already exists" });
        } 
        return res.status(200).json(newUser); 
    } catch (error) {
       return res.status(500).json({ error: 'Server error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserByEmail = async (req, res) => {
    const user = await userService.getUserByEmail(req.params.id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
};

const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        if (!users) {
            return res.status(404).json({ error: "Couldn't get users" });
        }
        return res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserVideos = async (req, res) => {
    try {
        const userVideos = await userService.getUserVideos(req.params.id);
        if (!userVideos) {
            return res.status(404).json({ error: "Couldn't get user videos" });
        }
        return res.status(200).json(userVideos);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, displayName, photo } = req.body;
    try {
        const updateData = { firstName, lastName, email, displayName, photo };
        const updatedUser = await userService.updateUser(id, updateData);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        if (user) {
            return res.status(200).json({ message: "User has been deleted" });
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { createUser, getUserById, getUserByEmail, getUsers, getUserVideos, updateUser, deleteUser };
