import React from 'react';
const FormularioAjuste = ({ temperatura, setTemperatura, onSubmit, deshabilitado }) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-4 mb-6">
    <div className="flex flex-col gap-2">
      <label htmlFor="temperatura" className="font-semibold text-gray-700">Temperatura (1-100):</label>
      <input id="temperatura" type="number" min="1" max="100" value={temperatura} onChange={(e) => setTemperatura(e.target.value)} disabled={deshabilitado} required className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200" />
    </div>
    <button type="submit" disabled={deshabilitado} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold disabled:bg-blue-300 transition">Ajustar</button>
  </form>
);
export default FormularioAjuste;
