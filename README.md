# Evaluación II — Programación Web

Evaluación II de Programación Web (UCA, ciclo 02 2026).

Aplicación cliente-servidor con dos ejercicios, accesibles desde pestañas en la misma página:

1. **Estabiliza el Reactor:** el servidor guarda una temperatura secreta (1-100) y el usuario intenta adivinarla. En cada intento el servidor responde si la temperatura ideal es **más alta**, **más baja** o si el reactor quedó **estabilizado**.
2. **AstroLogistics:** tienda de suministros para una nave espacial. El usuario arma una carga con un presupuesto de **500 créditos**, sujeta al stock de la base y a una ventana de tiempo limitada.

## Tecnologías

| Parte | Herramientas |
|---|---|
| Backend | Node.js, Express 5, CORS, módulos ES (`import` / `export`) |
| Frontend | React 19, Vite 8, Tailwind CSS 4 (plugin `@tailwindcss/vite`) |
| Calidad | ESLint (con `eslint-plugin-react-hooks` y `eslint-plugin-react-refresh`) |
| Pruebas manuales | Postman |

## Estructura

```
Evaluacion_2-Web/
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js                    
│       ├── routes/
│       │   ├── reactor.routes.js        
│       │   └── carga.routes.js          
│       ├── controllers/
│       │   ├── reactor.controller.js    
│       │   └── carga.controller.js      
│       └── data/
│           ├── estado.js                
│           └── inventario.js            
├── frontend/
│   ├── public/Reactor.jpeg              
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx                     
│       ├── App.jsx                      
│       ├── Reactor.jsx                  
│       ├── Astro.jsx                    
│       ├── BodegaPanel.jsx              
│       ├── api.js                      
│       └── index.css                    
└── README.md
```

El backend sigue el patrón **ruta → controlador → datos**: la ruta asocia una URL con una función, el controlador contiene la lógica y `data/` guarda el estado en memoria.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- npm

## Instalación y ejecución

Hay que levantar el backend y el frontend en **dos terminales distintas**.

### 1. Backend

```bash
cd backend
npm install
npm start
```

El servidor queda en `http://localhost:3000`. Al iniciar imprime en la terminal la temperatura de estabilización del Reactor, útil para probar el juego.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`.

### Variables de entorno (opcionales)

No es necesario crear ningún archivo `.env`; todas tienen un valor por defecto.

| Variable | Dónde | Descripción | Valor por defecto |
|---|---|---|---|
| `PORT` | Backend | Puerto del servidor | `3000` |
| `FRONTEND_URL` | Backend | Origen permitido por CORS | `http://localhost:5173` |
| `VITE_API_URL` | Frontend (`frontend/.env`) | URL base del backend | `http://localhost:3000` |

Si Vite arranca en un puerto distinto de 5173, hay que iniciar el backend con `FRONTEND_URL` apuntando a ese puerto; de lo contrario CORS bloqueará las peticiones.

### Otros comandos del frontend

```bash
npm run build     
npm run lint      
npm run preview   
```

## API

El cuerpo de las peticiones y respuestas es JSON (`Content-Type: application/json`).

### Ejercicio 1: Reactor

#### `POST /adjust`

Envía un intento de temperatura.

```json
{ "temperatura": 50 }
```

La temperatura debe ser un entero entre 1 y 100.

| Código | Cuándo | Cuerpo |
|---|---|---|
| `200` | La temperatura es menor que la ideal | `{ "mensaje": "más alta", "exito": false }` |
| `200` | La temperatura es mayor que la ideal | `{ "mensaje": "más baja", "exito": false }` |
| `200` | Acertó | `{ "mensaje": "estabilizado", "exito": true }` |
| `400` | Valor ausente, no entero o fuera de 1-100 | `{ "mensaje": "La temperatura debe ser un entero entre 1 y 100.", "exito": false }` |

#### `POST /reboot`

Reinicia el sistema y genera una nueva temperatura de estabilización. No recibe body.

```json
{ "mensaje": "Sistema reiniciado correctamente", "estado": "Reiniciado" }
```

La respuesta no incluye la nueva temperatura, para que el jugador no pueda verla en el navegador.

### Ejercicio 2: AstroLogistics

