import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
  if (newToken) {
    token = `Bearer ${newToken}`
  } else {
    token = null
  }
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const url = `${baseUrl}/${newObject.id}`
  const response = await axios.put(url, newObject, config)
  return response.data
}

const remove = async ({ id }) => {
  const config = {
    headers: { Authorization: token }
  }
  const url = `${baseUrl}/${id}`
  const response = await axios.delete(url, config)
  return response.data
}

export default { getAll, setToken, create, update, remove }
