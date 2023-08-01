const express = require('express')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
.then(()=>{
    console.log('connected to database')
})
.catch(()=>{
    console.log('db connection failed')
})

const app = express()

const Post = require('./models/post')

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS");
    next()
});

app.get('/api/posts', (req, res, next) => {
    const posts = [
        {
            id: '35asdfas3453',
            title: 'my first server post',
            content: 'this is the content of my first server post'
        },
        {
            id: '35asdfsdfasd',
            title: 'my second server post',
            content: 'this is the content of my second server post'
        }
    ];
    res.status(200).json({
        message: 'Posts fetched successfully',
        posts: posts
    })
})

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })
    console.log(post);
    res.status(201).json({
        message: 'Post added successfully'
    })
})

module.exports = app