import { create } from 'zustand'
import loginService from './login'
import blogService from './blogs'

const useUserStore = create((set) => ({
  user: null,
  actions: {
    saveUser: async (username, password) => {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      set(() => ({ user }))
    },
    removeUser: async () => {
      window.localStorage.removeItem('loggedBlogappUser')
      set(() => ({ user: null }))
    },
    getUser: async () => {
      const userJSON = window.localStorage.getItem('loggedBlogappUser')
      const user = JSON.parse(userJSON)

      if (user) {
        blogService.setToken(user.token)
        set(() => ({ user }))
      }
    },
  },
}))

export const useUser = () => useUserStore((state) => state.user)
export const useUserControls = () => useUserStore((state) => state.actions)
export const getUser = () => useUserStore.getState().actions.getUser()
export const saveUser = () => useUserStore.getState().actions.saveUser()
export const removeUser = () => useUserStore.getState().actions.removeUser()
