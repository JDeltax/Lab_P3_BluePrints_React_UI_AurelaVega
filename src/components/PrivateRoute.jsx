import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
 
export default function PrivateRoute({ children }) {
  // Verificamos el estado de autenticación en Redux (ajusta la ruta según tu store, ej: state.auth o state.user)
  const { isAuthenticated } = useSelector((state) => state.auth || { isAuthenticated: false })
 
  // Si está autenticado, muestra el componente hijo (ej. formulario de creación/edición)
  // Si no, lo redirige al login
  return isAuthenticated ? children : <Navigate to="/login" replace />
}