import { useState } from 'react'
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
  width: 300px;
  border-radius: 10px;
  padding: 10px;
`

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    })

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>

      <form onSubmit={addBlog}>
        <div>
          <label>
            title: <br />
            <Input value={newBlogTitle} onChange={event => setNewBlogTitle(event.target.value)} />
          </label>
        </div>
        <div>
          <label>
            author: <br />
            <Input value={newBlogAuthor} onChange={event => setNewBlogAuthor(event.target.value)} />
          </label>
        </div>
        <div>
          <label>
            url: <br />
            <Input value={newBlogUrl} onChange={event => setNewBlogUrl(event.target.value)} />
          </label>
        </div>

        <Button type="submit">create</Button>
      </form>

    </div>
  )
}

export default BlogForm