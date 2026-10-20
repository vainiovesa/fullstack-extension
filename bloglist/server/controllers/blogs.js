const blogRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const savedPopulatedBlog = await Blog
    .findById(savedBlog._id)
    .populate('user', { username: 1, name: 1 })

  response.status(201).json(savedPopulatedBlog)
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() === request.user.id.toString() ) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'unauthorized' })
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  const { likes } = request.body

  const blogToModify = await Blog
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1 })
  blogToModify.likes = likes

  const modifiedBlog = await blogToModify.save()
  response.json(modifiedBlog)
})

module.exports = blogRouter
