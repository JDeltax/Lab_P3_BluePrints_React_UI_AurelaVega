import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 8000,
})

// Este módulo no conoce Redux. store/index.js le entrega estas dos funciones al arrancar.
let getToken = () => null
let onUnauthorized = () => {}

export function configureApiClient(handlers) {
  if (handlers.getToken) getToken = handlers.getToken
  if (handlers.onUnauthorized) onUnauthorized = handlers.onUnauthorized
}

// Cada petición sale con el JWT si hay sesión
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 401 = token ausente, vencido o inválido → se cierra la sesión.
// (403 = autenticado pero sin permiso: no se cierra la sesión.)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      onUnauthorized()
    }
    return Promise.reject(err)
  },
)

export default api
