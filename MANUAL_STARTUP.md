# TiKetSafe: inicio manual

Guia para iniciar TiKetSafe sin asistencia adicional en Windows PowerShell.

## Requisitos

- Node.js 20 LTS o superior.
- npm 10 o superior.
- Docker Desktop iniciado con el motor Linux activo.
- Un navegador para Expo Web.

## Primera instalacion

Abre PowerShell en la carpeta raiz del proyecto:

```powershell
cd "C:\Users\angel\OneDrive\Desktop\Tikets_003.1"
npm ci --workspaces
```

Si no existe `backend/.env`, copia la plantilla:

```powershell
Copy-Item backend\.env.example backend\.env
```

Comprueba que `backend/.env` tenga como minimo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tiKets?schema=public"
PORT=4000
NODE_ENV="development"
JWT_SECRET="tiKets-dev-secret"
CORS_ORIGINS="http://localhost:8081"
```

Genera Prisma y aplica las migraciones:

```powershell
npm --workspace backend run prisma:generate
npm --workspace backend exec prisma migrate deploy -- --schema=prisma/schema.prisma
```

Carga los datos demo, incluidos eventos y partidos:

```powershell
npm --workspace backend run prisma:seed
```

## Inicio normal

### 1. Iniciar Docker y PostgreSQL

Asegurate de que Docker Desktop este abierto y ejecuta:

```powershell
Push-Location backend
docker compose up -d postgres
Pop-Location
docker ps --filter "name=tiKets-postgres"
```

El contenedor debe aparecer como `Up`. PostgreSQL escucha en `localhost:5432`.

### 2. Iniciar la API

Abre una segunda terminal PowerShell en la raiz:

```powershell
cd "C:\Users\angel\OneDrive\Desktop\Tikets_003.1"
npm run dev:backend
```

La API queda en `http://localhost:4000`.

Comprueba su salud desde otra terminal:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:4000/api/health
```

La respuesta esperada tiene `StatusCode 200` y `database: connected`.

### 3. Iniciar Expo Web

Abre una tercera terminal PowerShell:

```powershell
cd "C:\Users\angel\OneDrive\Desktop\Tikets_003.1"
Push-Location frontend
npx expo start --web --localhost --port 8081
Pop-Location
```

Abre `http://localhost:8081` en el navegador. Si Expo elige otro puerto, usa la URL que muestre la terminal.

Para móvil en la misma red Wi-Fi, usa:

```powershell
npm run dev:frontend
```

La variable `EXPO_PUBLIC_API_URL` debe apuntar a `http://<IP-DE-TU-PC>:4000` cuando se pruebe desde un teléfono.

## Credenciales demo

- Correo: `admin@tikets.com`
- Contraseña: `demo1234`
- Rol: administrador

No uses estas credenciales en producción.

## Comprobación completa

```powershell
npm run ops:check
```

Puertos esperados:

- `5432`: PostgreSQL.
- `4000`: API TiKetSafe.
- `8081`: Expo Web.

## Detener servicios

En las terminales de API y Expo presiona `Ctrl+C`. Para detener PostgreSQL:

```powershell
Push-Location backend
docker compose down
Pop-Location
```

## Problemas frecuentes

### Docker no responde

Abre Docker Desktop, espera a que el motor Linux esté listo y repite `docker compose up -d postgres`.

### `Failed to fetch`

Comprueba que la API este en `4000`. En Expo Web el cliente usa `http://localhost:4000`; en un teléfono debe usar la IP LAN del PC.

### Prisma no se inicializa

Detén la API, ejecuta `npm --workspace backend run prisma:generate` y vuelve a iniciar `npm run dev:backend`.

### Dependencias incompletas

Detén los procesos Node y ejecuta:

```powershell
Remove-Item node_modules -Recurse -Force
npm ci --workspaces
npm --workspace backend run prisma:generate
```
