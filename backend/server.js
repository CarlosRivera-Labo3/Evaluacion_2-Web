const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


let temperaturaObjetivo = Math.floor(Math.random() * 100) + 1;

console.log(`Servidor iniciado. Temperatura de estabilización: ${temperaturaObjetivo}`);


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


let contadorReinicios = 0;
app.post('/reboot', (req, res) => {
    temperaturaObjetivo = Math.floor(Math.random() * 100) + 1;
    contadorReinicios++;

    console.log(`Sistema reiniciado. Nueva temperatura: ${temperaturaObjetivo}`);
    console.log(`Contador de reinicios del reactor: ${contadorReinicios}`);

    return res.status(200).json({
        mensaje: 'Sistema reiniciado correctamente',
        nuevaTemperatura: temperaturaObjetivo,
        reinicios: contadorReinicios,
        estado: 'Reiniciado'
    });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