Todas las rutas cuelgan de `/api`.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/inventario` | Lista los suministros con precio y stock actual |
| `GET` | `/api/carga` | Resumen de la carga: créditos, total, ítems y segundos restantes |
| `POST` | `/api/carga/agregar` | Agrega un suministro a la carga |
| `PUT` | `/api/carga/actualizar-unidades/:id` | Cambia la cantidad de un suministro ya cargado |
| `DELETE` | `/api/carga/eliminar/:id` | Quita un suministro de la carga y devuelve su stock |
| `POST` | `/api/sesion/reiniciar` | Reinicia inventario, carga y reloj de la sesión |

#### Resumen de carga

Las rutas de carga devuelven (junto con un `mensaje`, cuando aplica) este objeto:

```json
{
  "creditos": 350,
  "itemsCargados": [{ "id": 201, "cantidad": 3 }],
  "total": 150,
  "segundosRestantes": 298
}
```

- `creditos`: presupuesto disponible (500 menos el total).
- `total`: costo acumulado de la carga.
- `segundosRestantes`: tiempo que queda de la sesión.

#### `POST /api/carga/agregar`

```json
{ "equipoId": 201, "cantidad": 3 }
```

#### `PUT /api/carga/actualizar-unidades/:id`

```json
{ "cantidad": 4 }
```

`cantidad` es la **nueva cantidad total** del suministro, no un incremento. Si es mayor que la actual se descuenta stock y créditos; si es menor se devuelven.

#### Códigos de respuesta

| Código | Significado |
|---|---|
| `200` | Operación realizada; devuelve el resumen de carga |
| `400` | Stock en base insuficiente, créditos insuficientes o cantidad mínima no respetada |
| `404` | Suministro no encontrado (en el catálogo o en la carga) |
| `410` | La ventana de lanzamiento terminó (solo en `agregar`, `actualizar-unidades` y `eliminar`) |

#### Reglas del servidor

- **Presupuesto:** 500 créditos.
- **Sesión:** 5 minutos desde que arranca el servidor o se llama a `/api/sesion/reiniciar`. Pasado ese tiempo, las rutas que modifican la carga responden `410`.
- **Stock:** al agregar o aumentar unidades se descuenta del inventario; al reducir o eliminar, se devuelve.

#### Catálogo inicial

| ID | Suministro | Categoría | Precio (Cr) | Stock |
|---|---|---|---|---|
| 201 | Tanque de Oxígeno XL | Soporte Vital | 50 | 5 |
| 202 | Filtro de CO2 | Soporte Vital | 15 | 10 |
| 203 | Pack de Raciones Liofilizadas | Alimentos | 8 | 20 |
| 204 | Panel Solar Plegable | Energía | 120 | 3 |
| 205 | Kit Médico de Emergencia | Medicina | 35 | 6 |
| 206 | Traje EVA | Equipo | 200 | 1 |

## Cómo funciona el frontend

`App.jsx` muestra dos pestañas (Reactor y AstroLogistics). Ambos ejercicios permanecen montados y se alterna su visibilidad con el atributo `hidden`.

### Reactor (`Reactor.jsx`)

Usa `useState` para guardar:

| Estado | Uso |
|---|---|
| `mensaje` | Última respuesta del servidor |
| `estabilizado` | Indica si el usuario ganó (cambia los colores y bloquea el formulario) |
| `historial` | Lista de intentos de la sesión, el más reciente primero |
| `cargando` | `true` mientras hay una petición en curso; evita envíos dobles |

El input solo admite dígitos y se valida el rango de 1 a 100 antes de enviar. El botón **Reiniciar Reactor** llama a `/reboot` y limpia el historial.

### AstroLogistics (`Astro.jsx` y `BodegaPanel.jsx`)

- **`Astro.jsx`** carga el inventario y la carga con `useEffect` y `Promise.all` (dos peticiones en paralelo), muestra los créditos y el costo total en el encabezado y dibuja el catálogo. El botón **Añadir a la Nave** agrega un suministro y vuelve a consultar los datos. Se deshabilita si el stock es 0.
- **`BodegaPanel.jsx`** muestra la carga de la nave: lista de suministros con botones `+` / `−` para cambiar la cantidad y **Desembarcar** para quitarlos, el total de unidades, el costo y una estimación del peso. Incluye una cuenta regresiva de 60 segundos; al terminar muestra "Sesión cerrada".
- **`api.js`** concentra los `fetch` hacia `/api`. La función `solicitar` convierte cualquier respuesta no exitosa en un `Error` con el mensaje del servidor, que la interfaz muestra en un aviso.

## Notas

- El estado vive **en memoria del servidor** y es compartido por todos los clientes conectados; se pierde al apagar el servidor.
- La validación del Reactor se hace en el frontend (respuesta inmediata) y también en el backend (la que cuenta).
- El peso total del panel de carga se estima en el cliente según la categoría del suministro; el backend no lo almacena.

## Equipo

- Carlos Rigoberto Rivera García — 00165524
- Orlando Emmanuel Herrera Estrada — 00084420
- Gabriel André Guerrero Rivas — 00112824
- Javier Omar Ramírez Villanueva — 00016824
