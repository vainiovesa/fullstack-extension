import { Alert } from '@mui/material'
import { useNotification } from '../store'

const Notification = () => {
  const { message, isError } = useNotification()

  if (!message) {
    return null
  }

  return (
    <Alert severity={isError ? 'error' : 'success'} sx={{ my: 2 }}>
      {message}
    </Alert>
  )
}

export default Notification
