/**
 * TarjetaArea
 * Tarjeta seleccionable para elegir el área responsable del evento.
 *
 * Props:
 * - area: { id_area, nombre, responsable }
 * - seleccionada: boolean
 * - onClick: función al seleccionar
 */

export default function TarjetaArea({ area, seleccionada, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                w-full text-left p-5 rounded-xl border-2 transition duration-200
                hover:shadow-md hover:border-teal-400
                ${seleccionada
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : 'border-gray-200 bg-white'}
            `}
        >
            <h3 className={`text-sm font-bold mb-1 ${seleccionada ? 'text-teal-700' : 'text-gray-800'}`}>
                {area.nombre}
            </h3>
            {area.responsable && (
                <p className="text-xs text-gray-500">
                    {area.responsable}
                </p>
            )}
        </button>
    );
}