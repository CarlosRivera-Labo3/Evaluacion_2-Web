import React from 'react';
const MensajeEstado = ({ mensaje, estabilizado, onReiniciar, cargando }) => {
  if (!mensaje && !estabilizado) return null;
  return (
    <div className="flex flex-col gap-4 mb-6">
      {mensaje && <p role="status" className={`p-3 rounded font-medium text-center ${estabilizado ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>{mensaje}</p>}
      <button type="button" onClick={onReiniciar} disabled={cargando} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300 self-start transition">Reiniciar reactor</button>
    </div>
  );
};
export default MensajeEstado;
