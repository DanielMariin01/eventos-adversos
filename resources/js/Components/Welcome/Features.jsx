/* ─────────────────────────────────────────────
   Features.jsx
   Cada feature es un objeto en FEATURES_DATA.
   Para agregar o quitar tarjetas basta con
   editar ese array, sin tocar el JSX.
───────────────────────────────────────────── */

const FEATURES_DATA = [
    {
        id: 'confidential',
        title: 'Reporte confidencial',
        desc: 'Tus reportes son gestionados con total confidencialidad. El sistema garantiza la protección de la identidad del reportante en todo momento.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
    },
    {
        id: 'form',
        title: 'Formulario estructurado',
        desc: 'Formularios claros y guiados que facilitan el registro completo del evento, asegurando la calidad de la información capturada.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
    },
    {
        id: 'tracking',
        title: 'Seguimiento en tiempo real',
        desc: 'Consulta el estado de tus reportes y recibe actualizaciones sobre las acciones de mejora implementadas por el equipo de calidad.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        id: 'culture',
        title: 'Cultura de seguridad',
        desc: 'Cada reporte contribuye a identificar patrones y prevenir futuros incidentes, fortaleciendo la cultura de seguridad del paciente en la clínica.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        id: 'availability',
        title: 'Disponible 24/7',
        desc: 'Accede al sistema en cualquier momento desde cualquier dispositivo. Reporta sin importar el turno o la hora del evento.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        id: 'normative',
        title: 'Normativa vigente',
        desc: 'Sistema alineado con los lineamientos del Ministerio de Salud y las políticas de seguridad del paciente establecidas a nivel nacional.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
];

function FeatureCard({ title, desc, icon }) {
    return (
        <div className="feature-card">
            <div className="feature-card__icon">{icon}</div>
            <h3 className="feature-card__title">{title}</h3>
            <p className="feature-card__desc">{desc}</p>
        </div>
    );
}

export default function Features() {
    return (
        <section className="features" id="features">
            <div className="section-inner">

                <div className="features__header">
                    <p className="section-eyebrow">¿Por qué reportar?</p>
                    <h2 className="section-title">Todo lo que necesitas en un solo lugar</h2>
                    <p className="features__desc">
                        Nuestro sistema facilita el proceso de reporte y mejora la cultura
                        de seguridad dentro de la institución.
                    </p>
                </div>

                <div className="features__grid">
                    {FEATURES_DATA.map((feature) => (
                        <FeatureCard key={feature.id} {...feature} />
                    ))}
                </div>

            </div>
        </section>
    );
}