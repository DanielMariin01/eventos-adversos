import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Clínica Central del Eje - Reporte de Eventos Adversos" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

                * { box-sizing: border-box; margin: 0; padding: 0; }

                body {
                    font-family: 'Inter', sans-serif;
                    color: #1a1a2e;
                    background: #ffffff;
                }

                /* ── HEADER ── */
                .header {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    background: rgba(255,255,255,0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid #e5e7eb;
                    padding: 0 2rem;
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .header-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    text-decoration: none;
                }

                .logo-img {
                    height: 42px;
                    width: auto;
                    object-fit: contain;
                }

                .logo-placeholder {
                    height: 42px;
                    width: 42px;
                    background: #14b8a6;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 800;
                    font-size: 1.1rem;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .logo-text {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-weight: 700;
                    font-size: 1rem;
                    color: #0f172a;
                    line-height: 1.2;
                    max-width: 160px;
                }

                .btn-ingresar {
                    background: #14b8a6;
                    color: white;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-weight: 600;
                    font-size: 0.9rem;
                    padding: 0.55rem 1.4rem;
                    border-radius: 8px;
                    text-decoration: none;
                    border: none;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.15s;
                }

                .btn-ingresar:hover {
                    background: #0d9488;
                    transform: translateY(-1px);
                }

                /* ── HERO ── */
                .hero {
                    min-height: calc(100vh - 70px);
                    display: flex;
                    align-items: center;
                    padding: 4rem 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                    gap: 4rem;
                }

                .hero-content {
                    flex: 1;
                    max-width: 560px;
                }

                .hero-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #ccfbf1;
                    color: #0f766e;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.8rem;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    padding: 0.35rem 0.85rem;
                    border-radius: 100px;
                    margin-bottom: 1.5rem;
                }

                .hero-eyebrow::before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    background: #14b8a6;
                    border-radius: 50%;
                }

                .hero-title {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 800;
                    color: #0f172a;
                    line-height: 1.15;
                    margin-bottom: 1.25rem;
                    letter-spacing: -0.02em;
                }

                .hero-title span {
                    color: #14b8a6;
                }

                .hero-subtitle {
                    font-size: 1.05rem;
                    color: #475569;
                    line-height: 1.7;
                    margin-bottom: 2.5rem;
                    max-width: 480px;
                }

                .hero-actions {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    flex-wrap: wrap;
                }

                .btn-primary {
                    background: #14b8a6;
                    color: white;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-weight: 700;
                    font-size: 0.95rem;
                    padding: 0.85rem 2rem;
                    border-radius: 10px;
                    text-decoration: none;
                    border: 2px solid #14b8a6;
                    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 4px 14px rgba(20,184,166,0.3);
                }

                .btn-primary:hover {
                    background: #0d9488;
                    border-color: #0d9488;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(20,184,166,0.35);
                }

                .btn-secondary {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #0f172a;
                    font-family: 'Inter', sans-serif;
                    font-weight: 500;
                    font-size: 0.95rem;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .btn-secondary:hover { color: #14b8a6; }

                .btn-secondary svg {
                    width: 18px;
                    height: 18px;
                    transition: transform 0.2s;
                }

                .btn-secondary:hover svg { transform: translateX(3px); }

                /* Badge de stats */
                .hero-stats {
                    display: flex;
                    gap: 2rem;
                    margin-top: 3rem;
                    padding-top: 2rem;
                    border-top: 1px solid #e2e8f0;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                }

                .stat-value {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 1.6rem;
                    font-weight: 800;
                    color: #0f172a;
                }

                .stat-label {
                    font-size: 0.8rem;
                    color: #64748b;
                    margin-top: 0.1rem;
                }

                /* Hero image */
                .hero-image {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                }

                .hero-image-wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 520px;
                }

                .hero-img {
                    width: 100%;
                    height: auto;
                    border-radius: 20px;
                    object-fit: cover;
                    display: block;
                }

                /* Placeholder si no hay imagen */
                .hero-img-placeholder {
                    width: 100%;
                    aspect-ratio: 4/3;
                    background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 50%, #5eead4 100%);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .hero-img-placeholder svg {
                    width: 80px;
                    height: 80px;
                    color: #0d9488;
                    opacity: 0.5;
                }

                /* Floating badge */
                .floating-badge {
                    position: absolute;
                    bottom: -16px;
                    left: -16px;
                    background: white;
                    border-radius: 14px;
                    padding: 0.9rem 1.2rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 10;
                }

                .badge-icon {
                    width: 38px;
                    height: 38px;
                    background: #ccfbf1;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .badge-icon svg {
                    width: 20px;
                    height: 20px;
                    color: #0d9488;
                }

                .badge-text strong {
                    display: block;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #0f172a;
                }

                .badge-text span {
                    font-size: 0.75rem;
                    color: #64748b;
                }

                /* Blob decorativo */
                .blob {
                    position: absolute;
                    top: -30px;
                    right: -30px;
                    width: 200px;
                    height: 200px;
                    background: radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%);
                    border-radius: 50%;
                    z-index: -1;
                }

                /* ── FEATURES ── */
                .features {
                    background: #f8fafc;
                    padding: 6rem 2rem;
                }

                .section-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }

                .section-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #0f766e;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.8rem;
                    font-weight: 600;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 1rem;
                }

                .section-title {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: clamp(1.6rem, 3vw, 2.2rem);
                    font-weight: 800;
                    color: #0f172a;
                    letter-spacing: -0.02em;
                    margin-bottom: 1rem;
                }

                .section-desc {
                    font-size: 1rem;
                    color: #64748b;
                    max-width: 520px;
                    margin: 0 auto;
                    line-height: 1.7;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                }

                .feature-card {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    border: 1px solid #e2e8f0;
                    transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
                }

                .feature-card:hover {
                    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                    transform: translateY(-4px);
                    border-color: #99f6e4;
                }

                .feature-icon {
                    width: 48px;
                    height: 48px;
                    background: #ccfbf1;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.25rem;
                }

                .feature-icon svg {
                    width: 24px;
                    height: 24px;
                    color: #0d9488;
                }

                .feature-title {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 0.6rem;
                }

                .feature-desc {
                    font-size: 0.9rem;
                    color: #64748b;
                    line-height: 1.65;
                }

                /* ── ABOUT ── */
                .about {
                    padding: 6rem 2rem;
                    background: white;
                }

                .about-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    gap: 5rem;
                    align-items: center;
                }

                .about-visual {
                    flex: 1;
                    position: relative;
                }

                .about-card {
                    background: #f0fdfa;
                    border-radius: 20px;
                    padding: 3rem 2.5rem;
                    border: 1px solid #99f6e4;
                    position: relative;
                    overflow: hidden;
                }

                .about-card::before {
                    content: '';
                    position: absolute;
                    top: -60px;
                    right: -60px;
                    width: 180px;
                    height: 180px;
                    background: radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%);
                    border-radius: 50%;
                }

                .about-card-number {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 4rem;
                    font-weight: 800;
                    color: #14b8a6;
                    line-height: 1;
                    margin-bottom: 0.5rem;
                }

                .about-card-label {
                    font-size: 1rem;
                    color: #0f172a;
                    font-weight: 600;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    margin-bottom: 0.35rem;
                }

                .about-card-sub {
                    font-size: 0.85rem;
                    color: #64748b;
                }

                .about-divider {
                    height: 1px;
                    background: #99f6e4;
                    margin: 1.5rem 0;
                }

                .about-content {
                    flex: 1.2;
                }

                .about-title {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: clamp(1.6rem, 3vw, 2.2rem);
                    font-weight: 800;
                    color: #0f172a;
                    letter-spacing: -0.02em;
                    margin-bottom: 1.25rem;
                    line-height: 1.2;
                }

                .about-title span { color: #14b8a6; }

                .about-text {
                    font-size: 0.97rem;
                    color: #475569;
                    line-height: 1.75;
                    margin-bottom: 1rem;
                }

                .about-list {
                    list-style: none;
                    margin-top: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .about-list li {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    font-size: 0.92rem;
                    color: #334155;
                    line-height: 1.5;
                }

                .about-list li::before {
                    content: '';
                    width: 18px;
                    height: 18px;
                    background: #14b8a6;
                    border-radius: 50%;
                    flex-shrink: 0;
                    margin-top: 1px;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
                    background-size: 11px;
                    background-repeat: no-repeat;
                    background-position: center;
                }

                /* ── FOOTER ── */
                .footer {
                    background: #0f172a;
                    color: #94a3b8;
                    text-align: center;
                    padding: 2rem;
                    font-size: 0.82rem;
                    font-family: 'Inter', sans-serif;
                }

                .footer strong { color: #e2e8f0; }

                /* ── RESPONSIVE ── */
                @media (max-width: 900px) {
                    .hero { flex-direction: column; gap: 3rem; min-height: auto; padding: 3rem 1.5rem; }
                    .hero-content { max-width: 100%; }
                    .about-inner { flex-direction: column; gap: 3rem; }
                }

                @media (max-width: 600px) {
                    .header { padding: 0 1rem; }
                    .logo-text { display: none; }
                    .hero-stats { gap: 1.5rem; }
                    .features { padding: 4rem 1.5rem; }
                    .about { padding: 4rem 1.5rem; }
                }
            `}</style>

            {/* ── HEADER ── */}
            <header className="header">
                <a href="/" className="header-logo">
                    {/* Reemplaza src con la ruta real de tu logo */}
                    {/* <img src="/images/logo.png" alt="Clínica Central del Eje" className="logo-img" /> */}
                    <div className="logo-placeholder">CC</div>
                    <span className="logo-text">Clínica Central del Eje</span>
                </a>

                <Link
                    href={route('login')}
                    className="btn-ingresar"
                >
                    Ingresar
                </Link>
            </header>

            {/* ── HERO ── */}
            <section className="hero">
                <div className="hero-content">
                    

                    <h1 className="hero-title">
                        Reporta eventos adversos de forma <span>segura y ágil</span>
                    </h1>

                    <p className="hero-subtitle">
                        Plataforma institucional de la Clínica Central del Eje para el registro,
                        seguimiento y análisis de eventos adversos. Contribuye a la seguridad
                        del paciente con cada reporte.
                    </p>

                    <div className="hero-actions">
                        <Link href={route('login')} className="btn-primary">
                            Registrar un evento
                        </Link>
                        <a href="#about" className="btn-secondary">
                            Conoce más
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-value">100%</span>
                            <span className="stat-label">Confidencial</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">24/7</span>
                            <span className="stat-label">Disponible</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">ISO</span>
                            <span className="stat-label">Normativo</span>
                        </div>
                    </div>
                </div>

                <div className="hero-image">
                    <div className="blob"></div>
                    <div className="hero-image-wrapper">
                        {/* Reemplaza src con la ruta real de tu imagen hero */}
                        {/* <img src="/images/hero.png" alt="Reporte de eventos adversos" className="hero-img" /> */}
                        <div className="hero-img-placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>

                        <div className="floating-badge">
                            <div className="badge-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div className="badge-text">
                                <strong>Reporte seguro</strong>
                                <span>Datos protegidos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="features" id="features">
                <div className="section-inner">
                    <div className="section-header">
                        <p className="section-eyebrow">¿Por qué reportar?</p>
                        <h2 className="section-title">Todo lo que necesitas en un solo lugar</h2>
                        <p className="section-desc">
                            Nuestro sistema facilita el proceso de reporte y mejora la cultura
                            de seguridad dentro de la institución.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Reporte confidencial</h3>
                            <p className="feature-desc">
                                Tus reportes son gestionados con total confidencialidad. El sistema garantiza
                                la protección de la identidad del reportante en todo momento.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Formulario estructurado</h3>
                            <p className="feature-desc">
                                Formularios claros y guiados que facilitan el registro completo del evento,
                                asegurando la calidad de la información capturada.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Seguimiento en tiempo real</h3>
                            <p className="feature-desc">
                                Consulta el estado de tus reportes y recibe actualizaciones sobre las acciones
                                de mejora implementadas por el equipo de calidad.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Cultura de seguridad</h3>
                            <p className="feature-desc">
                                Cada reporte contribuye a identificar patrones y prevenir futuros incidentes,
                                fortaleciendo la cultura de seguridad del paciente en la clínica.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Disponible 24/7</h3>
                            <p className="feature-desc">
                                Accede al sistema en cualquier momento desde cualquier dispositivo.
                                Reporta sin importar el turno o la hora del evento.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Normativa vigente</h3>
                            <p className="feature-desc">
                                Sistema alineado con los lineamientos del Ministerio de Salud y las
                                políticas de seguridad del paciente establecidas a nivel nacional.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ABOUT ── */}
            <section className="about" id="about">
                <div className="about-inner">
                    <div className="about-visual">
                        <div className="about-card">
                            <div className="about-card-number">+500</div>
                            <div className="about-card-label">Eventos gestionados</div>
                            <div className="about-card-sub">con acciones de mejora implementadas</div>
                            <div className="about-divider"></div>
                            <div className="about-card-number" style={{ fontSize: '2.5rem' }}>98%</div>
                            <div className="about-card-label">Tasa de resolución</div>
                            <div className="about-card-sub">de reportes en los últimos 12 meses</div>
                        </div>
                    </div>

                    <div className="about-content">
                        <p className="section-eyebrow">Sobre el sistema</p>
                        <h2 className="about-title">
                            Comprometidos con la <span>seguridad del paciente</span>
                        </h2>
                        <p className="about-text">
                            La Clínica Central del Eje ha desarrollado este sistema de reporte de eventos
                            adversos como parte de su compromiso con la mejora continua y la seguridad
                            en la atención en salud.
                        </p>
                        <p className="about-text">
                            Entendemos que reportar no significa señalar errores, sino aprender de ellos.
                            Cada reporte es una oportunidad para fortalecer nuestros procesos y proteger
                            a nuestros pacientes.
                        </p>

                        <ul className="about-list">
                            <li>Proceso de reporte simple y sin barreras administrativas</li>
                            <li>Equipo de calidad dedicado al análisis de cada evento</li>
                            <li>Retroalimentación oportuna a los reportantes</li>
                            <li>Implementación de planes de mejora basados en evidencia</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="footer">
                © {new Date().getFullYear()} <strong>Clínica Central del Eje</strong> · Sistema de Reporte de Eventos Adversos · Todos los derechos reservados
            </footer>
        </>
    );
}