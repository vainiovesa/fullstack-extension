import styled from 'styled-components'

const BlogElement = styled.div`
  margin: 1em;
  padding: 0.5em 1em;
  border: none;
  border-radius: 10px;
  border: 1px solid black;
`

const Button = styled.button`
  background: White;
  text-transform: uppercase;
  font-size: 1.2em;
  padding: 2px 10px;
  border: 2px solid Dodgerblue;
  border-radius: 10px;
  cursor: pointer;
`

const Blog = ({ blog, handleLike, handleRemove, user }) => {

  const like = () => {
    handleLike(blog)
  }

  const remove = () => {
    handleRemove(blog)
  }

  return (
    <BlogElement>
      <div>
        <h3>
          {blog.author}: {blog.title}
        </h3>
        <a href={blog.url}>{blog.url}</a>
        <div>
          likes {blog.likes} {user && <Button onClick={like}>like</Button>}
        </div>
        <div>
          Added by {blog.user.username}
        </div>
        {user && user.username === blog.user.username &&
          <div>
            <Button onClick={remove}>remove</Button>
          </div>
        }
      </div>
    </BlogElement>
  )}

export default Blog
