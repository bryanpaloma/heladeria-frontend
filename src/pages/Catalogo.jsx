import { useEffect, useState } from 'react'
import { getCatalogo, venderProducto } from '../api/productos'
import { useAuth } from '../context/AuthContext'
import { permisos } from '../lib/permisos'

function formatoPesos(valor) {
  return '$' + Number(valor).toLocaleString('es-CO')
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

  if (cargando) return <p className="text-center text-gray-500">Cargando catálogo...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pink-600">Nuestro menú</h1>
        <p className="text-gray-500">Copas y malteadas hechas con amor</p>
      </header>

      {mensaje && (
        <div className="mb-6 text-center bg-pink-100 text-pink-700 py-2 rounded-lg">
          {mensaje}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {productos.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 flex flex-col">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold text-gray-800">{p.nombre}</h2>
              <span className="text-xs uppercase font-semibold bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                {p.tipo}
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-3">
              {p.tipo === 'copa' ? `Vaso ${p.vaso}` : `${p.volumen_onzas} oz`}
            </p>

            <div className="text-sm text-gray-600 mb-3">
              <p className="font-medium text-gray-700 mb-1">Ingredientes:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {p.ingredientes.map((i) => (
                  <li key={i.id}>{i.nombre}</li>
                ))}
              </ul>
            </div>

            <div className="mt-auto space-y-1 text-sm">
              <p className="text-xl font-bold text-pink-600">{formatoPesos(p.precio_publico)}</p>

              {permisos.verCalorias(rol) && (
                <p className="text-gray-500">{p.calorias} cal</p>
              )}
              {permisos.verCosto(rol) && (
                <p className="text-gray-500">Costo: {formatoPesos(p.costo)}</p>
              )}
              {permisos.verRentabilidad(rol) && (
                <p className="text-green-600 font-medium">
                  Rentabilidad: {formatoPesos(p.rentabilidad)}
                </p>
              )}
            </div>

            {permisos.vender(rol) && (
              <button
                onClick={() => vender(p)}
                className="mt-4 bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700"
              >
                {rol === 'cliente' ? 'Comprar' : 'Vender'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
