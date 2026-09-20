import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../features/auth/authSlice.js'

export default function PrivateRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    // Se guarda la ruta pedida en `state.from` para volver a ella después del login.
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
