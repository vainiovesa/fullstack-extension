import { useEffect } from 'react'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'
import {
  useNotificationControls,
  useBlogs,
  useBlogsControls,
  useUser,
  useUserControls,
  useUsers,
} from './store'

import BlogList from './components/BlogList'
import Login from './components/Login'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Users from './components/Users'
import User from './components/User'
import ErrorBoundary from './components/ErrorBoundary'

import Notification from './components/Notification'

const App = () => {
  const blogs = useBlogs()
  const { initializeBlogs, createBlog, likeBlog, removeBlog } =
    useBlogsControls()
  const user = useUser()
  const { initializeUser, loginUser, logoutUser } = useUserControls()
  const users = useUsers()
  const { setNotification } = useNotificationControls()

  const navigation = useNavigate()

  useEffect(() => {
    initializeBlogs()
  }, [initializeBlogs])

  useEffect(() => {
    initializeUser()
  }, [initializeUser])

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError })
  }

  const addBlog = async (blogObject) => {
    try {
      createBlog(blogObject)
      notifyWith(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      navigation('/')
    } catch (error) {
      console.log('Creating new blog failed:', error)
    }
  }

  const addLike = async (blogObject) => {
    try {
      likeBlog(blogObject)
    } catch (error) {
      console.log('Error while trying to like a blog:', error)
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      removeBlog(blogObject)
      notifyWith(`Blog ${blogObject.title} by ${blogObject.author} removed`)
      navigation('/')
    } catch (error) {
      console.log('Error while trying to delete a blog', error)
    }
  }

  const doLogin = async ({ username, password }) => {
    try {
      loginUser(username, password)
      navigation('/')
    } catch {
      notifyWith('wrong username or password', true)
      console.log('wrong credentials')
    }
  }

  const handleLogout = async () => {
    logoutUser()
    navigation('/')
  }

  const blogMatch = useMatch('/blogs/:id')
  const selectedBlog = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null

  const userMatch = useMatch('users/:id')
  const selectedUser = userMatch
    ? users.find((u) => u.id === userMatch.params.id)
    : null

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
            <Button
              color="inherit"
              component={Link}
              to="/users"
              sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
            >
              users
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

        <Notification />

        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User user={selectedUser} />} />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={selectedBlog}
                addLike={addLike}
                currentUser={user}
                removeBlog={deleteBlog}
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
