# tiKets: módulo de estadios

Este documento organiza la construcción del módulo de entradas para partidos en estadios.

## Estado

- [ ] Fase 1: Modelo y catálogo de estadios
- [ ] Fase 2: Gestión administrativa
- [ ] Fase 3: Partidos y disponibilidad
- [ ] Fase 4: Compra y tickets QR
- [ ] Fase 5: Experiencia móvil
- [ ] Fase 6: Calidad y despliegue

## Fase 1: Modelo y catálogo de estadios

### Objetivo
Representar estadios, sectores, aforo y configuración de localidades.

### Tareas

- [ ] Crear modelo de estadios.
- [ ] Crear sectores con aforo, código y precio base.
- [ ] Guardar la distribución de localidades.
- [ ] Crear modelo de partidos y estados operativos.
- [ ] Exponer catálogo público de estadios y partidos.
- [ ] Validar aforo y distribución en backend.

## Fase 2: Gestión administrativa

### Objetivo
Permitir que una cuenta ADMIN configure la infraestructura y la cartelera deportiva.

### Tareas

- [ ] Listar, crear y editar estadios.
- [ ] Listar, crear y editar sectores.
- [ ] Listar, crear y editar partidos.
- [ ] Restringir todas las mutaciones a ADMIN.
- [ ] Impedir duplicados de partidos en el mismo estadio y horario.
- [ ] Validar que los equipos y fechas sean válidos.

## Fase 3: Partidos y disponibilidad

### Objetivo
Mostrar eventos deportivos y controlar localidades disponibles por partido.

### Tareas

- [ ] Mostrar próximos partidos.
- [ ] Mostrar estadio, ciudad, fecha y equipos.
- [ ] Mostrar sectores, precios y disponibilidad.
- [ ] Evitar vender localidades fuera del aforo.
- [ ] Evitar vender dos veces la misma localidad.
- [ ] Controlar estados programado, en curso, finalizado y cancelado.

## Fase 4: Compra y tickets QR

### Objetivo
Generar entradas digitales verificables para acceder al estadio.

### Tareas

- [ ] Reservar una localidad para un usuario autenticado.
- [ ] Generar ticket con identificador y hash QR.
- [ ] Mostrar ticket en la cuenta del usuario.
- [ ] Validar QR una sola vez desde el control de acceso.
- [ ] Diferenciar ticket válido, usado, expirado e inválido.
- [ ] Preparar integración con el pago real.

## Fase 5: Experiencia móvil

### Objetivo
Crear un flujo claro y usable para descubrir partidos y comprar entradas.

### Tareas

- [ ] Crear pantalla de partidos.
- [ ] Crear selección de sector y localidad.
- [ ] Crear resumen de compra.
- [ ] Crear pantalla de ticket QR.
- [ ] Añadir estados de carga, error y vacío.
- [ ] Añadir accesibilidad y diseño responsive.

## Fase 6: Calidad y despliegue

### Objetivo
Validar el módulo y prepararlo para producción.

### Tareas

- [ ] Añadir pruebas de catálogo y autorización.
- [ ] Probar conflictos de localidades.
- [ ] Probar validación QR repetida.
- [ ] Probar migraciones y seed.
- [ ] Documentar variables de entorno y endpoints.
- [ ] Ejecutar builds web y Android.
- [ ] Preparar despliegue con PostgreSQL y API.

## Criterio de terminado

Un usuario puede consultar un partido, comprar una localidad, recibir un ticket QR y validarlo una sola vez; una cuenta ADMIN puede configurar estadios, sectores y partidos sin acceder indebidamente a operaciones de cliente.
