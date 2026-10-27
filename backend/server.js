const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Temperatura objetivo generada aleatoriamente al iniciar el servidor (1-100)
let temperaturaObjetivo = Math.floor(Math.random() * 100) + 1;

console.log(`Servidor iniciado. Temperatura de estabilización: ${temperaturaObjetivo}`);

// POST /adjust — recibe la temperatura del cliente y compara con la objetivo
app.post('/adjust', (req, res) => {
  const { temperatura } = req.body;

  if (temperatura === temperaturaObjetivo) {
    return res.status(200).json({ mensaje: 'estabilizado', exito: true });
  }

  if (temperatura < temperaturaObjetivo) {
    return res.status(200).json({ mensaje: 'más alta', exito: false });
  }

  return res.status(200).json({ mensaje: 'más baja', exito: false });
});

// POST /reboot — reinicia el sistema con una nueva temperatura objetivo
// Nota: la lógica de validación de entrada (rango 1-100, 400) la implementa la Parte B
app.post('/reboot', (req, res) => {
  temperaturaObjetivo = Math.floor(Math.random() * 100) + 1;
  console.log(`Sistema reiniciado. Nueva temperatura: ${temperaturaObjetivo}`);
  return res.status(200).json({ mensaje: 'Sistema reiniciado correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
