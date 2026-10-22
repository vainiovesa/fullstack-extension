import { create } from 'zustand'
import blogService from './services/blogs'
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

const useUsersStore = create((set) => ({
  users: [],
  actions: {
    initializeUsers: async () => {
      const users = await usersService.getAll()
      set(() => ({ users }))
    },
  },
}))

const useCommentStore = create((set) => ({
  comment: '',
  comments: [],
  actions: {
    setComment: (comment) => {
      set(() => ({ comment }))
    },
    postComment: async (id, comment) => {
      const newComments = await blogService.comment(id, comment)

      set((state) => ({
        comment: state.comment === comment ? '' : state.comment,
        comments: newComments,
      }))
    },
    initializeComments: ({ comments }) => {
      set(() => ({ comments }))
    },
  },
}))

export const useNotification = () =>
  useNotificationStore((state) => state.notification)
export const useNotificationControls = () =>
  useNotificationStore((state) => state.actions)

export const useBlogs = () => useBlogsStore((state) => state.blogs)
export const useBlogsControls = () => useBlogsStore((state) => state.actions)

export const useUsers = () => useUsersStore((state) => state.users)
export const useUsersControls = () => useUsersStore((state) => state.actions)

export const useComment = () => useCommentStore((state) => state.comment)
export const useComments = () => useCommentStore((state) => state.comments)
export const useCommentControls = () =>
  useCommentStore((state) => state.actions)
