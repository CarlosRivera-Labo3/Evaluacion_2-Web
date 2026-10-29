const HistorialLista = ({ historial }) => (
  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
    <h2 className="text-lg font-bold mb-3 text-gray-700">Historial de intentos</h2>
    {historial.length === 0 ? <p className="text-gray-500 italic">Todavía no hay intentos.</p> : (
      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {historial.map((intento, indice) => (
          <li key={indice} className="bg-white p-2 rounded shadow-sm text-sm font-medium text-gray-600">Intento #{indice + 1}: <span className="text-blue-600 font-bold">{intento}</span></li>
        ))}
      </ul>
    )}
  </div>
);
export default HistorialLista;
