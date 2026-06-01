import { supabase } from '../supabaseClient'

// Consultar usuario por correo y contraseña
export async function consultarUsuario(correo, password) {
  const { data, error } = await supabase
    .from('users')
    .select('id, nombre, correo, rol')
    .eq('correo', correo)
    .eq('password', password)
    .maybeSingle()

  if (error) throw error
  return data // null si las credenciales no coinciden
}
