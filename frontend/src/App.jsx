import { useState } from 'react'
import Reactor from './Reactor'
import Astro from './Astro'

function App() {
  const [ejercicio, setEjercicio] = useState('astro')

  return (
    <>
      <nav className="flex justify-center gap-2 border-b border-slate-800 bg-slate-950 p-4">
        <button
          type="button"
          onClick={() => setEjercicio('reactor')}
          className={`rounded-lg px-6 py-2 font-medium transition-colors ${ejercicio === 'reactor' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
        >
          Ejercicio 1: Reactor
        </button>
        <button
          type="button"
          onClick={() => setEjercicio('astro')}
          className={`rounded-lg px-6 py-2 font-medium transition-colors ${ejercicio === 'astro' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
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