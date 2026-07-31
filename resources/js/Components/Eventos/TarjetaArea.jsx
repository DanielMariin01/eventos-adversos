/**
 * TarjetaArea
 * Tarjeta seleccionable para elegir el área responsable del evento.
 *
 * Props:
 * - area: { id_area, nombre, responsable }
 * - seleccionada: boolean
 * - onClick: función al seleccionar
 */

import {
    Stethoscope,
    Users,
    AlertTriangle,
    Pill,
    Building2,
    Phone,
    Receipt,
    Monitor,
    ShoppingCart,
    Microscope,
    FlaskConical,
    Heart,
} from 'lucide-react';

const ICONOS_AREA = {
    'Imágenes diagnósticas': Stethoscope,
    'Consulta externa': Users,
    'Urgencias': AlertTriangle,
    'Cirugía': Heart,
    'Hospitalización': Building2,
    'Oncología': Microscope,
    'Laboratorio': FlaskConical,
    'Patología': Microscope,
    'Gestión pretrasfusional': Heart,
    'Call center': Phone,
    'Facturación': Receipt,
    'Sistemas': Monitor,
    'Compras': ShoppingCart,
    'Servicio Farmacéutico': Pill,
    'Infraestructura': Building2,
};

export default function TarjetaArea({ area, seleccionada, onClick }) {
    const Icono = ICONOS_AREA[area.nombre] ?? Building2;

    return (
        <button
            type="button"
            onClick={onClick}
            className="relative w-full border-2 border-violet-500 flex flex-col items-center rounded-[20px] bg-white overflow-hidden shadow-md transition duration-200 hover:shadow-xl focus:outline-none"
            style={{ height: '280px' }}
        >
            {/* Imagen de fondo superior */}
            <div className="w-full h-28 flex-shrink-0 overflow-hidden rounded-t-[20px]">
                <img
                    src="/imagenes/fondo2.png"
                    alt="fondo"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Avatar — centrado sobre la línea imagen/contenido */}
            <div className="absolute top-[76px] w-[80px] h-[80px] bg-white rounded-full flex justify-center items-center shadow-md border-4 border-white">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${seleccionada ? 'bg-cyan-500' : 'bg-cyan-500'}`}>
                    <Icono className="w-8 h-8 text-white" />
                </div>
            </div>

            {/* Contenido inferior */}
            <div className="flex flex-col items-center px-4 pb-3 pt-1">
                <h3 className="mt-10 font-semibold text-sm text-gray-900 text-center leading-tight">
                    {area.nombre}
                </h3>
                <p className="mt-1 text-xs text-[#78858F] text-center leading-snug">
                    {area.jefe?.name ?? area.responsable ?? 'Sin responsable asignado'}
                </p>

                <div className="mt-3">
                    <span className={`
                        px-3 py-1 text-xs font-bold uppercase border-2 rounded transition duration-200
                        ${seleccionada
                            ? 'bg-teal-500 border-teal-500 text-white'
                            : 'bg-cyan-500 border-cyan-500 text-white hover:bg-cyan-600'}
                    `}>
                        {seleccionada ? '✓ Seleccionada' : 'Seleccionar'}
                    </span>
                </div>
            </div>
        </button>
    );
}