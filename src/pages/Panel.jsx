import { useEffect, useState } from 'react'
import { getVentasDeHoy, getCatalogo, getProductoMasRentable } from '../api/productos'
import { useAuth } from '../context/AuthContext'
import { permisos } from '../lib/permisos'

function formatoPesos(valor) {
  return '$' + Number(valor).toLocaleString('es-CO')
}

export default function Panel() {
  const { rol } = useAuth()
  const [ventas, setVentas] = useState(null)
  const [productos, setProductos] = useState([])
  const [masRentable, setMasRentable] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        setVentas(await getVentasDeHoy())
        if (permisos.verRentabilidad(rol)) {
          setProductos(await getCatalogo())
          setMasRentable(await getProductoMasRentable())
        }
      } catch (err) {
        console.error(err)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [rol])

  if (cargando) return <p className="text-gray-500">Cargando panel...</p>

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Panel de control</h1>

      {/* Contador de ventas del dia */}
      <section className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
          <p className="text-sm text-gray-500">Ventas de hoy</p>
          <p className="text-3xl font-bold text-indigo-700">{ventas.numeroVentas}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
          <p className="text-sm text-gray-500">Unidades vendidas</p>
          <p className="text-3xl font-bold text-indigo-700">{ventas.unidades}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
          <p className="text-sm text-gray-500">Total recaudado</p>
          <p className="text-3xl font-bold text-indigo-700">{formatoPesos(ventas.totalRecaudado)}</p>
        </div>
      </section>

      {/* Rentabilidad: solo admin */}
      {permisos.verRentabilidad(rol) && (
        <>
          {masRentable && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
              <p className="text-sm text-green-700">Producto más rentable</p>
              <p className="text-2xl font-bold text-green-700">
                {masRentable.nombre} · {formatoPesos(masRentable.rentabilidad)}
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-violet-100 text-violet-700">
                <tr>
                  <th className="px-3 py-2">Producto</th>
                  <th className="px-3 py-2">Precio</th>
                  <th className="px-3 py-2">Costo</th>
                  <th className="px-3 py-2">Rentabilidad</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="px-3 py-2 font-medium">{p.nombre}</td>
                    <td className="px-3 py-2">{formatoPesos(p.precio_publico)}</td>
                    <td className="px-3 py-2">{formatoPesos(p.costo)}</td>
                    <td className="px-3 py-2 text-green-600 font-medium">{formatoPesos(p.rentabilidad)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
