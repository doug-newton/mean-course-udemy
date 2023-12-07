const checkAuth = require('../middleware/check-auth')
const fileStorage = require('../middleware/file-storage')

const express = require('express')
const router = express.Router()

const PostsController = require('../controllers/posts')

router.get('/', PostsController.getPosts)
router.get('/:id', PostsController.getPost)
router.post('/', checkAuth, fileStorage, PostsController.addPost)
router.put('/:id', checkAuth, fileStorage, PostsController.updatePost)
router.delete('/:id', checkAuth, PostsController.deletePost)

module.exports = router