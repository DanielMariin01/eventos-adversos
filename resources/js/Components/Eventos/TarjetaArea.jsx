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
        w-full text-left p-5 rounded-r-lg bg-cyan-500 border-2 border-l-4 border-l-violet-600 shadow-md transition duration-200
       
        hover:shadow-md hover:scale-[1.07]
        ${seleccionada
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : 'border-transparent bg-white'}
    `}
        >
            <h3 className="text-sm text-white font-bold mb-1">
                {area.nombre}
            </h3>
            {area.responsable && (
                <p className="text-xs text-white">
                    {area.responsable}
                </p>
            )}
        </button>
    );
}