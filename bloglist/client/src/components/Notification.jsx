import styled from 'styled-components'

const NotificationElement = styled.div`
  color: ${({ type }) => type === 'error' ? 'red' : 'green'};
  background: lightgrey;
  font-size: 20px;
  border-style: solid;
  padding: 10px;
  margin: 10px 0;
`

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <NotificationElement className="notification" type={type}>
      {message}
    </NotificationElement>
  )
}

export default Notification
