import { useEffect, useState } from 'react'
import { obtenerInventario, obtenerCarga, actualizarUnidades, eliminarCarga } from './api'

export default function BodegaPanel({
  carga,
  setCarga,
  inventario,
  setInventario,
  setError,
  cargando,
  setCargando,
}) {
  const [tiempoRestante, setTiempoRestante] = useState(60)
  const [sesionCerrada, setSesionCerrada] = useState(false)
  const [calculandoPeso, setCalculandoPeso] = useState(false)

  useEffect(() => {
    if (tiempoRestante <= 0) {
      setSesionCerrada(true)
      return
    }
    const timer = setInterval(() => setTiempoRestante((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [tiempoRestante])

  useEffect(() => {
    if (!carga) return
    setCalculandoPeso(true)
    const delay = setTimeout(() => setCalculandoPeso(false), 600)
    return () => clearTimeout(delay)
  }, [carga])

  async function refrescarDatos() {
    try {
      const [nuevoInventario, nuevaCarga] = await Promise.all([
        obtenerInventario(),
        obtenerCarga(),
      ])
      setInventario(nuevoInventario)
      setCarga(nuevaCarga)
    } catch (err) {
      setError(err.message)
    }
  }

  async function manejarCantidad(equipoId, delta) {
    if (cargando) return
    setCargando(true)
    setError('')
    try {
      await actualizarUnidades(equipoId, delta)
      await refrescarDatos()
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  async function manejarDesembarcar(equipoId) {
    if (cargando) return
    setCargando(true)
    setError('')
    try {
      await eliminarCarga(equipoId)
      await refrescarDatos()
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  const itemsEnNave = (carga && carga.itemsCargados) || []
  
  const pesoTotal = itemsEnNave.reduce((acc, item) => {
    const datos = (inventario || []).find((inv) => inv.id === item.id) || {}
    let pesoUnitario = datos.peso || 0
    
    if (pesoUnitario === 0) {
      if (datos.categoria === 'Soporte Vital') pesoUnitario = 15
      else if (datos.categoria === 'Alimentos') pesoUnitario = 5
      else if (datos.categoria === 'Energía') pesoUnitario = 25
      else if (datos.categoria === 'Medicina') pesoUnitario = 2
      else if (datos.categoria === 'Equipo') pesoUnitario = 30
      else pesoUnitario = 10
    }
    return acc + pesoUnitario * item.cantidad
  }, 0)

  const cantidadTotalItems = itemsEnNave.reduce((acc, item) => acc + item.cantidad, 0)

  if (sesionCerrada) {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-red-900 bg-slate-900 p-6 text-white shadow-xl">
        <h2 className="mb-2 text-xl font-bold text-red-500">Sesión cerrada</h2>
        <p className="mb-6 text-center text-sm text-slate-400">La ventana de lanzamiento ha terminado.</p>
        <button
          onClick={() => {
            setTiempoRestante(60)
            setSesionCerrada(false)
          }}
          className="rounded-lg bg-cyan-600 px-6 py-2 font-semibold text-white hover:bg-cyan-500"
        >
          Reiniciar
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/80 shadow-xl">
      <div className="border-b border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white">Bodega de Carga</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-600 text-xs font-bold text-white">
              {cantidadTotalItems}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-cyan-950/50 px-3 py-1 text-cyan-400 border border-cyan-900">
            <span className="text-xs">⏳</span>
            <span className="text-sm font-mono font-bold">{tiempoRestante}s</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-h-[50vh] min-h-[200px]">
        {itemsEnNave.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No hay items en la nave.
          </div>
        ) : (
          <ul className="space-y-3">
            {itemsEnNave.map((item) => {
              const datos = (inventario || []).find((inv) => inv.id === item.id) || {}
              return (
                <li key={item.id} className="rounded-lg border border-slate-800 bg-slate-800/50 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{datos.nombre || `Equipo ${item.id}`}</span>
                    <span className="rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
                      {item.cantidad} un.
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900">
                      <button onClick={() => manejarCantidad(item.id, -1)} disabled={cargando} className="px-3 py-1 text-slate-400 hover:text-white disabled:opacity-50">-</button>
                      <span className="w-8 text-center text-sm font-medium text-white">{item.cantidad}</span>
                      <button onClick={() => manejarCantidad(item.id, 1)} disabled={cargando} className="px-3 py-1 text-slate-400 hover:text-white disabled:opacity-50">+</button>
                    </div>
                    <button 
                      onClick={() => manejarDesembarcar(item.id)} 
                      disabled={cargando} 
                      className="rounded-lg bg-red-950/50 px-3 py-1.5 text-xs font-semibold text-red-400 border border-red-900/50 hover:bg-red-900/50 disabled:opacity-50"
                    >
                      Desembarcar
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Peso total:</span>
          {calculandoPeso ? (
            <span className="animate-pulse text-yellow-400">Calculando peso...</span>
          ) : (
            <span className="font-bold text-emerald-400">{pesoTotal.toFixed(2)} kg</span>
          )}
        </div>
      </div>
    </div>
  )
}