import { Head } from '@inertiajs/react';

import Header from '@/Components/Welcome/Header';
import Hero from '@/Components/Welcome/Hero';
import Features from '@/Components/Welcome/Features';
import About from '@/Components/Welcome/About';
import Footer from '@/Components/Welcome/Footer';

import '@/Components/Welcome/welcome.css';

export default function Welcome() {
    return (
        <>
            <Head title="Clínica Central del Eje — Reporte de Eventos Adversos" />
            <Header />
            <main>
                <Hero />
                <Features />
                <About />
            </main>
            <Footer />
        </>
    );
}