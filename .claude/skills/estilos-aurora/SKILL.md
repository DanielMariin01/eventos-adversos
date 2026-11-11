---
name: estilos-aurora
description: Sistema de diseño de AuroraQ (colores, tipografía, radios, sombras, componentes). Usar SIEMPRE que se cree o modifique cualquier UI, página, componente React, CSS, correo o gráfica del proyecto.
---

# Estilos de diseño de AuroraQ

Fuente de verdad: `tailwind.config.js`, `resources/js/theme.js` y `resources/css/app.css`. Si hay conflicto, manda `tailwind.config.js`.

## Regla principal
Usar SIEMPRE los tokens de marca de Tailwind. No introducir colores hex nuevos ni la paleta por defecto de Tailwind (blue-500, red-500, etc.) salvo estados semánticos (éxito/error/advertencia) donde no exista token.

## Colores
| Token | Base (500) | Escala |
|---|---|---|
| `primary` (azul-violeta, color principal) | `#5B6BB1` | 50 `#f2f3f9`, 100 `#e1e4f1`, 200 `#c7cde4`, 300 `#aab2d6`, 400 `#828fc4`, 600 `#4e5c98`, 700 `#404b7c`, 800 `#313a60`, 900 `#232943` |
| `secondary` (teal, acentos) | `#00A09B` | 50 `#ebf7f7`, 100 `#d1eeed`, 200 `#a8dfdd`, 300 `#7acecb`, 400 `#3db7b3`, 600 `#008a85`, 700 `#00706d`, 800 `#005654`, 900 `#003d3b` |
| `accent` (azul acero, apoyo) | `#587EAC` | 50 `#f2f5f8`, 100 `#e1e8f0`, 200 `#c6d3e3`, 300 `#a8bcd4`, 400 `#809dc0`, 600 `#4c6c94`, 700 `#3e5878`, 800 `#30445d`, 900 `#213041` |
| `celeste` | `#E1EEFF` | fondos suaves |
| `ink` | `#3E4043` | texto principal |

Donde Tailwind no aplica (SweetAlert2, Recharts, SVG, HTML inline, correos) importar `COLORS` de `@/theme` (`resources/js/theme.js`). Si se añade un color de marca, actualizar `tailwind.config.js` y `theme.js` a la vez.

## Tipografía
- Fuente: **Poppins** (`font-sans`), ya aplicada en `body`.
- Texto principal: `text-ink`.
- Botones: `text-xs font-semibold uppercase tracking-widest`.

## Forma y sombras
- Tarjetas/paneles/modales: `rounded-card` (16px) + `shadow-card` (`0 4px 24px rgba(91,107,177,0.12)`).
- Botones: `rounded-btn` (8px).
- Scrollbar personalizado: clase `.scroll-teal` (6px, pulgar `#4e5c98`).
- Tablas: clase `.tabla-rayada` (filas `#ffffff` / `#f1f2f4`, hover `#f3f4f6`).
- Plugin `@tailwindcss/forms` activo para inputs.

## Botones
- Primario: `bg-primary-500`, hover `hover:bg-primary-600`, focus `focus:ring-2 focus:ring-primary-400 focus:ring-offset-2`, active `active:bg-primary-700`, deshabilitado `opacity-25`.
- Reutilizar los componentes existentes en `resources/js/Components` (`PrimaryButton`, `SecondaryButton`, `DangerButton`, `Modal`, `TextInput`, `InputLabel`, `InputError`, `Tabla`, `GraficaCard`) antes de crear nuevos.

## Animaciones
- `animate-heartRateIn` / `animate-heartRateOut` (latido, 1s, infinite) para loaders de marca.

## Convenciones
- UI y textos en español.
- Comentarios de sección: `// ── Título ──`.
- Diseño responsive con utilidades Tailwind.
- Tras cambiar `resources/js`: `npm run build` y commitear `public/build` (producción lo usa versionado).

## Deuda conocida (no replicar)
- `Dashboard.jsx` usa colores de la paleta por defecto de Tailwind en gráficas; al tocarlo, migrar a tokens de marca.
- `PrimaryButton` tiene `hover:bg-primary-500` igual al base (sin efecto); usar `hover:bg-primary-600`.
- `resources/css/app.css` tiene el bloque `@tailwind` y `.scroll-teal` duplicados.
- `Components/Welcome/welcome.css` y las vistas de `resources/views/emails` usan hex propios.
