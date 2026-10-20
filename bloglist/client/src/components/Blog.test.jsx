import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('When user is not logged in', () => {
  test('renders content', () => {
    const blog = {
      author: 'test author',
      title: 'test title',
      url: 'www.example.com',
      likes: 0,
      user: {
        username: 'tester'
      }
    }

    render(<Blog blog={blog} />)

    const title = screen.getByText('test author: test title')
    expect(title).toBeVisible()

    const urlElement = screen.getByText('www.example.com')
    const likesElement = screen.getByText('likes 0')
    expect(urlElement).toBeVisible()
    expect(likesElement).toBeVisible()

    const buttons = screen.queryByRole('button')
    expect(buttons).toBeNull()
  })

  // test('clicking view shows url and likes', async () => {
  //   const blog = {
  //     author: 'test author',
  //     title: 'test title',
  //     url: 'www.example.com',
  //     likes: 0,
  //     user: {
  //       username: 'tester'
  //     }
  //   }

  //   render(<Blog blog={blog} />)

  //   const user = userEvent.setup()
  //   const button = screen.getByText('view')
  //   await user.click(button)

  //   const urlElement = screen.getByText('www.example.com')
  //   const likesElement = screen.getByText('likes 0')
  //   const userElement = screen.getByText('tester')
  //   expect(urlElement).toBeVisible()
  //   expect(likesElement).toBeVisible()
  //   expect(userElement).toBeVisible()
  // })

  // test('clicking like twice calls like twice', async () => {
  //   const blog = {
  //     author: 'test author',
  //     title: 'test title',
  //     url: 'www.example.com',
  //     likes: 0,
  //     user: {
  //       username: 'tester'
  //     }
  //   }

  //   const mockHandler = vi.fn()

  //   render(<Blog blog={blog} handleLike={mockHandler} />)

  //   const user = userEvent.setup()
  //   const button = screen.getByText('like')
  //   await user.click(button)
  //   await user.click(button)

  //   expect(mockHandler.mock.calls).toHaveLength(2)
  // })
})

describe('When user is logged in', () => {
  test('other user sees only like', () => {
    const blog = {
      author: 'test author',
      title: 'test title',
      url: 'www.example.com',
      likes: 0,
      user: {
        username: 'tester'
      }
    }

    render(<Blog blog={blog} user={{ username: 'other' }} />)

    const button = screen.getByText('like')
    expect(button).toBeVisible()

    const removeButton = screen.queryByText('remove')
    expect(removeButton).toBeNull()
  })

  test('user who created blog sees like and remove', () => {
    const blog = {
      author: 'test author',
      title: 'test title',
      url: 'www.example.com',
      likes: 0,
      user: {
        username: 'tester'
      }
    }

    render(<Blog blog={blog} user={{ username: 'tester' }} />)

    const likeButton = screen.getByText('like')
    const removeButton = screen.getByText('remove')
    expect(likeButton).toBeVisible()
    expect(removeButton).toBeVisible()
  })
})
