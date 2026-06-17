export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            © {year}{' '}
            <strong>Clínica Central del Eje</strong>
            {' · '}Todos los derechos reservados
        </footer>
    );
}