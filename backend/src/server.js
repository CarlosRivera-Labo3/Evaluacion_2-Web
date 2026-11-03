import express from "express";
import cors from "cors";
import reactorRoutes from "./routes/reactor.routes.js"
import cargaRoutes from "./routes/carga.routes.js"



const app = express();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

app.use("/", reactorRoutes);
app.use("/api",cargaRoutes);


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
