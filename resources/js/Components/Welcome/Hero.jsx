
import { Link, usePage } from '@inertiajs/react';

function ArrowIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
    );
}

export default function Hero() {
    const { auth } = usePage().props;

    const getHref = () => {
        if (!auth.user) return route('login');
        if (auth.rol === 'administrador' || auth.rol === 'calidad') return route('dashboard');
        if (auth.rol === 'jefe') return route('dashboard');
        return route('eventos.create');
    };
    return (
        <div className="hero-wrapper">

            {/* ── Sección hero con fondo ── */}
            <section className="hero">

                {/* Overlay teal sobre la imagen de fondo */}
                <div className="hero__overlay" aria-hidden="true" />

                {/* Contenido centrado */}
                <div className="hero__content">
                    <h1 className="hero__title">
                        Reporta eventos adversos de forma{' '}
                        <span className="hero__title-accent">segura y ágil</span>
                    </h1>

                    <p className="hero__subtitle">
                        Plataforma institucional de la Clínica Central del Eje para el registro,
                        seguimiento y análisis de eventos adversos.
                    </p>

                    <div className="hero__actions">
                        <Link href={getHref()} className="hero__btn-primary">
                            {auth.user ? 'Ir al sistema' : 'Registrar un evento'}
                        </Link>

                        <a href="#features" className="hero__btn-secondary">
                            Conoce más <ArrowIcon />
                        </a>
                    </div>
                </div>

            </section>

            {/* ── Imagen de personas que "sale" por debajo ── */}
            <div className="hero__people-wrapper">
                <img
                    src="/imagenes/fondo5.png"
                    alt="Equipo médico de la Clínica Central del Eje"
                    className="hero__people-img"
                />
            </div>

        </div>
    );
}