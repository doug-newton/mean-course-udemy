const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const pageIndex = +req.query.pageIndex;
    const postQuery = Post.find()

    if (typeof (pageSize) === 'number' && typeof (pageIndex) === 'number') {
        postQuery
            .skip(pageSize * pageIndex)
            .limit(pageSize)
    }

    postQuery.then(posts => {
        Post.count().then(totalPosts => {
            res.status(200).json({
                message: 'Posts fetched successfully',
                totalPosts: totalPosts,
                posts: posts
            })
        })
    }).catch(error => {
        res.status(500).json({
            message: 'failed to retrieve posts'
        })
    })
}

exports.getPost = (req, res, next) => {
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
    }).catch(error => {
        res.status(500).json({
            message: 'failed to retrieve post'
        })
    })
}

exports.addPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    })
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...createdPost,
                id: createdPost._id,
            }
        })
    }).catch(error => {
        res.status(500).json({
            message: 'Failed to save post'
        })
    })
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;

    if (req.file) {
        const url = req.protocol + '://' + req.get('host')
        imagePath = url + '/images/' + req.file.filename;
    }

    const post = {
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    }

    const id = req.params.id
    const title = req.body.title;
    const content = req.body.content;
    const userId = req.userData.userId
    Post.updateOne({ _id: id, creator: userId }, post).then(result => {
        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'post updated successfully' })
        }
        else {
            res.status(401).json({ message: 'Unauthorized' })
        }
    }).catch(error => {
        res.status(500).json({ message: 'failed to update post' })
    })
}

exports.deletePost = (req, res, next) => {
    const id = req.params.id
    const userId = req.userData.userId
    Post.deleteOne({ _id: id, creator: userId }).then(result => {
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'post deleted successfully!' })
        }
        else {
            res.status(401).json({ message: 'Unauthorized' })
        }
    }).catch(error => {
        res.status(500).json({
            message: 'post deletion failed'
        })
    })
}