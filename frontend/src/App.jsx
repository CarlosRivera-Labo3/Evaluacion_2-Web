import { useState } from 'react'
import Reactor from './Reactor'
import Astro from './Astro'

function App() {
  const [ejercicio, setEjercicio] = useState('reactor')

  return (
    <>
      <nav className="flex justify-center gap-4 bg-slate-900 p-4">
        <button
          type="button"
          onClick={() => setEjercicio('reactor')}
          aria-pressed={ejercicio === 'reactor'}
          className="rounded-lg bg-cyan-700 px-4 py-2 text-white"
        >
          Ejercicio 1: Reactor
        </button>

        <button
          type="button"
          onClick={() => setEjercicio('astro')}
          aria-pressed={ejercicio === 'astro'}
          className="rounded-lg bg-cyan-700 px-4 py-2 text-white"
        >
          Ejercicio 2: AstroLogistics
        </button>
      </nav>

      <div hidden={ejercicio !== 'reactor'}>
        <Reactor />
      </div>

      <div hidden={ejercicio !== 'astro'}>
        <Astro />
      </div>
    </>
  )
}

export default App
