import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material'
import { useCommentControls } from '../store'
import { useComment, useComments } from '../store'

const Blog = ({ blog, addLike, currentUser, removeBlog }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { setComment, postComment, initializeComments } = useCommentControls()
  const comment = useComment()
  const comments = useComments()

  useEffect(() => {
    if (blog) {
      initializeComments(blog)
    }
  }, [blog, initializeComments])

  if (!blog) {
    return <h2>404 - Page not found</h2>
  }

  const canBeRemoved = () =>
    currentUser && currentUser.username === blog.user.username

  const handleRemove = () => {
    removeBlog(blog)
    setConfirmOpen(false)
  }

  const handleAddComment = async (event) => {
    event.preventDefault()

    try {
      await postComment(blog.id, comment)
    } catch (error) {
      console.error('Failed to post comment:', error)
    }
  }

  return (
    <Card sx={{ mt: 2, maxWidth: 600 }} className="blog">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          by {blog.author}
        </Typography>

        <Link
          href={blog.url}
          target="_blank"
          rel="noopener"
          display="block"
          sx={{ mb: 1 }}
        >
          {blog.url}
        </Link>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Added by {blog.user.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Typography variant="body1">{blog.likes} likes</Typography>
          {currentUser && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => addLike(blog)}
            >
              like
            </Button>
          )}
          {canBeRemoved() && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => setConfirmOpen(true)}
            >
              remove
            </Button>
          )}
        </Box>
      </CardContent>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Remove blog</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remove blog <strong>{blog.title}</strong> by {blog.author}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>cancel</Button>
          <Button onClick={handleRemove} color="error" variant="contained">
            remove
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h5" gutterBottom>
        comments
      </Typography>

      <form onSubmit={handleAddComment}>
        <TextField
          label="add a comment"
          size="small"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ alignSelf: 'flex-start' }}
        >
          add comment
        </Button>
      </form>

      <ul>
        {comments.map((c) => (
          <li key={c.id}>{c.comment}</li>
        ))}
      </ul>
    </Card>
  )
}

export default Blog
