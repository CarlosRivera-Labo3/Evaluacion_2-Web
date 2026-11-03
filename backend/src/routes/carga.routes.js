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

router.get("/inventario", getInventario);
router.get("/carga", getCarga);

router.post("/carga/agregar", verificarSesion, agregarCarga);
router.put("/carga/actualizar-unidades/:id", verificarSesion, actualizarUnidades);
router.delete("/carga/eliminar/:id", verificarSesion, eliminarCarga);

router.post("/sesion/reiniciar", reiniciarSesion);

export default router;
