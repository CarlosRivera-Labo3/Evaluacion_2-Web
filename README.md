# Estabiliza el Reactor

Evaluación II de Programación Web (UCA, ciclo 02 2026).

Programa de estabilizacion de reactor de tipo cliente-servidor. El servidor genera al iniciar una temperatura de estabilización aleatoria entre 1 y 100. El usuario ingresa temperaturas y el servidor le indica si la ideal es **más alta**, **más baja** o si el reactor quedó **estabilizado**.

## Tecnologías

- **Backend:** Node.js, Express 5, CORS
- **Frontend:** React 19, Vite, Tailwind CSS

## Estructura

```
Evaluacion_2-Web/
├── backend/
│   ├── server.js          # API con Express
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Estado principal y llamadas a la API
│   │   └── components/
│   │       ├── FormularioAjuste.jsx   # Input numérico y botón
│   │       ├── MensajeEstado.jsx      # Mensaje del servidor y botón de reinicio
│   │       └── HistorialLista.jsx     # Lista de intentos de la sesión
│   ├── .env.example
│   └── package.json
└── README.md
```

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- npm

## Instalación y ejecución

Hay que levantar el backend y el frontend en dos terminales distintas.

### 1. Backend

```bash
cd backend
npm install
npm start
```

El servidor queda en `http://localhost:3000`. Al iniciar imprime en la terminal la temperatura de estabilización, lo que sirve para probar el juego.

Variables de entorno opcionales:

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `FRONTEND_URL` | Origen permitido por CORS | `http://localhost:5173` |

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`.

Variable de entorno:

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base del backend | `http://localhost:3000` |

### Otros comandos del frontend

```bash
npm run build     # genera la versión de producción
npm run lint      # revisa el código con ESLint
npm run preview   # sirve la versión compilada
```

## API

### `POST /adjust`

Envía un intento de temperatura.

**Body (JSON):**

```json
{ "temperatura": 50 }
```

La temperatura debe ser un número entero entre 1 y 100.

**Respuestas:**

| Código | Cuándo | Cuerpo |
|---|---|---|
| `200` | La temperatura es menor que la ideal | `{ "mensaje": "más alta", "exito": false }` |
| `200` | La temperatura es mayor que la ideal | `{ "mensaje": "más baja", "exito": false }` |
| `200` | Acertó | `{ "mensaje": "estabilizado", "exito": true }` |
| `400` | Valor ausente, no entero o fuera de 1-100 | `{ "mensaje": "La temperatura debe ser un entero entre 1 y 100.", "exito": false }` |

**Ejemplo:**

```bash
curl -X POST http://localhost:3000/adjust \
  -H "Content-Type: application/json" \
  -d '{"temperatura": 50}'
```

### `POST /reboot`

Reinicia el sistema y genera una nueva temperatura de estabilización. No recibe body.

**Respuesta `200`:**

```json
{ "mensaje": "Sistema reiniciado correctamente", "estado": "Reiniciado" }
```

La respuesta no incluye la nueva temperatura, para que el jugador no pueda verla en el navegador.

**Ejemplo:**

```bash
curl -X POST http://localhost:3000/reboot
```

## Cómo funciona el frontend

El estado se maneja con `useState` en `App.jsx`:

| Estado | Uso |
|---|---|
| `temperatura` | Valor actual del input |
| `historial` | Lista de temperaturas ingresadas en la sesión |
| `mensaje` | Última respuesta del servidor |
| `estabilizado` | `true` cuando el usuario acertó; bloquea el formulario |
| `cargando` | `true` mientras hay una petición en curso; evita envíos dobles |

Al pulsar **Reiniciar reactor** se llama a `/reboot`, se limpia el historial y se puede volver a jugar.

## Notas

- El estado del reactor vive en memoria del servidor y es compartido: la temperatura objetivo es la misma para todos los clientes conectados y se pierde al apagar el servidor.
- La validación del rango se hace en el frontend (para dar respuesta inmediata) y también en el backend (que es la que cuenta).

## Equipo
Carlos Rigoberto Rivera García 00165524
Orlando Emmanuel Herrera Estrada 00084420
Gabriel André Guerrero Rivas 00112824 
Javier Omar Ramírez Villanueva 00016824