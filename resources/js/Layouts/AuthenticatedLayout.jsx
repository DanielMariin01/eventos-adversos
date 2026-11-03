import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { LayoutDashboard, Users, FileText, Menu, X, LogOut, ClipboardCheck, MapPin, ClipboardList, XCircle } from 'lucide-react';
import ChatBot from '@/Components/ChatBot';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const rol = usePage().props.auth.rol;
    const [sidebarAbierto, setSidebarAbierto] = useState(false);

    const menus = [
        {
            title: 'Dashboard',
            url: route('dashboard'),
            icon: LayoutDashboard,
            roles: ['administrador', 'calidad'],
        },
        {
            title: 'Áreas',
            url: route('areas.index'),
            icon: MapPin,
            roles: ['administrador'],
        },
        {
            title: 'Usuarios',
            url: route('usuarios.index'),
            icon: Users,
            roles: ['administrador'],
        },
        {
            title: 'Eventos Adversos',
            url: route('eventos.index'),
            icon: FileText,
            roles: ['administrador', 'calidad'],
        },
        {
            title: 'Planes de Mejora',
            url: route('mejoras.index'),
            icon: ClipboardCheck,
            roles: ['administrador', 'calidad'],
        },
        {
            title: 'Mis Eventos',
            url: route('eventos.mis'),
            icon: ClipboardList,
            roles: ['jefe', 'administrador'],
        },
        {
            title: 'Eventos Cancelados',
            url: route('eventos.cancelados'),
            icon: XCircle,
            roles: ['administrador', 'calidad'],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Overlay */}
            {sidebarAbierto && (
                <div
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={() => setSidebarAbierto(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-ink text-white transform transition-transform duration-300 ease-in-out ${sidebarAbierto ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="relative flex items-center justify-center p-4 border-b border-gray-700">
                    <Link href={route('dashboard')}>
                        <ApplicationLogo className="h-14 w-auto" />
                    </Link>
                    <button onClick={() => setSidebarAbierto(false)} className="absolute right-4 text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {menus
                        .filter(item => item.roles.includes(rol))
                        .map(item => (
                            <Link
                                key={item.title}
                                href={item.url}
                                onClick={() => setSidebarAbierto(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.title}</span>
                            </Link>
                        ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                    <div className="text-xs text-gray-400 mb-3">{user.name}</div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                    </Link>
                </div>
            </div>

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarAbierto(true)}
                                className="text-gray-500 hover:text-gray-700 transition"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <Link href={route('dashboard')}>
                                <ApplicationLogo className="h-14 w-auto" />
                            </Link>
                        </div>

                        <div className="flex items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                                        <img
                                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        {user.name}
                                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Cerrar sesión
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-primary-600 shadow">
                    <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}
            <main>{children}</main>
        </div>
    );
}