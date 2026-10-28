import { useState } from 'react'
import FormularioAjuste from './components/FormularioAjuste'
import MensajeEstado from './components/MensajeEstado'
import HistorialLista from './components/HistorialLista'

const API_URL = 'http://localhost:3000'

function App() {
  const [temperatura, setTemperatura] = useState('')
  const [historial, setHistorial] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [estabilizado, setEstabilizado] = useState(false)
  const [cargando, setCargando] = useState(false)

  async function ajustarTemperatura(evento) {
    evento.preventDefault()
    if (temperatura === '' || estabilizado || cargando) return

    const numero = Number(temperatura)
    if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
      setMensaje('Ingresá un número entero entre 1 y 100.')
      return
    }

    setCargando(true)
    try {
      const respuesta = await fetch(`${API_URL}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperatura: numero }),
      })
      const datos = await respuesta.json()

      if (!respuesta.ok) throw new Error(datos.mensaje || 'No se pudo enviar el ajuste.')

      setHistorial((anterior) => [...anterior, numero])
      setMensaje(datos.mensaje)
      setEstabilizado(datos.exito)
      setTemperatura('')
    } catch (error) {
      setMensaje(error.message || 'No se pudo conectar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  async function reiniciarReactor() {
    if (cargando) return
    setCargando(true)
    try {
      const respuesta = await fetch(`${API_URL}/reboot`, { method: 'POST' })
      const datos = await respuesta.json()

      if (!respuesta.ok) throw new Error(datos.mensaje || 'No se pudo reiniciar el reactor.')

      setHistorial([])
      setMensaje(datos.mensaje)
      setEstabilizado(false)
      setTemperatura('')
    } catch (error) {
      setMensaje(error.message || 'No se pudo conectar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <main className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Estabiliza el Reactor
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Ingresá una temperatura entre 1 y 100.
        </p>

        <FormularioAjuste 
          temperatura={temperatura} 
          setTemperatura={setTemperatura} 
          onSubmit={ajustarTemperatura} 
          deshabilitado={estabilizado || cargando} 
        />

        <MensajeEstado 
          mensaje={mensaje} 
          estabilizado={estabilizado} 
          onReiniciar={reiniciarReactor} 
          cargando={cargando} 
        />

        <HistorialLista historial={historial} />
      </main>
    </div>
  )
}

export default App
