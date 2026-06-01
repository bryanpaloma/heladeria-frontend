import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { consultarUsuario } from '../api/usuarios'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()

  async function manejarLogin(e) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const usuario = await consultarUsuario(correo, password)
      if (!usuario) {
        setError('Correo o contraseña incorrectos')
        return
      }
      iniciarSesion(usuario)
      navigate('/')
    } catch (err) {
      setError('Ocurrió un error al iniciar sesión')
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white rounded-2xl shadow-md p-8">
      <div className="text-center mb-6">
        <img src="/logo.svg" alt="Glacé" className="w-20 h-20 mx-auto" />
        <h1 className="text-2xl font-bold text-indigo-700 mt-2">Iniciar sesión</h1>
        <p className="text-sm text-stone-500">Bienvenido a Glacé</p>
      </div>

      <form onSubmit={manejarLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="correo@ejemplo.co"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="••••••"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <div className="mt-6 text-xs text-gray-400 border-t pt-4">
        <p className="font-semibold mb-1">Usuarios de prueba:</p>
        <p>admin@admin.co · admin</p>
        <p>empleado@empleado.co · empleado</p>
        <p>cliente@cliente.co · cliente</p>
      </div>
    </div>
  )
}
