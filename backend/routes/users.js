const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const router = express.Router()

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: "user created successfully",
                        result: result
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        message: "invalid user credentials"
                    })
                })
        }).catch(error => {
            res.status(500).json({
                message: "signup failed"
            })
        })
})

router.post('/login', (req, res, next) => {
    const email = req.body.email
    User.findOne({ email: email }).then(user => {
        bcrypt.compare(req.body.password, user.password).then(validPassword => {
            if (!validPassword) {
                res.status(401).json({ message: "Authentication failed" });
                return;
            }
            const token = jwt.sign(
                { email: user.email, userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' });

            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: user._id
            })
        }).catch(err => {
            res.status(401).json({ message: "Authentication failed" });
            return;
        })
    })
    .catch(err => {
        res.status(401).json({ message: "Authentication failed" });
        return;
    })
})

module.exports = router