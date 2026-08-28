# TiKetSafe: documento de tareas

Este documento organiza la evolución de la aplicación por fases. Cada fase debe validarse antes de comenzar la siguiente.

## Estado

- [x] Fase 1: Base funcional
- [x] Fase 2: Autenticación
- [ ] Fase 3: Reservas reales
- [ ] Fase 4: Pagos
- [ ] Fase 5: Tickets y QR
- [ ] Fase 6: Mis Tickets y Perfil
- [ ] Fase 7: Panel administrativo
- [x] Fase 8: Diseño y experiencia móvil
- [ ] Fase 9: Calidad y despliegue

---

## Fase 1: Base funcional

### Objetivo
Conectar la aplicación móvil con el catálogo real del backend.

### Tareas

- [x] Crear un cliente HTTP reutilizable para el frontend.
- [x] Configurar la URL del API para desarrollo LAN.
- [x] Conectar la cartelera con `GET /api/catalog`.
- [x] Mostrar eventos, funciones, horarios, precios e imágenes reales.
- [x] Añadir estado de carga.
- [x] Añadir estado de error y botón para reintentar.
- [x] Añadir estado de catálogo vacío.
- [ ] Mantener un fallback demo solo mientras sea necesario.

### Criterio de terminado
La cartelera se carga desde PostgreSQL a través del backend y funciona desde Expo Go en el teléfono.

---

## Fase 2: Autenticación

### Objetivo
Permitir que cada usuario tenga una sesión segura.

### Tareas

- [x] Crear pantallas de registro e inicio de sesión.
- [x] Conectar registro con `POST /api/auth/register`.
- [x] Conectar login con `POST /api/auth/login`.
- [x] Guardar el token de sesión de forma persistente.
- [x] Restaurar la sesión al abrir la aplicación.
- [x] Proteger las acciones que requieren usuario autenticado.
- [x] Añadir cierre de sesión.
- [x] Validar formularios y mostrar errores claros.

### Criterio de terminado
Un usuario puede registrarse, cerrar y volver a abrir la app, conservar su sesión y cerrar sesión correctamente.

---

## Fase 3: Reservas reales

### Objetivo
Convertir la selección visual de butacas en una reserva controlada por el backend.

### Tareas

- [x] Cargar la distribución de sala desde el catálogo.
- [x] Consultar la disponibilidad actual de cada función.
- [x] Diferenciar butacas libres, ocupadas y seleccionadas.
- [x] Crear reservas con `POST /api/reservations/create`.
- [x] Enviar el usuario autenticado y las butacas seleccionadas.
- [x] Controlar el vencimiento de cinco minutos.
- [x] Mostrar conflictos cuando otra reserva ocupó una butaca.
- [x] Permitir cancelar o abandonar una selección pendiente.

### Criterio de terminado
Dos dispositivos no pueden confirmar la misma butaca y el estado mostrado coincide con la base de datos.

---

## Fase 4: Pagos

### Objetivo
Reemplazar el pago simulado por un flujo real y seguro.

### Estado actual

El checkout ya confirma pagos mediante un adaptador demo autenticado y restringido a desarrollo. Falta configurar un proveedor real, sus credenciales y el webhook firmado antes de usarlo en producción.

### Tareas

- [ ] Definir el proveedor de pago: Stripe o PayPhone.
- [ ] Configurar las variables de entorno del proveedor.
- [x] Conectar el checkout con el endpoint del backend.
- [x] Eliminar el `setTimeout` de pago simulado.
- [x] Mostrar estados de procesamiento, aprobación y rechazo.
- [x] Evitar envíos duplicados.
- [ ] Procesar y verificar el webhook de pago.
- [ ] Actualizar la reserva solo después de confirmar el pago.

### Criterio de terminado
Una reserva solo pasa a pagada mediante una confirmación verificable del proveedor.

---

## Fase 5: Tickets y QR

### Objetivo
Generar una entrada digital verificable después del pago.

### Tareas

- [x] Obtener los tickets reales de la reserva pagada.
- [x] Generar un QR con la información necesaria para validación.
- [x] Mostrar evento, horario, sala y butacas.
- [x] Mostrar identificador y estado del ticket.
- [x] Evitar mostrar firmas o secretos innecesarios al usuario.
- [ ] Preparar el ticket para uso sin conexión cuando sea posible.

