import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Catalogo from './pages/Catalogo'
import Login from './pages/Login'
import Ingredientes from './pages/Ingredientes'
import Panel from './pages/Panel'
import { permisos } from './lib/permisos'

export default function App() {
  return (
    <div className="min-h-screen bg-pink-50 text-gray-800">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/ingredientes"
            element={
              <ProtectedRoute permitido={permisos.gestionarIngredientes}>
                <Ingredientes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/panel"
            element={
              <ProtectedRoute permitido={permisos.verPanel}>
                <Panel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <footer className="text-center text-xs text-gray-500 py-6">
        Heladería Glacé · El sabor que te congela de felicidad
      </footer>
    </div>
  )
}
