import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Header() {
    return (
        <nav className="bg-white border-b border-gray-100 shadow-md sticky top-0 z-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">

                    {/* Logo */}
                    <Link href="/">
                        <ApplicationLogo className="h-14 w-auto" />
                    </Link>

                    {/* Botón ingresar */}
                    <Link
                        href={route('login')}
                        className="rounded-md bg-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 transition"
                    >
                        Ingresar
                    </Link>

                </div>
            </div>
        </nav>
    );
}