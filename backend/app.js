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
        "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

app.get('/api/posts', (req, res, next) => {
    Post.find().then(posts => {
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: posts
        })
    })
})

app.get('/api/posts/:id', (req, res, next) => {
    const id = req.params.id
    Post.findOne({ _id: id }).then(post => {
        if (post) {
            res.status(200).json({
                message: 'Post found',
                post: post
            })
        }
        else {
            res.status(404).json({
                message: 'Post not found',
                post: null
            })
        }
    })
})

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })
    post.save().then(createdPost => {
        console.log(createdPost)
        res.status(201).json({
            message: 'Post added successfully',
            postId: createdPost.id
        })
    })
})

app.put('/api/posts/:id', (req, res, next) => {
    const id = req.params.id
    const title = req.body.title;
    const content = req.body.content;
    Post.updateOne({ _id: id }, {title, content}).then(result => {
        console.log(result)
        res.status(200).json({ message: 'post updated successfully' })
    })
})

app.delete('/api/posts/:id', (req, res, next) => {
    const id = req.params.id
    Post.deleteOne({ _id: id }).then(result => {
        console.log(result)
        res.status(200).json({ message: 'post deleted successfully!' })
    })
})

module.exports = app