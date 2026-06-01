import { supabase } from '../supabaseClient'

// Consultar todos los productos
export async function getProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('id')
  if (error) throw error
  return data
}

// Consultar un producto segun su ID
export async function getProductoPorId(id) {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

// Consultar un producto segun su nombre
export async function getProductoPorNombre(nombre) {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .ilike('nombre', nombre)
    .maybeSingle()
  if (error) throw error
  return data
}

// Consultar las calorias de un producto segun su ID
export async function getCalorias(id) {
  const { data, error } = await supabase
    .from('v_calorias_producto')
    .select('total_calorias')
    .eq('producto_id', id)
    .single()
  if (error) throw error
  return data.total_calorias
}

// Consultar el costo de produccion de un producto segun su ID
export async function getCosto(id) {
  const { data, error } = await supabase
    .from('v_costo_producto')
    .select('costo')
    .eq('producto_id', id)
    .single()
  if (error) throw error
  return data.costo
}

// Consultar la rentabilidad de un producto segun su ID
export async function getRentabilidad(id) {
  const { data, error } = await supabase
    .from('v_rentabilidad_producto')
    .select('rentabilidad')
    .eq('producto_id', id)
    .single()
  if (error) throw error
  return data.rentabilidad
}

// Listado de productos con sus ingredientes, calorias, costo y rentabilidad
export async function getCatalogo() {
  const productos = await getProductos()

  const { data: relacion, error: errRel } = await supabase
    .from('producto_ingrediente')
    .select('producto_id, ingredientes(*)')
  if (errRel) throw errRel

  const { data: calorias } = await supabase.from('v_calorias_producto').select('*')
  const { data: costos } = await supabase.from('v_costo_producto').select('*')
  const { data: rentabilidad } = await supabase.from('v_rentabilidad_producto').select('*')

  return productos.map((p) => ({
    ...p,
    ingredientes: relacion
      .filter((r) => r.producto_id === p.id)
      .map((r) => r.ingredientes),
    calorias: calorias.find((c) => c.producto_id === p.id)?.total_calorias ?? 0,
    costo: costos.find((c) => c.producto_id === p.id)?.costo ?? 0,
    rentabilidad: rentabilidad.find((c) => c.producto_id === p.id)?.rentabilidad ?? 0,
  }))
}

// Producto mas rentable
export async function getProductoMasRentable() {
  const { data, error } = await supabase
    .from('v_rentabilidad_producto')
    .select('*')
    .order('rentabilidad', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

// Vender un producto segun su ID:
// revisa que haya inventario de sus ingredientes, lo descuenta y registra la venta
export async function venderProducto(productoId, userId) {
  const producto = await getProductoPorId(productoId)

  const { data: relacion, error: errRel } = await supabase
    .from('producto_ingrediente')
    .select('ingrediente_id, ingredientes(*)')
    .eq('producto_id', productoId)
  if (errRel) throw errRel

  // Revisar inventario disponible
  const sinStock = relacion.filter((r) => r.ingredientes.inventario < 1)
  if (sinStock.length > 0) {
    const nombres = sinStock.map((r) => r.ingredientes.nombre).join(', ')
    throw new Error('No hay inventario suficiente de: ' + nombres)
  }

  // Descontar una porcion de cada ingrediente
  for (const r of relacion) {
    const { error } = await supabase
      .from('ingredientes')
      .update({ inventario: r.ingredientes.inventario - 1 })
      .eq('id', r.ingrediente_id)
    if (error) throw error
  }

  // Registrar la venta
  const { error: errVenta } = await supabase.from('ventas').insert({
    producto_id: productoId,
    user_id: userId ?? null,
    cantidad: 1,
    total: producto.precio_publico,
  })
  if (errVenta) throw errVenta

  return true
}

// Contador de ventas del dia
export async function getVentasDeHoy() {
  const inicioDia = new Date()
  inicioDia.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('ventas')
    .select('id, cantidad, total')
    .gte('fecha', inicioDia.toISOString())
  if (error) throw error

  return {
    numeroVentas: data.length,
    unidades: data.reduce((acc, v) => acc + v.cantidad, 0),
    totalRecaudado: data.reduce((acc, v) => acc + Number(v.total), 0),
  }
}
