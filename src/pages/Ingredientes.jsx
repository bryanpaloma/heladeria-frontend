import { useEffect, useState } from 'react'
import {
  getIngredientes,
  crearIngrediente,
  actualizarIngrediente,
  eliminarIngrediente,
  reabastecer,
  renovarInventario,
} from '../api/ingredientes'

const formularioVacio = {
  nombre: '',
  precio: '',
  calorias: '',
  inventario: '',
  es_vegetariano: false,
  es_sano: true,
  tipo: 'base',
  sabor: '',
}

export default function Ingredientes() {
  const [ingredientes, setIngredientes] = useState([])
  const [form, setForm] = useState(formularioVacio)
  const [editandoId, setEditandoId] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  async function cargar() {
    setCargando(true)
    try {
      setIngredientes(await getIngredientes())
    } catch (err) {
      setError('No se pudieron cargar los ingredientes')
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  function cambiar(e) {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  function limpiar() {
    setForm(formularioVacio)
    setEditandoId(null)
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    try {
      const datos = {
        nombre: form.nombre,
        precio: Number(form.precio),
        calorias: Number(form.calorias),
        inventario: Number(form.inventario),
        es_vegetariano: form.es_vegetariano,
        es_sano: form.es_sano,
        tipo: form.tipo,
        sabor: form.tipo === 'base' ? form.sabor : null,
      }
      if (editandoId) {
        await actualizarIngrediente(editandoId, datos)
      } else {
        await crearIngrediente(datos)
      }
      limpiar()
      cargar()
    } catch (err) {
      setError('No se pudo guardar el ingrediente')
      console.error(err)
    }
  }

  function editar(ing) {
    setEditandoId(ing.id)
    setForm({
      nombre: ing.nombre,
      precio: ing.precio,
      calorias: ing.calorias,
      inventario: ing.inventario,
      es_vegetariano: ing.es_vegetariano,
      es_sano: ing.es_sano,
      tipo: ing.tipo,
      sabor: ing.sabor ?? '',
    })
  }

  async function borrar(id) {
    if (!confirm('¿Eliminar este ingrediente?')) return
    try {
      await eliminarIngrediente(id)
      cargar()
    } catch (err) {
      setError('No se pudo eliminar (puede estar en uso por un producto)')
      console.error(err)
    }
  }

  async function reabastecerIng(id) {
    const cantidad = Number(prompt('¿Cuántas unidades desea agregar?', '10'))
    if (!cantidad || cantidad <= 0) return
    await reabastecer(id, cantidad)
    cargar()
  }

  async function renovar(id) {
    try {
      await renovarInventario(id)
      cargar()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Gestión de ingredientes</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={guardar} className="bg-white rounded-2xl shadow-sm p-5 mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <input name="nombre" value={form.nombre} onChange={cambiar} required placeholder="Nombre"
          className="border border-gray-300 rounded-lg px-3 py-2" />
        <input name="precio" value={form.precio} onChange={cambiar} required type="number" step="0.01" placeholder="Precio"
          className="border border-gray-300 rounded-lg px-3 py-2" />
        <input name="calorias" value={form.calorias} onChange={cambiar} required type="number" placeholder="Calorías"
          className="border border-gray-300 rounded-lg px-3 py-2" />
        <input name="inventario" value={form.inventario} onChange={cambiar} required type="number" placeholder="Inventario"
          className="border border-gray-300 rounded-lg px-3 py-2" />

        <select name="tipo" value={form.tipo} onChange={cambiar}
          className="border border-gray-300 rounded-lg px-3 py-2">
          <option value="base">Base</option>
          <option value="complemento">Complemento</option>
        </select>

        {form.tipo === 'base' && (
          <input name="sabor" value={form.sabor} onChange={cambiar} placeholder="Sabor"
            className="border border-gray-300 rounded-lg px-3 py-2" />
        )}

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="es_vegetariano" checked={form.es_vegetariano} onChange={cambiar} />
          Vegetariano
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="es_sano" checked={form.es_sano} onChange={cambiar} />
          Sano
        </label>

        <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
          <button type="submit" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90">
            {editandoId ? 'Actualizar' : 'Agregar'}
          </button>
          {editandoId && (
            <button type="button" onClick={limpiar} className="px-4 py-2 rounded-lg border border-gray-300">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {cargando ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-violet-100 text-violet-700">
              <tr>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Precio</th>
                <th className="px-3 py-2">Cal</th>
                <th className="px-3 py-2">Inventario</th>
                <th className="px-3 py-2">Veg</th>
                <th className="px-3 py-2">Sano</th>
                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ingredientes.map((i) => (
                <tr key={i.id} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-medium">
                    {i.nombre}
                    {i.tipo === 'base' && i.sabor && (
                      <span className="text-gray-400"> · {i.sabor}</span>
                    )}
                  </td>
                  <td className="px-3 py-2 capitalize">{i.tipo}</td>
                  <td className="px-3 py-2">${Number(i.precio).toLocaleString('es-CO')}</td>
                  <td className="px-3 py-2">{i.calorias}</td>
                  <td className="px-3 py-2">{i.inventario}</td>
                  <td className="px-3 py-2">{i.es_vegetariano ? '✅' : '—'}</td>
                  <td className="px-3 py-2">{i.es_sano ? '✅' : '—'}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      <button onClick={() => editar(i)} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Editar</button>
                      <button onClick={() => borrar(i.id)} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Eliminar</button>
                      <button onClick={() => reabastecerIng(i.id)} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Reabastecer</button>
                      {i.tipo === 'complemento' && (
                        <button onClick={() => renovar(i.id)} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Renovar (0)</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
