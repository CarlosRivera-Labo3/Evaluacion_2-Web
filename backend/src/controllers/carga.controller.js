import { estado, Presupuesto, reiniciarEstado } from "../data/estado.js";

const redondear = (n) => Number(n.toFixed(2));
const buscarEquipo = (id) => estado.inventario.find((e) => e.id === id);

const calcularTotal = () =>
  redondear(
    estado.itemsCargados.reduce((acc, item) => {
      const equipo = buscarEquipo(item.id);
      return acc + equipo.precio * item.cantidad;
    }, 0)
  );

const creditosDisponibles = () => redondear(Presupuesto - calcularTotal());

const resumenCarga = () => ({
  creditos: creditosDisponibles(),
  itemsCargados: estado.itemsCargados,
  total: calcularTotal(),
  segundosRestantes: Math.max(0, Math.round((estado.expiraEn - Date.now()) / 1000)),
});

export const verificarSesion = (req, res, next) => {
  if (Date.now() > estado.expiraEn) {
    return res
      .status(410)
      .json({ mensaje: "La ventana de lanzamiento terminó. Inicia la sesión de nuevo." });
  }
  next();
};

export const getInventario = (req, res) => {
  res.json(estado.inventario);
};

export const getCarga = (req, res) => {
  res.json(resumenCarga());
};

export const agregarCarga = (req, res) => {
  const { equipoId, cantidad } = req.body;

  const equipo = buscarEquipo(equipoId);
  if (!equipo) return res.status(404).json({ mensaje: "Suministro no encontrado." });
  if (equipo.stock < cantidad) return res.status(400).json({ mensaje: "Stock en base insuficiente" });

  const costoAgregar = equipo.precio * cantidad;
  if (calcularTotal() + costoAgregar > Presupuesto) {
    return res.status(400).json({ mensaje: "Créditos insuficientes para esta cantidad" });
  }

  equipo.stock -= cantidad;

  const existente = estado.itemsCargados.find((i) => i.id === equipoId);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    estado.itemsCargados.push({ id: equipoId, cantidad });
  }

  res.status(200).json({ mensaje: "Suministro añadido a la carga.", ...resumenCarga() });
};

export const actualizarUnidades = (req, res) => {
  const id = parseInt(req.params.id);
  const { cantidad } = req.body;

  const item = estado.itemsCargados.find((i) => i.id === id);
  const equipo = buscarEquipo(id);

  if (!item || !equipo) return res.status(404).json({ mensaje: "Suministro no encontrado en la carga." });
  if (cantidad < 1) return res.status(400).json({ mensaje: "La cantidad mínima es 1." });

  const diferencia = cantidad - item.cantidad;

  if (diferencia > 0) {
    if (equipo.stock < diferencia) return res.status(400).json({ mensaje: "Stock en base insuficiente" });
    const nuevoTotal = calcularTotal() + equipo.precio * diferencia;
    if (nuevoTotal > Presupuesto) return res.status(400).json({ mensaje: "Créditos insuficientes para esta cantidad" });
    equipo.stock -= diferencia;
  } else {
    equipo.stock += Math.abs(diferencia);
  }

  item.cantidad = cantidad;
  res.status(200).json({ mensaje: "Cantidad actualizada.", ...resumenCarga() });
};

export const eliminarCarga = (req, res) => {
  const id = parseInt(req.params.id);
  const idx = estado.itemsCargados.findIndex((i) => i.id === id);

  if (idx === -1) return res.status(404).json({ mensaje: "Suministro no encontrado en la carga." });

  const item = estado.itemsCargados[idx];
  const equipo = buscarEquipo(id);
  if (equipo) equipo.stock += item.cantidad;

  estado.itemsCargados.splice(idx, 1);
  res.status(200).json({ mensaje: "Suministro desembarcado.", ...resumenCarga() });
};

export const reiniciarSesion = (req, res) => {
  reiniciarEstado();
  res.json(resumenCarga());
};
