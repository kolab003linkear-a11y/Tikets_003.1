# TiKetSafe: prompts y soluciones

Registro resumido de los pedidos usados durante la construccion y de los problemas que resolvieron.

## 1. Arranque del entorno

**Prompt:**

> Levanta todos los servicios para probar como se ve al momento.

**Problemas encontrados:**

- Docker Desktop no estaba disponible al inicio.
- Faltaban o estaban incompletas dependencias de `ts-node` y Expo.
- Prisma no tenia generado el cliente.

**Solucion aplicada:**

1. Se comprobo la configuracion de root, backend, frontend y puertos.
2. Se inicio PostgreSQL con Docker Compose.
3. Se limpio `node_modules` y la cache de npm.
4. Se ejecuto `npm ci --workspaces`.
5. Se ejecuto `npm --workspace backend run prisma:generate`.
6. Se levantaron API y Expo Web en terminales persistentes.
7. Se verificaron los puertos `5432`, `4000` y `8081` y `/api/health`.

## 2. Seguridad del registro

**Prompt:**

> Iniciemos con la fase 10.

**Problema:**

El registro publico aceptaba `role: ADMIN` o `role: SCANNER` enviado desde el cliente.

**Solucion aplicada:**

- Se elimino `role` del esquema publico de registro.
- El backend asigna siempre `UserRole.CLIENT`.
- Se agrego una prueba que intenta registrar un usuario como `ADMIN` y espera `CLIENT`.
- En produccion `JWT_SECRET` es obligatorio.
- CORS se puede configurar con `CORS_ORIGINS`.
- Se creo `backend/.env.example`.

## 3. Mejoras visuales

**Prompts principales:**

> Mejora la interfaz de estadios ya que esta muy simple en comparacion de cartelera.

> Mejora la interfaz de mis tickets.

> Mejora la parte de perfil.

> Mejora la parte de admin scanner.

> Mejora eventos.

> Mejora salas.

**Soluciones aplicadas:**

- Se crearon cabeceras con jerarquia visual, metricas, estados e iconos.
- Estadios incorporo imagen de sede, filtros por estado, ciudad y equipo, escudos, mapa de localidades y disponibilidad real.
- Mis Tickets incorporo filtros, contadores, distincion entre evento y estadio y acceso QR destacado.
- Perfil incorporo avatar, datos de cuenta, rol, estado de sesion y accesos rapidos.
- Admin Scanner incorporo guia de camara, resultados estructurados, metricas y boton para escanear siguiente.
- Eventos incorporo posters, estados, filtros y resumen de cartelera.
- Salas incorporo aforo, metricas, tarjetas de salas y agenda visual de funciones.

## 4. Tickets de estadios no visibles

**Prompt:**

> No se guardan los tickets que se generaron.

**Problema:**

El backend guardaba los tickets de estadio, pero `/api/tickets` solo consultaba tickets de cine.

**Solucion aplicada:**

- `/api/tickets` ahora consulta ambas tablas.
- Los tickets de estadio se transforman al mismo contrato que consume Mis Tickets.
- Se conserva el QR `stadiumsafe:v1`.
- Mis Tickets se recarga al recuperar el foco.
- Se agrego una prueba de persistencia y recuperacion del ticket de estadio.

## 5. Localidades y disponibilidad

**Prompt:**

> El flujo de estadios llega hasta localidades y no genera el ticket QR.

**Problema:**

El frontend esperaba `row.seats`, pero el backend enviaba filas como strings y columnas numericas.

**Solucion aplicada:**

- Se generan localidades como `A1`, `A2`, `B1`, etc.
- Se muestran por filas en un mapa compacto.
- Se agrego scroll horizontal para sectores grandes.
- La API devuelve localidades ocupadas por sector.
- El frontend bloquea localidades vendidas.

## 6. Perfil y navegación

**Prompts:**

> Quiero que a perfil se acceda mediante el avatar.

> El icono del avatar debe estar en todas las pantallas.

> El boton de cerrar sesion no funciona.

**Soluciones aplicadas:**

- Se saco Perfil de la barra inferior y se agrego al stack.
- Se creo `ProfileAvatar` reutilizable.
- El avatar abre Perfil desde las pantallas principales.
- En web el cierre de sesion se ejecuta directamente, porque `Alert` no ofrece botones fiables en ese entorno.
- En movil se conserva la confirmacion nativa.

## 7. Datos del perfil

**Prompt:**

> En datos personales faltan campos y datos.

**Solucion aplicada:**

- Se agregaron `fullName` y `phone` al modelo `User`.
- Se creo una migracion de PostgreSQL.
- Se actualizaron `/api/me`, login, contexto de autenticacion y formulario de Perfil.
- Se agregaron validaciones de nombre, telefono y correo.

## 8. Cambio de marca y moneda

**Prompts:**

> Cambiemos el nombre de tiKets a TiKetSafe.

> En Ecuador usamos dolares, no euros.

**Soluciones aplicadas:**

- Se cambio la marca visible a `TiKetSafe` en la app, Expo y documentacion.
- Se conservaron identificadores tecnicos para no romper sesiones ni paquetes.
- Se cambiaron precios visibles de euros a dolares en cartelera, reservas, checkout, estadios y administracion.

## 9. Datos externos de programación

**Prompt:**

> Revisa la pagina de Ochoymedio y actualiza la informacion con lo que estan presentando.

**Fuente consultada:**

- Pagina oficial: `https://www.ochoymedio.net/`
- API publica de WordPress de Ochoymedio.
- Programacion de LigaPro consultada separadamente para el modulo de estadios.

**Solucion aplicada:**

Se actualizo el seed con:

- The Odyssey en 35mm.
- El niño probeta.
- Coyote vs Acme.
- Sinopsis, duracion, posters, trailers, horarios y precios publicados.

No se agregaron obras de teatro o conciertos sin fecha vigente confirmada.

## 10. Administracion de estadios

**Prompt:**

> Agrega el apartado de admin para estadios.

**Solucion aplicada:**

- Se creo `AdminStadiumsScreen`.
- El Centro Admin ahora incluye Estadios.
- Se pueden listar sedes y crear estadios.
- Se configuran imagen, capacidad, filas, columnas y sectores.
- Se agrego el contrato API para listar y crear estadios.

## Validacion recurrente

Despues de cambios backend:

```powershell
npm --workspace backend test
```

Despues de cambios frontend:

```powershell
npx tsc --noEmit -p frontend/tsconfig.json
```

Resultado alcanzado durante esta sesion: backend con 4 pruebas aprobadas y frontend sin errores de TypeScript.
