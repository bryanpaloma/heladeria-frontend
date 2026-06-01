import { useEffect, useState } from 'react'
import { getCatalogo, venderProducto } from '../api/productos'
import { useAuth } from '../context/AuthContext'
import { permisos } from '../lib/permisos'

function formatoPesos(valor) {
  return '$' + Number(valor).toLocaleString('es-CO')
}

// Estilos de la banda superior segun el tipo de producto
const estiloTipo = {
  copa: { gradiente: 'from-violet-500 to-indigo-600', emoji: '🍨' },
  malteada: { gradiente: 'from-amber-400 to-orange-500', emoji: '🥤' },
}

export default function Catalogo() {
  const { usuario, rol } = useAuth()
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  async function cargar() {
    setCargando(true)
    setError('')
    try {
      const data = await getCatalogo()
      setProductos(data)
    } catch (err) {
      setError('No se pudo cargar el catálogo')
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  async function vender(producto) {
    setMensaje('')
    try {
      await venderProducto(producto.id, usuario?.id)
      const texto = rol === 'cliente' ? '¡Compra realizada: ' : 'Venta registrada: '
      setMensaje(texto + producto.nombre)
      cargar()
    } catch (err) {
      setMensaje(err.message || 'No se pudo procesar el pedido')
    }
  }

  return (
    <div>
      {/* Hero de marca */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white px-6 py-10 mb-10 shadow-lg">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute -bottom-12 -left-8 w-40 h-40 bg-amber-300/20 rounded-full" />
        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          <img src="/logo.svg" alt="Logo Glacé" className="w-24 h-24 drop-shadow-md" />
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight">Glacé</h1>
            <p className="text-violet-100 mt-1">Heladería artesanal · El sabor que te congela de felicidad</p>
            <span className="inline-block mt-3 bg-white/15 backdrop-blur text-sm px-3 py-1 rounded-full">
              Copas y malteadas hechas a mano 🍒
            </span>
          </div>
        </div>
      </header>

      {mensaje && (
        <div className="mb-8 text-center bg-emerald-50 text-emerald-700 border border-emerald-200 py-2.5 rounded-xl font-medium">
          {mensaje}
        </div>
      )}

      {cargando && <p className="text-center text-stone-500">Cargando catálogo...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {productos.map((p) => {
          const estilo = estiloTipo[p.tipo] ?? estiloTipo.copa
          return (
            <div
              key={p.id}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-200 overflow-hidden flex flex-col border border-stone-100"
            >
              {/* Banda superior segun tipo */}
              <div className={`bg-gradient-to-br ${estilo.gradiente} px-5 py-4 text-white flex items-center justify-between`}>
                <span className="text-3xl">{estilo.emoji}</span>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs uppercase tracking-wide font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                    {p.tipo}
                  </span>
                  {permisos.verCalorias(rol) && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{p.calorias} cal</span>
                  )}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-stone-800">{p.nombre}</h2>
                <p className="text-sm text-stone-400 mb-3">
                  {p.tipo === 'copa' ? `Vaso ${p.vaso}` : `${p.volumen_onzas} oz`}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.ingredientes.map((i) => (
                    <span
                      key={i.id}
                      className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200"
                    >
                      {i.nombre}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <p className="text-2xl font-extrabold text-indigo-700">{formatoPesos(p.precio_publico)}</p>

                  {(permisos.verCosto(rol) || permisos.verRentabilidad(rol)) && (
                    <div className="mt-1 space-y-0.5 text-sm">
                      {permisos.verCosto(rol) && (
                        <p className="text-stone-500">Costo: {formatoPesos(p.costo)}</p>
                      )}
                      {permisos.verRentabilidad(rol) && (
                        <p className="text-emerald-600 font-semibold">
                          Rentabilidad: {formatoPesos(p.rentabilidad)}
                        </p>
                      )}
                    </div>
                  )}

                  {permisos.vender(rol) && (
                    <button
                      onClick={() => vender(p)}
                      className="mt-4 w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] transition"
                    >
                      {rol === 'cliente' ? 'Comprar' : 'Vender'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
