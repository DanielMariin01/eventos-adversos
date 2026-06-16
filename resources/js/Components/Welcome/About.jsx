/* ─────────────────────────────────────────────
   About.jsx
   Para editar los puntos de la lista solo
   toca el array CHECKPOINTS.
───────────────────────────────────────────── */

const STATS = [
    { value: '+500', label: 'Eventos gestionados', sub: 'con acciones de mejora implementadas' },
    { value: '98%', label: 'Tasa de resolución', sub: 'de reportes en los últimos 12 meses' },
];

const CHECKPOINTS = [
    'Proceso de reporte simple y sin barreras administrativas',
    'Equipo de calidad dedicado al análisis de cada evento',
    'Retroalimentación oportuna a los reportantes',
    'Implementación de planes de mejora basados en evidencia',
];

function CheckIcon() {
    return (
        <span className="about__list-check" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </span>
    );
}

export default function About() {
    return (
        <section className="about" id="about">
            <div className="section-inner">
                <div className="about__inner">

                    {/* ── Tarjeta de estadísticas ── */}
                    <div className="about__visual">
                        <div className="about__card">
                            {STATS.map(({ value, label, sub }, i) => (
                                <div key={value}>
                                    {i > 0 && <div className="about__card-divider" />}
                                    <p className="about__card-number">{value}</p>
                                    <p className="about__card-label">{label}</p>
                                    <p className="about__card-sub">{sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Texto descriptivo ── */}
                    <div className="about__content">
                        <p className="section-eyebrow">Sobre el sistema</p>

                        <h2 className="about__title">
                            Comprometidos con la{' '}
                            <span className="about__title-accent">seguridad del paciente</span>
                        </h2>

                        <p className="about__text">
                            La Clínica Central del Eje ha desarrollado este sistema de reporte de eventos
                            adversos como parte de su compromiso con la mejora continua y la seguridad
                            en la atención en salud.
                        </p>
                        <p className="about__text">
                            Entendemos que reportar no significa señalar errores, sino aprender de ellos.
                            Cada reporte es una oportunidad para fortalecer nuestros procesos y proteger
                            a nuestros pacientes.
                        </p>

                        <ul className="about__list" aria-label="Compromisos del sistema">
                            {CHECKPOINTS.map((item) => (
                                <li key={item}>
                                    <CheckIcon />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
}