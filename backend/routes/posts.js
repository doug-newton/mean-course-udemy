const express = require('express')
const Post = require('../models/post')

const router = express.Router()

router.get('/', (req, res, next) => {
    Post.find().then(posts => {
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: posts
        })
    })
})

router.get('/:id', (req, res, next) => {
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

router.post('/', (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
    const id = req.params.id
    const title = req.body.title;
    const content = req.body.content;
    Post.updateOne({ _id: id }, {title, content}).then(result => {
        console.log(result)
        res.status(200).json({ message: 'post updated successfully' })
    })
})

router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    Post.deleteOne({ _id: id }).then(result => {
        console.log(result)
        res.status(200).json({ message: 'post deleted successfully!' })
    })
})

module.exports = router