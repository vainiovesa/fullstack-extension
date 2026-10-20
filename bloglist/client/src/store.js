import { create } from 'zustand'
import blogService from './services/blogs'

const useNotificationStore = create((set) => ({
  notification: '',
  isError: false,
  actions: {
    setNotification: (value, isError = false) => {
      set(() => ({ notification: value, isError }))
      setTimeout(() => {
        set(() => ({ notification: '', isError: false }))
      }, 5000)
    },
  },
}))

const useBlogsStore = create((set) => ({
  blogs: [],
  actions: {
    createBlog: async (blogObject) => {
      const newBlog = await blogService.create(blogObject)
      set((state) => ({ blogs: state.blogs.concat(newBlog) }))
    },
    likeBlog: async (blogObject) => {
      const newBlog = {
        ...blogObject,
        likes: blogObject.likes + 1,
        user: blogObject.user.id,
      }
      const updatedBlog = await blogService.update(newBlog)
      set((state) => ({
        blogs: state.blogs.map((b) =>
          b.id === updatedBlog.id ? updatedBlog : b,
        ),
      }))
    },
    removeBlog: async (blogObject) => {
      await blogService.remove(blogObject.id)
      set((state) => ({
        blogs: state.blogs.filter((b) => b.id !== blogObject.id),
      }))
    },
    initialize: async () => {
      const blogs = await blogService.getAll()
      set(() => ({ blogs }))
    },
  },
}))

export const useNotification = () =>
  useNotificationStore((state) => state.notification)
export const useNotificationControls = () =>
  useNotificationStore((state) => state.actions)

export const useBlogs = () => useBlogsStore((state) => state.blogs)
export const useBlogsControls = () => useBlogsStore((state) => state.actions)
