const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const users = await helper.usersInDb()
  const userId = users[0].id

  let blogs = []
  helper.initialBlogs.forEach(b => {
    blogs = blogs.concat({...b, user: userId})
  })
  await Blog.insertMany(blogs)
})

const getJwtToken = (async () => {
  const credentials = {
    username: 'root',
    password: 'sekret',
  }

  const result = await api
    .post('/api/login')
    .send(credentials)

  return result._body.token
})

test('Blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('id field called id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert(blog['id'])
    assert(!blog['_id'])
  })
})

test('a valid blog can be added ', async () => {
  const jwtToken = await getJwtToken()

  const newBlog = {
    title: 'valid',
    author: 'Tester',
    url: 'https://example.com/',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(b => b.title)
  assert(contents.includes('valid'))
})

test('blog added with no likes has 0 likes', async () => {
  const jwtToken = await getJwtToken()

  const newBlog = {
    title: 'No likes',
    author: 'Tester',
    url: 'https://example.com/',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const resultingBlog = blogsAtEnd.filter(blog => blog.title === 'No likes')[0]
  assert.strictEqual(resultingBlog.likes, 0)
})

test('blog cannot be added without title', async () => {
  const jwtToken = await getJwtToken()

  const newBlog = {
    author: 'Tester',
    url: 'https://example.com/',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog cannot be added without url', async () => {
  const jwtToken = await getJwtToken()

  const newBlog = {
    title: 'Some title',
    author: 'Tester',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('deletion succeeds with status code 204 if id and token are valid', async () => {
  const jwtToken = await getJwtToken()
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${jwtToken}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const ids = blogsAtEnd.map(b => b.id)
  assert(!ids.includes(blogToDelete.id))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('deletion fails if token is invalid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', 'Bearer invalid')
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()

  const ids = blogsAtEnd.map(b => b.id)
  assert(ids.includes(blogToDelete.id))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog can be modified', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToModify = blogsAtStart[0]

  const newLikes = {
    likes: blogToModify.likes + 1,
  }


  await api
    .put(`/api/blogs/${blogToModify.id}`)
    .send(newLikes)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const modifiedBlog = blogsAtEnd.filter(b => b.id === blogToModify.id)[0]

  assert.strictEqual(modifiedBlog.likes, newLikes.likes)
})


test('user creation succeeds with a fresh username', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'tester',
    name: 'Tester T',
    password: 'salainen',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

  const usernames = usersAtEnd.map(u => u.username)
  assert(usernames.includes(newUser.username))
})

test('password must be provided', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'tester',
    name: 'Tester T',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('password cannot be less than three characters', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'tester',
    name: 'Tester T',
    password: '12',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('username must provided', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    name: 'Tester T',
    password: 'salasana',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('username must be unique', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: usersAtStart[0].username,
    name: 'Tester T',
    password: 'salasana',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('user can login', async () => {
  const credentials = {
    username: 'root',
    password: 'sekret',
  }

  const result = await api
    .post('/api/login')
    .send(credentials)
    .expect(200)
})

after(async () => {
  await mongoose.connection.close()
})
