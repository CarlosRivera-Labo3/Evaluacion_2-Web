import  { Router }  from "express";
import {ajustar, reiniciar} from "../controllers/reactor.controller.js";

const router = Router();

router.post("/adjust", ajustar);
router.post("/reboot", reiniciar);

export default router;