import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import Blog from './Blog'

describe('Blog', () => {
  const creator = {
    username: 'totester',
    name: 'Tommy Tester',
    id: '6836bfea4b580b29430b00b7',
  }

  const otherUser = {
    username: 'otheruser',
    name: 'Other User',
    id: 'abc123',
  }

  const blog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: creator,
  }

  test('blog info and likes are shown to unauthenticated user, no buttons', () => {
    render(<Blog blog={blog} currentUser={null} />)

    screen.getByText('likes 12', { exact: false })
    screen.getByText(blog.url, { exact: false })
    screen.getByText(blog.user.name, { exact: false })

    expect(screen.queryByText('like')).toBeNull()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('only like button is shown to a logged-in user who is not the creator', () => {
    render(<Blog blog={blog} currentUser={otherUser} addLike={vi.fn()} />)

    expect(screen.getByText('like')).toBeDefined()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('both like and remove buttons are shown to the blog creator', () => {
    render(
      <Blog
        blog={blog}
        currentUser={creator}
        addLike={vi.fn()}
        removeBlog={vi.fn()}
      />,
    )

    expect(screen.getByText('like')).toBeDefined()
    expect(screen.getByText('remove')).toBeDefined()
  })
})
