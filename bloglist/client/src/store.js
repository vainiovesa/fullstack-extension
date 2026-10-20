import { create } from 'zustand'

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

export const useNotification = () =>
  useNotificationStore((state) => state.notification)
export const useNotificationControls = () =>
  useNotificationStore((state) => state.actions)
