import { useEffect, useState } from 'react'
import {
  obtenerInventario,
  obtenerCarga,
  agregarCarga,
} from './api'

function App() {
  const [inventario, setInventario] = useState([])
  const [carga, setCarga] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true

    async function cargarDatos() {
      try {
        const [nuevoInventario, nuevaCarga] = await Promise.all([
          obtenerInventario(),
          obtenerCarga(),
        ])

        if (activo) {
          setInventario(nuevoInventario)
          setCarga(nuevaCarga)
        }
      } catch (error) {
        if (activo) setError(error.message)
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarDatos()

    return () => {
      activo = false
    }
  }, [])

  async function añadirALaNave(equipoId) {
    if (cargando || carga === null) return

    setCargando(true)
    setError('')

    try {
      await agregarCarga(equipoId)

      const [nuevoInventario, nuevaCarga] = await Promise.all([
        obtenerInventario(),
        obtenerCarga(),
      ])

      setInventario(nuevoInventario)
      setCarga(nuevaCarga)
    } catch (error) {
      setError(error.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-700 bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">
              AstroLogistics
            </h1>
            <p className="mt-1 text-slate-400">
              Prepará los suministros de tu misión.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <p className="rounded-lg bg-emerald-950 px-4 py-3 text-emerald-300">
              Créditos disponibles:{' '}
              <strong>
                {carga ? `${carga.creditos.toFixed(2)} Cr` : '—'}
              </strong>
            </p>

            <p className="rounded-lg bg-slate-800 px-4 py-3">
              Costo total:{' '}
              <strong>
                {carga ? `${carga.total.toFixed(2)} Cr` : '—'}
              </strong>
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-amber-600 bg-amber-950 p-4 text-amber-200"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setError('')}
              aria-label="Cerrar mensaje de error"
              className="rounded px-3 py-1 hover:bg-amber-900"
            >
              ✕
            </button>
          </div>
        )}

        <h2 className="mb-4 text-2xl font-semibold">
          Catálogo de la base
        </h2>

        <p role="status" className="mb-4 text-slate-400">
          {cargando ? 'Consultando suministros…' : ''}
        </p>

        {!cargando && !error && inventario.length === 0 && (
          <p>No hay suministros disponibles.</p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {inventario.map((equipo) => (
            <article
              key={equipo.id}
              className="flex flex-col rounded-xl border border-slate-700 bg-slate-900 p-5"
            >
              <p className="mb-2 text-sm text-cyan-400">
                {equipo.categoria}
              </p>

              <h3 className="mb-4 text-xl font-semibold">
                {equipo.nombre}
              </h3>

              <p className="mb-2 font-bold text-emerald-400">
                {equipo.precio.toFixed(2)} Cr
              </p>

              <p className="mb-5 text-slate-400">
                Stock en base: {equipo.stock}
              </p>

              <button
                type="button"
                onClick={() => añadirALaNave(equipo.id)}
                disabled={equipo.stock === 0 || cargando || carga === null}
                className="mt-auto rounded-lg bg-cyan-600 px-4 py-3 font-semibold hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                {equipo.stock === 0
                  ? 'Agotado en Base'
                  : 'Añadir a la Nave'}
              </button>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
