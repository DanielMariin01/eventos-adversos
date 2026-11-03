import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// ── Sesión/token expirado (419) ──
// Cuando el token CSRF o la sesión expiran, el servidor responde con la página
// de error 419 completa en vez de una respuesta Inertia, y por defecto Inertia
// la muestra en un modal oscuro crudo. Interceptamos ese caso para recargar la
// página en su lugar (si la sesión expiró, el reload llevará al login).
router.on('invalid', (event) => {
    const status = event.detail.response?.status;

    if (status === 419) {
        event.preventDefault();
        Swal.fire({
            icon: 'info',
            title: 'Sesión expirada',
            text: 'Tu sesión expiró por inactividad. La página se recargará.',
            confirmButtonColor: '#14b8a6',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
        }).then(() => {
            window.location.reload();
        });
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
