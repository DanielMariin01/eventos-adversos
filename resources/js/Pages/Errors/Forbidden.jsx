import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { ShieldAlert, Home, LogOut, UserCheck, Users, MapPin } from 'lucide-react';

const ETIQUETA_ROL = {
    administrador: 'Administrador',
    calidad: 'Calidad',
    jefe: 'Jefe',
    reportante: 'Reportante',
    tecnovigilancia: 'Tecnovigilancia',
    farmacovigilancia: 'Farmacovigilancia',
    gestor_usuarios: 'Gestor de usuarios',
};

// ── Pantalla informativa para el error 403 (sin permiso) ──
export default function Forbidden({ mensaje, ruta, inicio }) {
    const { auth } = usePage().props;
    const conectado = !!auth?.user;
    const roles = auth?.roles ?? [];

    const contenido = (
        <div className="max-w-2xl mx-auto py-10 px-6">
            <div className="bg-white rounded-card shadow-card overflow-hidden">

                {/* Encabezado */}
                <div className="bg-celeste px-8 py-8 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center mb-4">
                        <ShieldAlert className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-ink">No tienes acceso a esta sección</h1>
                    <p className="text-sm text-gray-600 mt-2">
                        El sistema <span className="font-semibold">no está caído</span>. La página existe, pero el usuario con el que
                        ingresaste no tiene permiso para verla.
                    </p>
                </div>

                <div className="px-8 py-6 space-y-6">

                    {/* Quién está conectado */}
                    {conectado ? (
                        <div className="border-2 border-primary-200 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Estás conectado como</p>
                            <p className="text-ink font-semibold">{auth.user.name}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {roles.length === 0 && <span className="text-xs text-gray-500">Sin rol asignado</span>}
                                {roles.map(rol => (
                                    <span key={rol} className="bg-primary-100 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        {ETIQUETA_ROL[rol] ?? rol}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-primary-200 rounded-lg p-4 text-sm text-gray-600">
                            No hay una sesión iniciada. Ingresa con tu usuario para continuar.
                        </div>
                    )}

                    {/* Detalle que escribió el sistema (si lo hay) y la dirección */}
                    {(mensaje || ruta) && (
                        <div className="text-sm text-gray-600 space-y-1">
                            {mensaje && <p><span className="font-semibold text-ink">Detalle:</span> {mensaje}</p>}
                            {ruta && <p><span className="font-semibold text-ink">Dirección solicitada:</span> <span className="break-all">{ruta}</span></p>}
                        </div>
                    )}

                    {/* Qué hacer */}
                    <div>
                        <p className="text-sm font-semibold text-ink mb-3">¿Qué puedes hacer?</p>
                        <ul className="space-y-3 text-sm text-gray-700">
                            <li className="flex gap-3">
                                <UserCheck className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                                <span><span className="font-semibold">Verifica tu usuario.</span> Confirma que ingresaste con tu propio usuario y no con el de otra persona.</span>
                            </li>
                            <li className="flex gap-3">
                                <LogOut className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                                <span><span className="font-semibold">Cambia de usuario.</span> Si tienes otro usuario para esta función, cierra sesión e ingresa con ese.</span>
                            </li>
                            <li className="flex gap-3">
                                <Users className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                                <span><span className="font-semibold">Solicita el acceso.</span> Si crees que deberías tener acceso, pide a un administrador que revise el rol de tu usuario e indícale la dirección de arriba.</span>
                            </li>
                            <li className="flex gap-3">
                                <MapPin className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                                <span><span className="font-semibold">Vuelve a tu página de inicio</span> para seguir trabajando con las secciones que sí tienes disponibles.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Link
                            href={inicio}
                            className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-xs font-semibold uppercase tracking-widest px-4 py-3 rounded-btn transition"
                        >
                            <Home className="w-4 h-4" />
                            {conectado ? 'Ir a mi página de inicio' : 'Ir a iniciar sesión'}
                        </Link>
                        {conectado && (
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex-1 flex items-center justify-center gap-2 border-2 border-primary-300 text-primary-700 hover:bg-primary-50 text-xs font-semibold uppercase tracking-widest px-4 py-3 rounded-btn transition"
                            >
                                <LogOut className="w-4 h-4" />
                                Cerrar sesión e ingresar con otro usuario
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return conectado ? (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white uppercase">Acceso restringido</h2>}>
            <Head title="Acceso restringido" />
            {contenido}
        </AuthenticatedLayout>
    ) : (
        <GuestLayout>
            <Head title="Acceso restringido" />
            {contenido}
        </GuestLayout>
    );
}
