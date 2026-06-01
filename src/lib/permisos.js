// Reglas de autorizacion por rol.
// Roles posibles: admin, empleado, cliente, publico (sin autenticar)

export const permisos = {
  // Ingredientes (CRUD): admin y empleado
  gestionarIngredientes: (rol) => rol === 'admin' || rol === 'empleado',

  // Panel de control / reportes: admin y empleado
  verPanel: (rol) => rol === 'admin' || rol === 'empleado',

  // Rentabilidad: solo admin (el empleado no ve rentabilidad)
  verRentabilidad: (rol) => rol === 'admin',

  // Costo de produccion: admin y empleado
  verCosto: (rol) => rol === 'admin' || rol === 'empleado',

  // Calorias: admin, empleado y cliente
  verCalorias: (rol) => rol === 'admin' || rol === 'empleado' || rol === 'cliente',

  // Vender productos: admin, empleado y cliente
  vender: (rol) => rol === 'admin' || rol === 'empleado' || rol === 'cliente',
}
