import { Router } from "express";
import {
    getInventario,
    getCarga,
    agregarCarga,
    actualizarUnidades,
    eliminarCarga,
    reiniciarSesion,
    verificarSesion,   
} from "../controllers/carga.controller.js";

const router = Router();

router.get("/inventario", getInventario)
router.get("/carga",getCarga)

// Las operaciones que modifican la carga solo funcionan con la sesión activa
router.post("/carga/agregar", verificarSesion, agregarCarga);
router.put("/carga/actualizar-unidades/:id", verificarSesion, actualizarUnidades);
router.delete("/carga/eliminar/:id", verificarSesion, eliminarCarga);

// Extra: iniciar de nuevo cuando se acaba el tiempo
router.post("/sesion/reiniciar", reiniciarSesion);

export default router;