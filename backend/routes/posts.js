const express = require('express')
const multer = require('multer')
const Post = require('../models/post')

const router = express.Router()

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]
        let error = new Error("Invalid mime type")
        if (isValid) {
            error = null
        }
        cb(error, "backend/images")
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-')
        const ext = MIME_TYPE_MAP[file.mimetype]
        cb(null, name + '-' + Date.now() + '.' + ext)
    }
})

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

router.post('/', multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename
    })
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...createdPost,
                id: createdPost._id,
            }
        })
    })
})

router.put('/:id', (req, res, next) => {
    const id = req.params.id
    const title = req.body.title;
    const content = req.body.content;
    Post.updateOne({ _id: id }, {title, content}).then(result => {
        res.status(200).json({ message: 'post updated successfully' })
    })
})

router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    Post.deleteOne({ _id: id }).then(result => {
        res.status(200).json({ message: 'post deleted successfully!' })
    })
})

module.exports = router