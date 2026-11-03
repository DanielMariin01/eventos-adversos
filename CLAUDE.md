# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Reglas absolutas sobre la base de datos (prioridad máxima)

- NUNCA modificar, eliminar ni insertar datos en la base de datos.
- NUNCA ejecutar `php artisan migrate` (en ninguna variante), `migrate:fresh`, `migrate:rollback`, `migrate:reset`, `db:wipe`, `db:seed` ni `tinker`.
- NUNCA ejecutar SQL de escritura (INSERT, UPDATE, DELETE, DROP, TRUNCATE, ALTER, CREATE).
- NUNCA ejecutar tests que usen la base de datos real (`RefreshDatabase`, `DatabaseMigrations`, etc.).
- Si un cambio requiere una migración o tocar datos, no ejecutarla: mostrar el código de la migración o el SQL y esperar aprobación explícita del usuario.
- Si hay duda de si un comando afecta la base de datos, preguntar antes.

## Qué es

AuroraQ: sistema (sector salud, Clínica Central del Eje) para reportar y gestionar eventos adversos. Laravel 11 + Inertia 2 + React 18 + Vite 6, MySQL, Spatie `laravel-permission`, Ziggy, Tailwind 3. UI y dominio en español. Está en producción.

## Comandos

- Dev: `composer dev` (serve + queue + pail + vite) o por separado `php artisan serve` y `npm run dev`
- Build frontend: `npm run build`
- Tests: `php artisan test` · uno solo: `php artisan test --filter=NombreTest`. Los únicos tests son los de Breeze (`tests/Feature/Auth`, `ProfileTest`) y usan base de datos: **no ejecutarlos** (ver reglas de BD arriba).
- Formato PHP: `./vendor/bin/pint`
- No hay linter JS configurado.

## Despliegue (crítico)

- `public/build` **está versionado en git**. Tras cualquier cambio en `resources/js` hay que correr `npm run build` y commitear `public/build`, o producción no ve el cambio.
- `.cpanel.yml` hace `rsync` al hosting excluyendo `.env`, `vendor`, `storage` y `node_modules`. Las dependencias de Composer se instalan aparte en el servidor.

## Arquitectura

**Base de datos:** el repo solo tiene migraciones de `users`, cache, jobs y permisos de Spatie. Las tablas de dominio (`eventos_adversos`, `categorias`, `areas`, `reportantes`, `pacientes`, `planes_mejora`, `revisiones`, `archivos`) **no tienen migración**: se crearon fuera del repo. No asumir columnas; pedir el esquema. Cualquier cambio de BD debe ir en una migración nueva y aditiva, y nunca ejecutar migraciones/seeders sin autorización.

**Convenciones de modelos:** PK `id_<entidad>` (p. ej. `id_eventoAdverso`), FK `fk_<entidad>`; cada modelo declara `$table` y `$primaryKey`. Las FK a usuarios apuntan a `users.id`. `EventoAdverso` guarda `barreras_vulneradas`, `factores_contributivos` y `acciones_inseguras` como JSON (cast `array`).

**Ciclo de vida del evento** (campo `estado`, strings sin enum, repetidos en controladores, `DashboardController` y badges de React):
`en_proceso → analizado → en_mejora → radicado → cerrado`, más `procesado` (acción "cerrar análisis"), `cancelado` (reabrible a `en_proceso`). Si la clasificación del análisis es "Evento adverso no prevenible", "Complicación" o "Atención segura", el evento pasa directo a `cerrado` (`EventoController@guardarAnalisis`). Cambiar estados implica tocar `EventoController`, `PlanMejoraController`, `DashboardController` y los mapas de badges en `Pages/Eventos/{Index,MisEventos,Cancelados}` y `Pages/Mejoras/Index`.

**Flujo:** reportar (`Eventos/Create`, asistente categoría → área → formulario; `store` hace `updateOrCreate` de Reportante/Paciente por cédula y envía mail) → Calidad analiza (`ModalAnalisis`) → Calidad crea plan de mejora y asigna jefe (mail al jefe) → el jefe sube evidencia en `/mis-eventos` (`radicado`) → Calidad cierra el caso.

**Auditoría:** casi cada acción relevante crea un registro `Revision` (tipo + observación de texto). Mantener esta práctica en acciones nuevas.

**Roles:** `administrador`, `calidad`, `jefe`, `reportante`. Middleware `role:` (alias Spatie en `bootstrap/app.php`) protege `/dashboard`, `/usuarios`, `/areas`, `/mejoras`. **Todo `/eventos*` y `/mis-eventos` solo exige `auth`**, sin chequeo de rol; el filtrado del menú en `AuthenticatedLayout.jsx` es solo UX. El rol llega al front como `auth.rol` (`HandleInertiaRequests`). `RoleSeeder` no crea `administrador`.

**Frontend:** páginas en `resources/js/Pages` resueltas por `import.meta.glob`; `app.blade.php` carga la página por componente. Formularios con `useForm`/`router` de Inertia y `route('nombre')` de Ziggy; alias `@/`. Estado local con `useState` (sin store). Excepciones con `fetch` JSON: `eventos.area`, `eventos.reportante`, `eventos.paciente`. Las exportaciones (`eventos.exportar`, `mejoras.exportar`) devuelven JSON y el navegador genera el `.xlsx` con `xlsx`. Tras escribir, los controladores redirigen con `->with('success', ...)`, mostrado vía `flash`. Avisos con SweetAlert2.

**Archivos:** subidos al disco `public` (`eventos/calidad`, `eventos/jefe`, `mejoras`) y registrados en `archivos`; solo pdf/jpg/png ≤10 MB.

## Cuidado al cambiar

- Catálogos (`RELACIONADO_CON`, `BARRERAS`, `CLASIFICACIONES`, etc.) están en `Components/Eventos/ModalAnalisis.jsx`, y `DashboardController` tiene textos quemados que deben coincidir (p. ej. "Caídas intrainstitucionales", "Ulceras por presión", lista de clasificaciones).
- `Reportante::$fillable` no incluye `empresa`, así que no se persiste aunque el formulario y los exports la usen.
- Las rutas `/eventos/...` específicas deben declararse antes que las que llevan `{evento}` en `routes/web.php`.
- El correo a Calidad se envía síncrono a una dirección fija en `EventoController@store`.
- Pacientes sin cédula se guardan con `uniqid('pac_')` como cédula.
- Convenciones: código, columnas, rutas (`modulo.accion`) y textos de UI en español; comentarios de sección `// ── Título ──`.
