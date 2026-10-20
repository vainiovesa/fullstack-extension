import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  const { message, isError } = notification

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
