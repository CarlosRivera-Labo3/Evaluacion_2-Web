import { useState } from 'react'

function MensajeEstado({ estabilizado, mensaje }) {
  if (estabilizado === null) return <p className="text-slate-400 text-center py-2">Esperando acción...</p>
  
  const esExito = 
    estabilizado === true || 
    String(estabilizado).toLowerCase().includes('estabilizado') ||
    String(mensaje).toLowerCase().includes('estabilizado')

  if (esExito) {
    return (
      <div className="p-3 rounded-lg text-center font-bold bg-emerald-900/50 text-emerald-400 border border-emerald-700">
        Estabilizado
      </div>
    )
  }

  return (
    <div className="p-3 rounded-lg text-center font-bold bg-red-900/50 text-red-400 border border-red-700 animate-pulse">
      {mensaje || 'Temperatura fuera de rango'}
    </div>
  )
}

function FormularioAjuste({ onAjustar, cargando }) {
  const [temperatura, setTemperatura] = useState('')
  const [errorLocal, setErrorLocal] = useState('')
  const [intentoLetra, setIntentoLetra] = useState(false)

  const handleChange = (e) => {
    const valor = e.target.value
    
    if (/[^0-9]/.test(valor) && valor !== '') {
      setIntentoLetra(true)
      setTimeout(() => setIntentoLetra(false), 3000)
      return
    }
    
    setTemperatura(valor)
    setErrorLocal('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorLocal('')

    if (!temperatura) {
      setErrorLocal('Por favor, ingresá un número.')
      return
    }

    const num = Number(temperatura)

    if (num < 1 || num > 100) {
      setErrorLocal('El rango válido es de 1 a 100.')
      return
    }

    onAjustar(num)
    setTemperatura('')
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={temperatura}
          onChange={handleChange}
          placeholder="Ej: 50"
          className={`flex-1 bg-slate-800 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${
            errorLocal || intentoLetra ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-cyan-500'
          }`}
          disabled={cargando}
        />
        <button
          type="submit"
          disabled={cargando || !temperatura}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-2 rounded-lg disabled:opacity-50"
        >
          Ajustar
        </button>
      </form>
      
      {intentoLetra && (
        <p className="text-red-500 text-sm mt-2 font-bold animate-pulse">
          ⚠️ No se puede ingresar texto. Solo números del 1 al 100.
        </p>
      )}

      {errorLocal && (
        <p className="text-red-400 text-sm mt-2 font-semibold">{errorLocal}</p>
      )}
    </div>
  )
}

function HistorialLista({ historial }) {
  if (historial.length === 0) return <p className="text-slate-500 text-sm text-center">No hay ajustes recientes.</p>

  return (
    <ul className="space-y-2 max-h-40 overflow-y-auto">
      {historial.map((item, index) => {
        const esExito = 
          item.estabilizado === true || 
          String(item.estabilizado).toLowerCase().includes('estabilizado') ||
          String(item.mensaje).toLowerCase().includes('estabilizado')
          
        return (
          <li key={index} className="flex justify-between items-center bg-slate-800/50 p-2 rounded border border-slate-700 text-sm">
            <span className="text-slate-300">Intento: {item.intento}°C</span>
            <span className={esExito ? 'text-emerald-400' : 'text-red-400'}>
              {item.mensaje}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default function Reactor() {
  const [mensaje, setMensaje] = useState('')
  const [estabilizado, setEstabilizado] = useState(null)
  const [historial, setHistorial] = useState([])
  const [cargando, setCargando] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

  async function ajustarTemperatura(valor) {
    setCargando(true)
    setMensaje('')

    try {
      const respuesta = await fetch(`${API_URL}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperatura: valor }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al ajustar')
      }

      setMensaje(datos.mensaje)
      setEstabilizado(datos.estabilizado)
      
      setHistorial((prev) => [
        { intento: valor, mensaje: datos.mensaje, estabilizado: datos.estabilizado },
        ...prev,
      ])

    } catch (error) {
      setMensaje(error.message)
      setEstabilizado(false)
    } finally {
      setCargando(false)
    }
  }

  async function reiniciar() {
    setCargando(true)
    setMensaje('')

    try {
      const respuesta = await fetch(`${API_URL}/reboot`, {
        method: 'POST',
      })
      const datos = await respuesta.json()

      if (!respuesta.ok) throw new Error(datos.mensaje || 'Error al reiniciar')

      setMensaje('Reactor reiniciado correctamente.')
      setEstabilizado(null)
      setHistorial([])

    } catch (error) {
      setMensaje(error.message)
    } finally {
      setCargando(false)
    }
  }

  const esVerde = 
    estabilizado === true || 
    String(estabilizado).toLowerCase().includes('estabilizado') ||
    String(mensaje).toLowerCase().includes('estabilizado')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 transition-colors duration-500">
      <div className={`w-full max-w-md rounded-xl p-6 shadow-xl border transition-all duration-500 ${
        esVerde 
          ? 'bg-emerald-950/30 border-emerald-800' 
          : 'bg-slate-900 border-slate-800'
      }`}>
        
        <h1 className={`text-2xl font-bold mb-6 text-center transition-colors duration-500 ${esVerde ? 'text-emerald-400' : 'text-cyan-400'}`}>
          Estabilizar Reactor
        </h1>

        <div className={`w-full h-48 rounded-lg border mb-6 flex items-center justify-center overflow-hidden p-4 transition-all duration-500 ${
          esVerde ? 'bg-emerald-950/50 border-emerald-900' : 'bg-slate-950 border-slate-800'
        }`}>
          <img 
            src="/Reactor.jpeg" 
            alt="Reactor" 
            className={`object-contain w-full h-full opacity-90 transition-all duration-500 ${
              esVerde 
                ? 'drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]' 
                : 'drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]'
            }`}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <span className="hidden text-slate-600 text-sm text-center px-4">
            Imagen no encontrada. Asegurate de que <b>Reactor.jpeg</b> esté en la carpeta <b>public</b>.
          </span>
        </div>

        <MensajeEstado estabilizado={estabilizado} mensaje={mensaje} />

        <div className={`mt-6 transition-opacity duration-500 ${esVerde ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Ajustar Temperatura</h2>
          <FormularioAjuste onAjustar={ajustarTemperatura} cargando={cargando} />
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Historial de Intentos</h2>
          <HistorialLista historial={historial} />
        </div>

        <button
          onClick={reiniciar}
          disabled={cargando}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          Reiniciar Reactor
        </button>

      </div>
    </div>
  )
}