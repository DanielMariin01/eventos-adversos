import Lottie from 'lottie-react';

import confidencialIcon from '@/assets/lottie/confidencial.json';
import formularioIcon   from '@/assets/lottie/formulario.json';
import seguimientoIcon  from '@/assets/lottie/seguimiento.json';
import culturaIcon      from '@/assets/lottie/cultura.json';
import disponibleIcon   from '@/assets/lottie/disponible.json';
import normativaIcon    from '@/assets/lottie/normativa.json';

const FEATURES_DATA = [
    {
        id: 'confidential',
        title: 'Reporte confidencial',
        desc: 'Tus reportes son gestionados con total confidencialidad. El sistema garantiza la protección de la identidad del reportante en todo momento.',
        icon: confidencialIcon,
    },
    {
        id: 'form',
        title: 'Formulario estructurado',
        desc: 'Formularios claros y guiados que facilitan el registro completo del evento, asegurando la calidad de la información capturada.',
        icon: formularioIcon,
    },
    {
        id: 'tracking',
        title: 'Seguimiento en tiempo real',
        desc: 'Consulta el estado de tus reportes y recibe actualizaciones sobre las acciones de mejora implementadas por el equipo de calidad.',
        icon: seguimientoIcon,
    },
    {
        id: 'culture',
        title: 'Cultura de seguridad',
        desc: 'Cada reporte contribuye a identificar patrones y prevenir futuros incidentes, fortaleciendo la cultura de seguridad del paciente en la clínica.',
        icon: culturaIcon,
    },
    {
        id: 'availability',
        title: 'Disponible 24/7',
        desc: 'Accede al sistema en cualquier momento desde cualquier dispositivo. Reporta sin importar el turno o la hora del evento.',
        icon: disponibleIcon,
    },
    {
        id: 'normative',
        title: 'Normativa vigente',
        desc: 'Sistema alineado con los lineamientos del Ministerio de Salud y las políticas de seguridad del paciente establecidas a nivel nacional.',
        icon: normativaIcon,
    },
];

function FeatureCard({ title, desc, icon }) {
    return (
        <div className="feature-card">
            <div className="feature-card__icon">
                <Lottie
                    animationData={icon}
                    loop={true}
                    style={{ width: 48, height: 48 }}
                />
            </div>
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