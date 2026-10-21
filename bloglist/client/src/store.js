import { create } from 'zustand'
import blogService from './services/blogs'
import loginService from './services/login'
import usersService from './services/users'

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
    initializeBlogs: async () => {
      const blogs = await blogService.getAll()
      set(() => ({ blogs }))
    },
  },
}))

const useUserStore = create((set) => ({
  user: null,
  actions: {
    loginUser: async (username, password) => {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      set(() => ({ user }))
    },
    logoutUser: async () => {
      window.localStorage.removeItem('loggedBlogappUser')
      set(() => ({ user: null }))
    },
    initializeUser: async () => {
      const userJSON = window.localStorage.getItem('loggedBlogappUser')
      const user = JSON.parse(userJSON)

      if (user) {
        blogService.setToken(user.token)
        set(() => ({ user }))
      }
    },
  },
}))

const useUsersStore = create((set) => ({
  users: [],
  actions: {
    initializeUsers: async () => {
      const users = await usersService.getAll()
      set(() => ({ users }))
    },
  },
}))

export const useNotification = () =>
  useNotificationStore((state) => state.notification)
export const useNotificationControls = () =>
  useNotificationStore((state) => state.actions)

export const useBlogs = () => useBlogsStore((state) => state.blogs)
export const useBlogsControls = () => useBlogsStore((state) => state.actions)

export const useUser = () => useUserStore((state) => state.user)
export const useUserControls = () => useUserStore((state) => state.actions)

export const useUsers = () => useUsersStore((state) => state.users)
export const useUsersControls = () => useUsersStore((state) => state.actions)
