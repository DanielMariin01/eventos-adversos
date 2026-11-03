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
        w-full text-left p-8 rounded-lg border-2 border-l-4 border-l-blue-500 shadow-lg transition duration-200
        flex items-center gap-4 sm:gap-6
        hover:shadow-md hover:scale-[1.07]
        ${seleccionada
                    ? 'border-primary-500 bg-celeste shadow-md'
                    : 'border-transparent bg-white'}
    `}
        >

            {/* Texto */}
            <div className="flex-1 min-w-0">
                <h3 className="text-xl mb-1 text-blue-500">
                    {categoria.nombre}
                </h3>
                {categoria.descripcion && (
                    <p className="text-xs text-gray-700 leading-relaxed">
                        {categoria.descripcion}
                    </p>
                )}
            </div>

            {/* Icono al lado derecho */}
            {icono && (
                <div className="w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl flex items-center justify-center p-3">
                    <img
                        src={icono}
                        alt={categoria.nombre}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                    />
                </div>
            )}

            {/* Check si está seleccionada */}
            {seleccionada && (
                <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </button>
    );
}