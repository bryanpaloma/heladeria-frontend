# Heladería Glacé 🍦

Aplicación frontend para la gestión del menú e inventario de una heladería.
Construida con **React + Vite**, estilos con **TailwindCSS** y conectada a la
**API REST automática de Supabase**.

## Funcionalidades

- Catálogo de productos (copas y malteadas) con sus ingredientes, calorías,
  costo y rentabilidad.
- CRUD completo de ingredientes (crear, editar, eliminar, reabastecer y renovar
  inventario).
- Venta de productos con descuento automático de inventario y registro de la venta.
- Inicio de sesión y autorización por roles:
  - **Administrador:** acceso a todo, incluida la rentabilidad.
  - **Empleado:** acceso a todo excepto la rentabilidad.
  - **Cliente:** venta de productos, lista de productos y calorías.
  - **Público:** solo puede ver la lista de productos.
- Panel con el contador de ventas del día y el producto más rentable.

## Requisitos

- Node.js 18 o superior

## Configuración

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear un archivo `.env` en la raíz (puedes copiar `.env.example`) con las
   credenciales del proyecto de Supabase:

   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_KEY=tu-publishable-key
   ```

3. Ejecutar en modo desarrollo:

   ```bash
   npm run dev
   ```

## Usuarios de prueba

| Rol       | Correo                 | Contraseña |
|-----------|------------------------|------------|
| Admin     | admin@admin.co         | admin      |
| Empleado  | empleado@empleado.co   | empleado   |
| Cliente   | cliente@cliente.co     | cliente    |

## Despliegue

El proyecto está preparado para desplegarse en **Vercel**. Recuerda configurar
las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY` en el panel
del proyecto en Vercel.
