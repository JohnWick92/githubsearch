import axios from 'axios'

const api = axios.create({
  auth: import.meta.env.VITE_GITHUB_API,
  baseURL: 'https://api.github.com/users/',
})

export default api
