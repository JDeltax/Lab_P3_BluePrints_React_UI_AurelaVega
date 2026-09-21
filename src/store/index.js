import { configureStore } from '@reduxjs/toolkit'
import blueprintsReducer from '../features/blueprints/blueprintsSlice.js'
import authReducer, { logout } from '../features/auth/authSlice.js'
import { configureApiClient } from '../services/apiClient.js'

const store = configureStore({
  reducer: {
    blueprints: blueprintsReducer,
    auth: authReducer,
  },
})

// apiClient no importa el store (evita un import circular con los slices).
// Es el store quien le entrega lo que necesita: cómo leer el token y qué hacer ante un 401.
configureApiClient({
  getToken: () => store.getState().auth.token,
  onUnauthorized: () => store.dispatch(logout()),
})

// Persistencia: el token vive en Redux; localStorage solo lo recuerda entre recargas.
let previousToken = store.getState().auth.token
store.subscribe(() => {
  const token = store.getState().auth.token
  if (token === previousToken) return
  previousToken = token
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
})

export default store
