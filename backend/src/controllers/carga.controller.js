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

// Middleware: bloquea cambios si la ventana de lanzamiento ya terminó
export const verificarSesion = (req, res, next) => {
  if (Date.now() > estado.expiraEn) {
    return res
      .status(410)
      .json({ mensaje: "La ventana de lanzamiento terminó. Inicia la sesión de nuevo." });
  }
  next();
};

// GET /api/inventario
export const getInventario = (req, res) => {
  res.json(estado.inventario);
};

// GET /api/carga
export const getCarga = (req, res) => {
  res.json(resumenCarga());
};      

// NOTA: aqui el que haga lo demas del backend, solo tiene que agregar la logica, 
// esto lo hice asi para que no hubiera problemas con las rutas en AstroL.routes

// POST /api/carga/agregar  { equipoId, cantidad }
export const agregarCarga = (req, res) => {};

// PUT /api/carga/actualizar-unidades/:id 
export const actualizarUnidades = (req, res) => {};

// DELETE /api/carga/eliminar/:id
export const eliminarCarga = (req, res) => {}

// POST /api/sesion/reiniciar
export const reiniciarSesion = (req, res) => {
  reiniciarEstado();
  res.json(resumenCarga());
};