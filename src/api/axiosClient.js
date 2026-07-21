import axios from 'axios'
import { auth } from './firebase'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach Firebase ID token to every outgoing request
axiosClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, try to refresh the token once before failing
axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const user = auth.currentUser
      if (user) {
        const token = await user.getIdToken(true) // force refresh
        original.headers.Authorization = `Bearer ${token}`
        return axiosClient(original)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosClient
