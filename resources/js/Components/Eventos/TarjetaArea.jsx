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
            className="relative w-full flex flex-col items-center rounded-[20px] bg-white overflow-hidden transition duration-200 hover:shadow-xl focus:outline-none"
            style={{ height: '384px' }}
        >
            {/* Fondo geométrico superior */}
            <div
                className="w-full h-48 flex-shrink-0 rounded-t-[20px]"
                style={{
                    background: `
                        conic-gradient(from 0deg at 68.4% 85.35%, #fff0 0 60deg, #38bba7 0 120deg, #159380 0 202.5deg, #fff0 0 360deg) 50%/20vmin 25vmin,
                        conic-gradient(from 0deg at 31.6% 85.35%, #fff0 0 157.5deg, #17a18c 0 240deg, #38bba7 0 300deg, #fff0 0 360deg) 50%/20vmin 25vmin,
                        conic-gradient(from 0deg at 81.35% 35.5%, #fff0 0 22.75deg, #128070 0 157.25deg, #fff0 0 360deg) 50%/20vmin 25vmin,
                        conic-gradient(from 0deg at 18.65% 35.5%, #fff0 0 202.75deg, #01685b 0 337.25deg, #fff0 0 360deg) 50%/20vmin 25vmin,
                        conic-gradient(from 0deg at 50% 50%, #fff0 0 60deg, #17a18c 0 157.5deg, #01685b 0 180.1deg, #128070 0 202.5deg, #159380 0 300deg, #fff0 0 360deg) 50%/20vmin 25vmin,
                        conic-gradient(from 0deg at 50% 21.15%, #fff0 0 22.5deg, #159380 0 120deg, #38bba7 0 240deg, #17a18c 0 337.5deg, #fff0 0 360deg) 50%/20vmin 25vmin,
                        linear-gradient(90deg, #128070 0 50%, #01685b 0 100%) 50%/20vmin 25vmin
                    `,
                }}
            />

            {/* Avatar central */}
            <div className="absolute top-[calc(50%-57px)] w-[114px] h-[114px] bg-white rounded-full flex justify-center items-center shadow-md border-4 border-white">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${seleccionada ? 'bg-teal-500' : 'bg-teal-100'}`}>
                    <Icono className={`w-10 h-10 ${seleccionada ? 'text-white' : 'text-teal-600'}`} />
                </div>
            </div>

            {/* Contenido inferior */}
            <div className="flex flex-col items-center px-4 pb-4">
                <h3 className="mt-[60px] font-medium text-[18px] text-gray-900 text-center leading-tight">
                    {area.nombre}
                </h3>
                <p className="mt-2 font-normal text-[15px] text-[#78858F] text-center leading-snug">
                    {area.responsable ?? 'Sin responsable asignado'}
                </p>

                <div className="mt-4 flex gap-3">
                    <span className={`
                        px-4 py-1.5 text-xs font-bold uppercase border-2 rounded transition duration-200
                        ${seleccionada
                            ? 'bg-teal-500 border-teal-500 text-white'
                            : 'bg-white border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'}
                    `}>
                        {seleccionada ? '✓ Seleccionada' : 'Seleccionar'}
                    </span>
                </div>
            </div>
        </button>
    );
}