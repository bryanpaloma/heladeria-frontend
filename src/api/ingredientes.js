import { supabase } from '../supabaseClient'

// Consultar todos los ingredientes
export async function getIngredientes() {
  const { data, error } = await supabase
    .from('ingredientes')
    .select('*')
    .order('id')
  if (error) throw error
  return data
}

// Consultar un ingrediente segun su ID
export async function getIngredientePorId(id) {
  const { data, error } = await supabase
    .from('ingredientes')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

// Consultar un ingrediente segun su nombre
export async function getIngredientePorNombre(nombre) {
  const { data, error } = await supabase
    .from('ingredientes')
    .select('*')
    .ilike('nombre', nombre)
    .maybeSingle()
  if (error) throw error
  return data
}

// Consultar si un ingrediente es sano segun su ID
export async function esSano(id) {
  const ing = await getIngredientePorId(id)
  return ing.es_sano
}

// Crear ingrediente (CRUD)
export async function crearIngrediente(ingrediente) {
  const { data, error } = await supabase
    .from('ingredientes')
    .insert(ingrediente)
    .select()
    .single()
  if (error) throw error
  return data
}

// Actualizar ingrediente (CRUD)
export async function actualizarIngrediente(id, cambios) {
  const { data, error } = await supabase
    .from('ingredientes')
    .update(cambios)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Eliminar ingrediente (CRUD)
export async function eliminarIngrediente(id) {
  const { error } = await supabase
    .from('ingredientes')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Reabastecer un ingrediente segun su ID (suma cantidad al inventario)
export async function reabastecer(id, cantidad) {
  const ing = await getIngredientePorId(id)
  return actualizarIngrediente(id, { inventario: ing.inventario + cantidad })
}

// Renovar el inventario de un ingrediente (poner a 0 si es complemento)
export async function renovarInventario(id) {
  const ing = await getIngredientePorId(id)
  if (ing.tipo !== 'complemento') {
    throw new Error('Solo los complementos pueden renovar su inventario a 0')
  }
  return actualizarIngrediente(id, { inventario: 0 })
}
