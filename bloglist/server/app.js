const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')
const usersRouter = require('./controllers/users')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

const app = express()

mongoose.connect(config.MONGODB_URI)

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter)
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  })
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
