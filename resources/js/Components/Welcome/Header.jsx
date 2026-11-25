import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Header() {
    const { auth } = usePage().props;
    const getHref = () => {
        if (!auth.user) return route('login');
        const roles = auth.roles ?? [];
        if (roles.includes('administrador') || roles.includes('calidad')) return route('dashboard');
        if (roles.includes('tecnovigilancia')) return route('tecnovigilancia.index');
        if (roles.includes('farmacovigilancia')) return route('farmacovigilancia.index');
        if (roles.includes('gestor_usuarios') && !roles.includes('jefe')) return route('usuarios.index');
        if (roles.includes('jefe')) return route('dashboard');
        return route('eventos.create');
    };
    return (
        <nav className="bg-white border-b border-gray-100 shadow-md sticky top-0 z-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">

                    {/* Logo */}
                    <Link href="/">
                        <ApplicationLogo className="h-14 w-auto" />
                    </Link>

                    <Link
                        href={getHref()}
                        className="rounded-md bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 transition"
                    >
                        {auth.user ? 'Ingresar' : 'Ingresar'}
                    </Link>

                </div>
            </div>
        </nav>
    );
}