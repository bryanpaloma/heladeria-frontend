import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { permisos } from '../lib/permisos'

export default function Navbar() {
  const { usuario, rol, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  function salir() {
    cerrarSesion()
    navigate('/')
  }

  return (
    <nav className="bg-pink-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Glacé" className="w-9 h-9" />
          <span className="text-xl font-bold tracking-wide">Glacé</span>
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="hover:text-pink-200">Catálogo</Link>

          {permisos.gestionarIngredientes(rol) && (
            <Link to="/ingredientes" className="hover:text-pink-200">Ingredientes</Link>
          )}

          {permisos.verPanel(rol) && (
            <Link to="/panel" className="hover:text-pink-200">Panel</Link>
          )}

          {usuario ? (
            <div className="flex items-center gap-3">
              <span className="bg-pink-800/50 px-3 py-1 rounded-full">
                {usuario.nombre} · {rol}
              </span>
              <button
                onClick={salir}
                className="bg-white text-pink-600 px-3 py-1 rounded-md font-semibold hover:bg-pink-100"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-pink-600 px-3 py-1 rounded-md font-semibold hover:bg-pink-100"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
