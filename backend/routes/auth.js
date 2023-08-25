const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Adtyaisgood$0y';


// Create a user using POST "/api/auth/createuser", NO Login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', "Enter a valid Email").isEmail(),
    body('password', 'Password must have a minimum of 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    let success = false;

    //If there are errors return Bad request

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        //encrypting password
        const salt = await bcrypt.genSaltSync(10);
        const secPass = await bcrypt.hashSync(req.body.password, salt);

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });
        //sending token to user
        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });

    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            return res.status(400).json({ success, error: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Authenticate a user using POST "/api/auth/login", NO Login required

router.post('/login', [
    body('email', "Enter a valid Email").isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        // const passwordCompare = await bcrypt.compare(password, user.password);
        const passwordCompare = async (password) => {
            const match = await bcrypt.compare(password, user.password);
            return match;
        }
        if (!passwordCompare) {
            return res.send(400).json({ success, error: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });


    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }

});

// Get logged in user details using POST "/api/auth/getuser", Login required

router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

