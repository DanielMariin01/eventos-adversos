export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            © {year}{' '}
            <strong>Clínica Central del Eje</strong>
            {' · '}Sistema de Reporte de Eventos Adversos
            {' · '}Todos los derechos reservados
        </footer>
    );
}