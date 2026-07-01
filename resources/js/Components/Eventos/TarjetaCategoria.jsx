/**
 * TarjetaCategoria
 * Tarjeta seleccionable para elegir la categoría del evento adverso.
 *
 * Props:
 * - categoria: { id_categoria, nombre, descripcion }
 * - seleccionada: boolean
 * - onClick: función al seleccionar
 */

const ICONOS = {
    'Biotecnología': '/imagenes/iconos/biotecnologia.svg',
    'Farmacia': '/imagenes/iconos/farmacia.svg',
    'IAAS': '/imagenes/iconos/iaas.svg',
    'Seguridad del Paciente': '/imagenes/iconos/seguridad.svg',
};

export default function TarjetaCategoria({ categoria, seleccionada, onClick }) {
    const icono = ICONOS[categoria.nombre];

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                w-full text-left p-6 rounded-xl border-2 transition duration-200
                flex items-center gap-5
                hover:shadow-md hover:border-teal-400
                ${seleccionada
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : 'border-gray-200 bg-white'}
            `}
        >
            {/* Icono */}
            {icono && (
                <div className={`
                    w-16 h-16 flex-shrink-0 rounded-xl flex items-center justify-center p-2
                    ${seleccionada ? 'bg-teal-100' : 'bg-gray-100'}
                `}>
                    <img
                        src={icono}
                        alt={categoria.nombre}
                        className="w-12 h-12 object-contain"
                    />
                </div>
            )}

            {/* Texto */}
            <div className="flex-1 min-w-0">
                <h3 className={`text-base font-bold mb-1 ${seleccionada ? 'text-teal-700' : 'text-gray-800'}`}>
                    {categoria.nombre}
                </h3>
                {categoria.descripcion && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {categoria.descripcion}
                    </p>
                )}
            </div>

            {/* Check si está seleccionada */}
            {seleccionada && (
                <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </button>
    );
}