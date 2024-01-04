const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.status(400).json({ status: false, msg: "Username already taken" });
        }

        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.status(400).json({ status: false, msg: "Email already used" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        const userToSend = {
            _id: user._id,
            username: newUser.username,
            isAvatarImageSet: newUser.isAvatarImageSet,
            avatarImage: newUser.avatarImage,
            isOnline: newUser.isOnline
        };

        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ status: true, user: userToSend, token });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ status: false, message: 'Error registering user' });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(422).json({ msg: 'Incorrect username', status: false });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ msg: 'Incorrect password', status: false });
        }

        const userToSend = {
            _id: user._id,
            username: user.username,
            isAvatarImageSet: user.isAvatarImageSet,
            avatarImage: user.avatarImage,
            isOnline: user.isOnline
        };

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.status(200).json({ status: true, user: userToSend, token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user' });
    }
};

module.exports.setAvatar = async (req, res) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;

        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true, avatarImage
        });

        return res.status(200).json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
    } catch (error) {
        console.error('Error setting Avatar:', error);
        res.status(500).json({ error: 'An error occurred while setting Avatar' });
    }
};

module.exports.getAllUsers = async (req, res) => {
    try {
        console.log("request comig...")
        const users = await User.find({ _id: { $ne: req.userId } }).select([
            "_id",
            "username",
            "email",
            "avatarImage",
            "isOnline"
        ]);
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while fetching users' });
    }
};

