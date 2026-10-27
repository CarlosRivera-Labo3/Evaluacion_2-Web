import { useState } from 'react'

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ temperatura: numero }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo enviar el ajuste.')
      }

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
      const respuesta = await fetch(`${API_URL}/reboot`, {
        method: 'POST',
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo reiniciar el reactor.')
      }

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
    <main>
      <h1>Estabiliza el Reactor</h1>
      <p>Ingresá una temperatura entre 1 y 100.</p>

      <form onSubmit={ajustarTemperatura}>
        <label htmlFor="temperatura">Temperatura:</label>{' '}
        <input
          id="temperatura"
          type="number"
          min="1"
          max="100"
          step="1"
          value={temperatura}
          onChange={(evento) => setTemperatura(evento.target.value)}
          disabled={estabilizado || cargando}
          required
        />
        <button type="submit" disabled={estabilizado || cargando}>
          Ajustar
        </button>
      </form>

      {mensaje && <p role="status">{mensaje}</p>}

      <h2>Historial de intentos</h2>
      {historial.length === 0 ? (
        <p>Todavía no hay intentos.</p>
      ) : (
        <ul>
          {historial.map((intento, indice) => (
            <li key={indice}>{intento}</li>
          ))}
        </ul>
      )}

      <button type="button" onClick={reiniciarReactor} disabled={cargando}>
        Reiniciar reactor
      </button>
    </main>
  )
}

export default App