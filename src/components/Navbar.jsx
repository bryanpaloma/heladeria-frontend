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
    <nav className="bg-gradient-to-r from-violet-700 to-indigo-700 text-white shadow-md sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Glacé" className="w-10 h-10" />
          <span className="text-xl font-extrabold tracking-wide">Glacé</span>
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="hover:text-amber-300 transition">Catálogo</Link>

          {permisos.gestionarIngredientes(rol) && (
            <Link to="/ingredientes" className="hover:text-amber-300 transition">Ingredientes</Link>
          )}

          {permisos.verPanel(rol) && (
            <Link to="/panel" className="hover:text-amber-300 transition">Panel</Link>
          )}

          {usuario ? (
            <div className="flex items-center gap-3">
              <span className="bg-white/15 px-3 py-1 rounded-full capitalize">
                {usuario.nombre} · {rol}
              </span>
              <button
                onClick={salir}
                className="bg-amber-400 text-indigo-900 px-3 py-1 rounded-md font-semibold hover:bg-amber-300 transition"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-amber-400 text-indigo-900 px-3 py-1 rounded-md font-semibold hover:bg-amber-300 transition"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
