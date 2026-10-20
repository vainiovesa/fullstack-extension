import { useState, useEffect } from 'react'

import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'

import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'

import BlogList from './components/BlogList'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import ErrorBoundary from './components/ErrorBoundary'

import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null })

  const navigation = useNavigate()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('loggedBlogappUser')
    const user = JSON.parse(userJSON)

    if (user) {
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null })
    }, 25000)
  }

  const addBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))
      notifyWith(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
      )
      navigation('/')
    } catch (error) {
      console.log('Creating new blog failed:', error)
    }
  }

  const addLike = async (blog) => {
    const newBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    try {
      const updatedBlog = await blogService.update(newBlog)
      setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)))
    } catch (error) {
      console.log('Error while trying to like a blog:', error)
    }
  }

  const removeBlog = async (blog) => {
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      notifyWith(`Blog ${blog.title} by ${blog.author} removed`)
      navigation('/')
    } catch (error) {
      console.log('Error while trying to delete a blog', error)
    }
  }

  const doLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      navigation('/')
    } catch {
      notifyWith('wrong username or password', true)
      console.log('wrong credentials')
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigation('/')
  }

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  return (
    <ErrorBoundary>
      <Container>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Blog App
            </Typography>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
            >
              blogs
            </Button>
            {!user ? (
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
              >
                login
              </Button>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/create"
                  sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                >
                  new blog
                </Button>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                >
                  logout
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Notification notification={notification} />

        <Routes>
          <Route path="/" element={<BlogList blogs={blogs} />} />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                addLike={addLike}
                currentUser={user}
                removeBlog={removeBlog}
              />
            }
          />
          <Route path="/login" element={<Login doLogin={doLogin} />} />
          <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
          <Route path="*" element={<h2>404 - Page not found</h2>} />
        </Routes>
      </Container>
    </ErrorBoundary>
  )
}

export default App
