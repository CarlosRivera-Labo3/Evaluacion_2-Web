const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function solicitar(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, opciones)
  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'No se pudo completar la solicitud.')
  }

  return datos
}

export function obtenerInventario() {
  return solicitar('/api/inventario')
}

export function obtenerCarga() {
  return solicitar('/api/carga')
}

export function agregarCarga(equipoId, cantidad = 1) {
  return solicitar('/api/carga/agregar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ equipoId, cantidad }),
  })
}