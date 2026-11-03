import { useEffect, useState } from 'react'
import { obtenerInventario, obtenerCarga, agregarCarga } from './api'
import BodegaPanel from './BodegaPanel'

function Astro() {
  const [inventario, setInventario] = useState([])
  const [carga, setCarga] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarDatos() {
      try {
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
    cargarDatos()
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
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-cyan-400">AstroLogistics</h1>
          
          <div className="flex gap-4">
            <div className="rounded-lg bg-emerald-950/50 border border-emerald-900 px-4 py-2 text-emerald-300">
              Créditos: <strong className="text-emerald-400">{carga ? `${carga.creditos.toFixed(2)} Cr` : '—'}</strong>
            </div>
            <div className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-slate-300">
              Costo total: <strong className="text-white">{carga ? `${carga.total.toFixed(2)} Cr` : '—'}</strong>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 p-6 lg:flex-row">
        <div className="flex-1">
          {error && (
            <div key={error} className="mb-6 flex items-center justify-between rounded-lg border border-red-900 bg-red-950/50 p-4 text-red-200 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <p className="font-medium">{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-red-400 hover:text-white">✕</button>
            </div>
          )}

          <h2 className="mb-4 text-xl font-semibold text-slate-200">Catálogo de la base</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {inventario.map((equipo) => (
              <article key={equipo.id} className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-cyan-500">{equipo.categoria}</p>
                <h3 className="mb-2 text-lg font-bold text-white">{equipo.nombre}</h3>
                <p className="mb-3 text-lg font-bold text-emerald-400">{equipo.precio.toFixed(2)} Cr</p>
                <p className="mb-5 text-sm text-slate-400">Stock: {equipo.stock} unidades</p>
                
                <button
                  onClick={() => añadirALaNave(equipo.id)}
                  disabled={equipo.stock === 0 || cargando || carga === null}
                  className="mt-auto rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
                >
                  {equipo.stock === 0 ? 'Agotado en Base' : 'Añadir a la Nave'}
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[400px] shrink-0">
          <div className="sticky top-24">
            <BodegaPanel
              carga={carga}
              setCarga={setCarga}
              inventario={inventario}
              setInventario={setInventario}
              setError={setError}
              cargando={cargando}
              setCargando={setCargando}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Astro