import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Protege una ruta segun una funcion de permiso.
// Si el rol actual no esta permitido, redirige al catalogo.
export default function ProtectedRoute({ permitido, children }) {
  const { rol } = useAuth()

  if (!permitido(rol)) {
    return <Navigate to="/" replace />
  }

  return children
}