### Criterio de terminado
El usuario recibe un ticket real y el QR contiene información que el backend puede validar.

---

## Fase 6: Mis Tickets y Perfil

### Objetivo
Completar el área personal del usuario.

### Tareas

- [x] Crear el endpoint para listar tickets del usuario si todavía no existe.
- [x] Mostrar tickets activos, usados y expirados.
- [x] Abrir el detalle de cada ticket.
- [x] Mostrar historial de reservas.
- [x] Completar los datos del perfil.
- [ ] Añadir preferencias básicas del usuario.
- [x] Añadir cierre de sesión desde Perfil.

### Criterio de terminado
El usuario puede consultar sus compras anteriores y administrar su sesión desde la aplicación.

---

## Fase 7: Panel administrativo

### Objetivo
Permitir la operación de eventos y validación de entradas.

### Tareas

- [x] Restringir las funciones administrativas por rol.
- [x] Implementar lectura de códigos QR.
- [x] Validar el ticket contra el backend.
- [x] Marcar entradas como usadas.
- [x] Mostrar resultado de validación: válido, usado o inválido.
- [x] Crear gestión de eventos.
- [x] Crear gestión de salas y distribución de butacas.
- [x] Crear gestión de funciones, precios y disponibilidad.

### Criterio de terminado
Un usuario con rol autorizado puede validar entradas y administrar la cartelera sin acceso indebido a funciones de cliente.

---

## Fase 8: Diseño y experiencia móvil

### Objetivo
Mejorar la claridad, accesibilidad y calidad visual de la app.

### Tareas

- [x] Crear componentes reutilizables para botones, tarjetas, inputs y estados.
- [x] Unificar colores, tipografías, espaciados y tamaños táctiles.
- [x] Mejorar la navegación entre pantallas.
- [x] Optimizar imágenes y listas largas.
- [x] Añadir estados de carga visuales en los flujos de autenticación, reserva y pago.
- [x] Mejorar contraste y legibilidad.
- [x] Revisar compatibilidad con pantallas pequeñas y grandes.
- [x] Añadir animaciones breves y útiles.
- [x] Revisar accesibilidad de controles y etiquetas en autenticación, reserva y pago.

### Criterio de terminado
Los flujos principales se entienden y se pueden completar cómodamente en un teléfono real.

---

## Fase 9: Calidad y despliegue

### Objetivo
Preparar la aplicación para uso estable y publicación.

### Tareas

- [ ] Añadir pruebas unitarias para reglas de negocio.
- [x] Añadir pruebas de endpoints del backend.
- [x] Probar el flujo completo de compra con pago demo, ticket y QR.
- [ ] Probar conflictos de butacas y expiración de reservas.
- [ ] Revisar autenticación, autorización y secretos.
- [ ] Revisar variables de entorno de producción.
- [x] Actualizar la documentación técnica.
- [x] Ejecutar compilación limpia del frontend y backend.
- [x] Revisar logs y manejo de errores.
- [ ] Publicar una versión etiquetada en Git.
- [ ] Preparar despliegue de API, PostgreSQL y aplicación móvil.

### Criterio de terminado
El flujo completo está probado, documentado y listo para desplegarse en un entorno controlado.

---

## Orden recomendado

1. Completar las fases 1 a 3 para tener catálogo, usuarios y reservas reales.
2. Completar las fases 4 y 5 para cerrar el flujo de compra y ticket.
3. Completar las fases 6 y 7 para cubrir usuarios y operación administrativa.
4. Completar la fase 8 para pulir la experiencia.
5. Completar la fase 9 antes de publicar una versión estable.

## Roadmap de mejoras priorizadas

Estas fases complementan las funcionalidades actuales y deben ejecutarse en el orden indicado.

### Fase 10: Seguridad y configuración

#### Objetivo
Cerrar los riesgos de autorización y preparar configuraciones separadas para desarrollo, pruebas y producción.

### Tareas

- [x] Ignorar el campo `role` enviado durante el registro público.
- [x] Crear siempre usuarios públicos con rol `CLIENT`.
- [ ] Restringir la asignación de roles `ADMIN` y `SCANNER` a una operación administrativa segura.
- [x] Añadir pruebas que verifiquen que un cliente no puede elevar sus privilegios.
- [ ] Separar variables de entorno para desarrollo, staging y producción.
- [x] Eliminar credenciales y secretos de valores predeterminados en producción.
- [ ] Configurar una URL de API obligatoria y validada por entorno.
- [x] Revisar CORS, límites de solicitudes y cabeceras de seguridad.

