# tiKets: módulo de estadios

Este documento organiza la construcción del módulo de entradas para partidos en estadios.

## Estado

- [x] Fase 1: Modelo y catálogo de estadios
- [x] Fase 2: Gestión administrativa
- [x] Fase 3: Partidos y disponibilidad
- [x] Fase 4: Compra y tickets QR
- [x] Fase 5: Experiencia móvil
- [ ] Fase 6: Calidad y despliegue

## Fase 1: Modelo y catálogo de estadios

### Objetivo
Representar estadios, sectores, aforo y configuración de localidades.

### Tareas

- [x] Crear modelo de estadios.
- [x] Crear sectores con aforo, código y precio base.
- [x] Guardar la distribución de localidades.
- [x] Crear modelo de partidos y estados operativos.
- [x] Exponer catálogo público de estadios y partidos.
- [x] Validar aforo y distribución en backend.

## Fase 2: Gestión administrativa

### Objetivo
Permitir que una cuenta ADMIN configure la infraestructura y la cartelera deportiva.

### Tareas

- [x] Listar, crear y editar estadios.
- [x] Listar, crear y editar sectores.
- [x] Listar, crear y editar partidos.
- [x] Restringir todas las mutaciones a ADMIN.
- [x] Impedir duplicados de partidos en el mismo estadio y horario.
- [x] Validar que los equipos y fechas sean válidos.

## Fase 3: Partidos y disponibilidad

### Objetivo
Mostrar eventos deportivos y controlar localidades disponibles por partido.

### Tareas

- [x] Mostrar próximos partidos.
- [x] Mostrar estadio, ciudad, fecha y equipos.
- [x] Mostrar sectores, precios y disponibilidad.
- [x] Evitar vender localidades fuera del aforo.
- [x] Evitar vender dos veces la misma localidad.
- [x] Controlar estados programado, en curso, finalizado y cancelado.

## Fase 4: Compra y tickets QR

### Objetivo
Generar entradas digitales verificables para acceder al estadio.

### Tareas

- [x] Reservar una localidad para un usuario autenticado.
- [x] Generar ticket con identificador y hash QR.
- [x] Mostrar ticket en la cuenta del usuario.
- [x] Validar QR una sola vez desde el control de acceso.
- [x] Diferenciar ticket válido, usado, expirado e inválido.
- [ ] Preparar integración con el pago real.

## Fase 5: Experiencia móvil

### Objetivo
Crear un flujo claro y usable para descubrir partidos y comprar entradas.

### Tareas

- [x] Crear pantalla de partidos.
- [x] Crear selección de sector y localidad.
- [x] Crear resumen de compra.
- [x] Crear pantalla de ticket QR.
- [x] Añadir estados de carga, error y vacío.
- [x] Añadir accesibilidad y diseño responsive.

## Fase 6: Calidad y despliegue

### Objetivo
Validar el módulo y prepararlo para producción.

### Tareas

- [x] Añadir pruebas de catálogo y autorización.
- [x] Probar conflictos de localidades.
- [x] Probar validación QR repetida.
- [ ] Probar migraciones y seed.
- [ ] Documentar variables de entorno y endpoints.
- [ ] Ejecutar builds web y Android.
- [ ] Preparar despliegue con PostgreSQL y API.

## Criterio de terminado

Un usuario puede consultar un partido, comprar una localidad, recibir un ticket QR y validarlo una sola vez; una cuenta ADMIN puede configurar estadios, sectores y partidos sin acceder indebidamente a operaciones de cliente.
