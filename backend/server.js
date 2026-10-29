const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

const generarTemperatura = () => Math.floor(Math.random() * 100) + 1;

let temperaturaObjetivo = generarTemperatura();
let contadorReinicios = 0;

console.log(`Servidor iniciado. Temperatura de estabilización: ${temperaturaObjetivo}`);


app.post('/adjust', (req, res) => {
  const { temperatura } = req.body;

  if (!Number.isInteger(temperatura) || temperatura < 1 || temperatura > 100) {
    return res.status(400).json({
      exito: false,
      mensaje: 'La temperatura debe ser un entero entre 1 y 100.',
    });
  }

  if (temperatura === temperaturaObjetivo) {
    return res.status(200).json({ mensaje: 'estabilizado', exito: true });
  }

  return res.status(200).json({
    mensaje: temperatura < temperaturaObjetivo ? 'más alta' : 'más baja',
    exito: false,
  });
});

app.post('/reboot', (req, res) => {
 temperaturaObjetivo = generarTemperatura();
  contadorReinicios++;

  console.log(`Sistema reiniciado. Nueva temperatura: ${temperaturaObjetivo}`);
  console.log(`Contador de reinicios del reactor: ${contadorReinicios}`);

  return res.status(200).json({
    mensaje: 'Sistema reiniciado correctamente',
    estado: 'Reiniciado',
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