#### Criterio de terminado
Un usuario no puede obtener privilegios administrativos mediante el registro ni modificar la configuración sensible desde el cliente.

### Fase 11: Reservas y pagos de producción

#### Objetivo
Convertir el flujo demo en un proceso de compra confiable y auditable.

### Tareas

- [ ] Elegir Stripe o PayPhone como proveedor definitivo.
- [ ] Configurar credenciales mediante variables de entorno seguras.
- [ ] Implementar creación de intención o sesión de pago en el backend.
- [ ] Implementar webhook firmado del proveedor.
- [ ] Añadir idempotencia para evitar cobros y reservas duplicadas.
- [ ] Confirmar la reserva solo después de verificar el pago.
- [ ] Mostrar estados de procesamiento, aprobado, rechazado y cancelado.
- [ ] Probar expiración de reservas y conflictos entre dos dispositivos.

#### Criterio de terminado
Una compra no puede quedar pagada sin confirmación verificable del proveedor y cada operación repetida produce un único resultado.

### Fase 12: Cuenta y tickets mejorados

#### Objetivo
Hacer que el usuario pueda recuperar, consultar y utilizar sus entradas con menos dependencia de la conexión.

### Tareas

- [ ] Añadir recuperación y cambio de contraseña.
- [ ] Añadir control para mostrar u ocultar la contraseña.
- [ ] Añadir bloqueo temporal tras intentos fallidos repetidos.
- [ ] Permitir guardar o compartir el ticket digital.
- [ ] Preparar tickets activos para consulta sin conexión.
- [ ] Mostrar claramente estados válido, usado y expirado.
- [ ] Añadir preferencias básicas del usuario.
- [ ] Añadir confirmación antes de abandonar una reserva pendiente.

#### Criterio de terminado
El usuario puede recuperar el acceso a su cuenta y consultar sus tickets activos aun con conectividad limitada.

### Fase 13: Operación administrativa

#### Objetivo
Convertir el panel administrativo en una herramienta de operación diaria.

### Tareas

- [ ] Crear un dashboard con ventas, reservas, ocupación y eventos próximos.
- [ ] Añadir filtros por evento, fecha, sala y estado.
- [ ] Mostrar disponibilidad y aforo en tiempo real.
- [ ] Añadir historial de validaciones QR.
- [ ] Añadir confirmaciones para eliminar o modificar eventos.
- [ ] Registrar auditoría de acciones administrativas.
- [ ] Mejorar la navegación administrativa sin saturar la barra inferior.
- [ ] Diferenciar con claridad permisos de `ADMIN` y `SCANNER`.

#### Criterio de terminado
Un administrador puede operar eventos y revisar su actividad sin mezclar funciones de cliente ni perder trazabilidad.

### Fase 14: Calidad y publicación

#### Objetivo
Reducir regresiones y preparar una primera versión estable desplegable.

### Tareas

- [ ] Añadir pruebas unitarias para autenticación, roles, reservas y pagos.
- [ ] Añadir pruebas de integración para webhooks y expiración de reservas.
- [ ] Ejecutar pruebas en Android, web y pantallas pequeñas.
- [ ] Verificar estados de carga, error, vacío y reintento en cada flujo.
- [ ] Revisar accesibilidad, contraste, tamaños táctiles y navegación por teclado en web.
- [ ] Configurar logs estructurados y alertas de errores.
- [ ] Ejecutar auditoría de dependencias y corregir vulnerabilidades relevantes.
- [ ] Preparar backups y migraciones de PostgreSQL.
- [ ] Crear una versión etiquetada y documentar el procedimiento de despliegue.

#### Criterio de terminado
El flujo de compra está cubierto por pruebas, los servicios tienen observabilidad básica y existe un procedimiento reproducible de despliegue.

## Validación por fase

Antes de pasar de fase, comprobar:

- [ ] El backend compila sin errores.
- [ ] El frontend compila para Android.
- [ ] PostgreSQL inicia y las migraciones están aplicadas.
- [ ] El flujo de la fase funciona desde un teléfono conectado por LAN.
- [ ] La documentación refleja los cambios realizados.
- [ ] Los cambios están guardados en Git.
