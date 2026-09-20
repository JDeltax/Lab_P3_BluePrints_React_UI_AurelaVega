import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/apiClient.js'

// El login del backend está en /auth/login (fuera del prefijo /api), así que se sobrescribe baseURL.
// En desarrollo la ruta relativa pasa por el proxy de Vite (ver vite.config.js).
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || '/auth'

// POST /auth/login → { access_token, token_type, expires_in }
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/login', { username, password }, { baseURL: AUTH_BASE_URL })
      if (!data?.access_token) {
        return rejectWithValue('La respuesta del login no incluye access_token')
      }
      return data.access_token
    } catch (err) {
      if (err.response?.status === 401) return rejectWithValue('Usuario o contraseña incorrectos')
      if (err.response)
        return rejectWithValue(`El servidor respondió con error ${err.response.status}`)
      return rejectWithValue('No se pudo conectar con el servidor')
    }
  },
)

const slice = createSlice({
  name: 'auth',
  initialState: {
    // El token se recupera de localStorage para que la sesión sobreviva a una recarga (F5).
    // La escritura en localStorage se hace en store/index.js, no aquí: los reducers deben ser puros.
    token: localStorage.getItem('token'),
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(login.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.token = a.payload
      })
      .addCase(login.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload ?? a.error.message
      })
  },
})

export const { logout } = slice.actions

export const selectIsAuthenticated = (state) => Boolean(state.auth.token)

export default slice.reducer
