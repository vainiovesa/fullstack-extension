import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

const newBlog = {
  title: 'Clean Code: The Good, the Bad and the Ugly',
  author: 'Daniel Gerlach',
  url: 'https://gerlacdt.github.io/blog/posts/clean_code/'
}

describe('BlogForm', () => {
  test('event handler is called with right values when new blog is created', async () => {
    const mockHandler = vi.fn()
    render(<BlogForm createBlog={mockHandler} />)

    const user = userEvent.setup()

    const titleInput = screen.getByLabelText('title:')
    await user.type(titleInput, newBlog.title)

    const authorInput = screen.getByLabelText('author:')
    await user.type(authorInput, newBlog.author)

    const urlInput = screen.getByLabelText('url:')
    await user.type(urlInput, newBlog.url)

    const button = screen.getByText('create')
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0]).toEqual(newBlog)
  })
})