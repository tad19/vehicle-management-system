const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_vehicle_key_123';

router.post('/register', async(req, res) => {
    try{
        const{username, email, password, role} = req.body;

        const existingUser = await User.findOne({$or: [{email}, {username}]});
        if(existingUser){
            return res.status(400).json({error: 'Username or email already exists.'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'User'
        });

        await newUser.save();
        res.status(201).json({message: 'User registered successfully'});
    }
    catch(err){{
        res.status(500).json({error: err.message});
    }}
});

router.post('/login', async(req, res) => {
    try{
        const{email, password} =req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: 'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({error: 'invalid email or password'});
        }

        const token = jwt.sign(
            {userId: user._id, role: user.role, username: user.username},
            JWT_SECRET,
            {expiresIn: '1d'}
        );

        res.status(200).json({token, user:{id:user._id, username: user.username, email:user.email, role:user.role}});
    }
    catch(err){
        res.status(500).json({error: error.message});
    }
});

module.exports = router;