import {
  Routes, Route, Link, useNavigate, useMatch
} from 'react-router-dom'

import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

import styled from 'styled-components'

const Button = styled.button`
  background: Dodgerblue;
  color: White;
  text-transform: uppercase;
  font-size: 1.2em;
  margin: 1em;
  padding: 0.5em 1em;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`

const Input = styled.input`
  margin: 0.25em;
  width: 200px;
  border-top: none;
  border-left: none;
  border-right: none;
`

const Nav = styled.div`
  background: Dodgerblue;
  padding: 1em;
  box-shadow: 5px 5px 5px 1px rgb(0 0 0 / 20%);
  display: flex;
  justify-content: space-between;
`

const NavItems = styled.div`
  align-self: flex-end;
`

const NavBtn = styled.div`
  color: White;
  display: inline;
  cursor: pointer;
`

const H1 = styled.div`
  color: White;
  display: inline;
  font-size: 1.2rem;
`

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      setNotification({ message: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = async event => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    setNotification({ message: 'Logged out' })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
    navigate('/')
  }

  const loginForm = () => (
    <div>
      {notification && <Notification message={notification.message} type={notification.type} />}
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <Input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <Input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <Button type="submit">login</Button>
      </form>

    </div>
  )

  const addBlog = blogObject => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotification({ message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added` })
        navigate('/')
      })
      .catch(e => {
        setNotification({ message: e.response.data.error, type: 'error' })
      })

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLike = blogObject => {
    const newBlogObject = { ...blogObject, likes: blogObject.likes + 1 }
    blogService
      .update(newBlogObject)
      .then(returnedObject => {
        const newBlogs = blogs.map(blog => {
          return blog.id === newBlogObject.id ? returnedObject : blog
        })
        setBlogs(newBlogs.sort((a, b) => b.likes - a.likes))
      })
      .catch(e => {
        setNotification({ message: e.response.data.error, type: 'error' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const handleRemove = blogObject => {
    if (window.confirm(`Remove ${blogObject.title} by ${blogObject.author}?`)) {
      blogService
        .remove(blogObject)
        .then(() => {
          setNotification({ message: `Removed ${blogObject.title} by ${blogObject.author}` })
          const newBlogs = blogs.filter(blog => blog.id !== blogObject.id)
          setBlogs(newBlogs)
          navigate('/')
        })
        .catch(e => {
          setNotification({ message: e.response.data.error, type: 'error' })
        })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const navlink = {
    paddingRight: '10px',
    color: 'white',
    textDecoration: 'none'
  }

  const blogList = () => (
    <div>
      {notification && <Notification message={notification.message} type={notification.type} />}

      <h2>blogs</h2>

      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
          </li>
        ))}
      </ul>
    </div>
  )

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <div>
      <Nav>
        <H1>Blog App</H1>
        <NavItems>
          <Link style={navlink} to="/">blogs</Link>
          {!user && <Link style={navlink} to="/login">login</Link>}
          {user && <Link style={navlink} to="/create">new blog</Link>}
          {user && <NavBtn onClick={handleLogout}>logout</NavBtn>}
        </NavItems>
      </Nav>

      <Routes>
        <Route path="/" element={blogList()} />
        <Route path="/login" element={loginForm()} />
        <Route path="/create" element={
          <BlogForm createBlog={addBlog} />
        } />
        <Route path="/blogs/:id" element={
          <Blog
            blog={blog}
            handleLike={handleLike}
            handleRemove={handleRemove}
            user={user} />
        } />
      </Routes>
    </div>
  )
}

export default App
