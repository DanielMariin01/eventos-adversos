import { Link } from '@inertiajs/react';

// Para usar tu imagen hero real, reemplaza el comentario por:
// import heroSrc from '@/assets/images/hero.png';

const STATS = [
    { value: '100%', label: 'Confidencial' },
    { value: '24/7', label: 'Disponible' },
    { value: 'ISO', label: 'Normativo' },
];

function ArrowIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    );
}

function DocumentIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}

export default function Hero() {
    return (
        <section className="hero">

            {/* ── Columna izquierda: texto ── */}
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
                    <Link href={route('login')} className="hero__btn-primary">
                        Registrar un evento
                    </Link>

                    <a href="#about" className="hero__btn-secondary">
                        Conoce más <ArrowIcon />
                    </a>
                </div>

              
            </div>
            {/* ── Columna derecha: imagen ── */}
            <div className="hero__image">
                <div className="hero__blob" aria-hidden="true" />

                <div className="hero__image-wrapper">
                    <img
                        src="/imagenes/fondo.jpg"
                        alt="Profesional de salud usando el sistema de reportes"
                        className="hero__img"
                    />

              
                </div>
            </div>

        </section>
    );
}