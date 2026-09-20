import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { login, selectIsAuthenticated } from '../features/auth/authSlice.js'

export default function LoginPage() {
  const dispatch = useDispatch()
  const location = useLocation()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const { status, error } = useSelector((s) => s.auth)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Con sesión iniciada, volvemos a la página que se intentó abrir (o al inicio).
  const from = location.state?.from?.pathname || '/'
  if (isAuthenticated) return <Navigate to={from} replace />

  const submit = (e) => {
    e.preventDefault()
    dispatch(login({ username, password }))
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2 style={{ marginTop: 0 }}>Login</h2>
      <div className="grid cols-2">
        <div>
          <label>Usuario</label>
          <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      {status === 'failed' && <p style={{ color: '#f87171' }}>{error}</p>}
      <button className="btn primary" style={{ marginTop: 12 }} disabled={status === 'loading'}>
        {status === 'loading' ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  )
}
