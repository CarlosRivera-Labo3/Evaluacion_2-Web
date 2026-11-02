import { inventarioNave } from "./inventario.js";

export const Presupuesto = 500; 
export const Duracion_sesion = 5*60*1000;

export const estado = {
    inventario: [],
    itemsCargados: [],
    expiraEn: 0,
};

export const reiniciarEstado = () => {
    estado.inventario = inventarioNave();
    estado.itemsCargados = [];
    estado.expiraEn = Date.now() + Duracion_sesion;
};

reiniciarEstado();