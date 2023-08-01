const express = require('express')
const mongoose = require('mongoose')
const postsRoutes = require('./routes/posts')

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
.then(()=>{
    console.log('connected to database')
})
.catch(()=>{
    console.log('db connection failed')
})

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

app.use('/api/posts', postsRoutes)

module.exports = app