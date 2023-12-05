const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const userData = jwt.verify(token, process.env.JWT_SECRET)
        req.userData = userData
        next()
    }
    catch (error) {
        res.status(401).json({
            message: 'Authentication failed'
        })
    }
}