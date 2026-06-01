import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario')
    return guardado ? JSON.parse(guardado) : null
  })

  function iniciarSesion(datosUsuario) {
    setUsuario(datosUsuario)
    localStorage.setItem('usuario', JSON.stringify(datosUsuario))
  }

  function cerrarSesion() {
    setUsuario(null)
    localStorage.removeItem('usuario')
  }

  // Si no hay usuario autenticado el rol es "publico"
  const rol = usuario?.rol ?? 'publico'

  return (
    <AuthContext.Provider value={{ usuario, rol, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
