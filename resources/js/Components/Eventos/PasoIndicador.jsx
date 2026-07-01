/**
 * PasoIndicador
 * Muestra el indicador de pasos en la parte superior del formulario.
 *
 * Props:
 * - pasoActual: número del paso activo (1, 2 o 3)
 */

const PASOS = [
    { numero: 1, label: 'Reportante' },
    { numero: 2, label: 'Paciente' },
    { numero: 3, label: 'Evento' },
];

export default function PasoIndicador({ pasoActual }) {
    return (
        <div className="grid grid-cols-3 gap-3 mb-8">
            {PASOS.map(({ numero, label }) => {
                const activo = pasoActual === numero;
                const completado = pasoActual > numero;

                return (
                    <div
                        key={numero}
                        className={`
                            flex items-center gap-3 px-5 py-3 rounded-lg font-semibold text-sm transition
                            ${activo ? 'bg-teal-600 text-white shadow-md' : ''}
                            ${completado ? 'bg-teal-100 text-teal-700' : ''}
                            ${!activo && !completado ? 'bg-gray-100 text-gray-400' : ''}
                        `}
                    >
                        <span className={`
                            w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                            ${activo ? 'bg-white text-teal-600' : ''}
                            ${completado ? 'bg-teal-500 text-white' : ''}
                            ${!activo && !completado ? 'bg-gray-300 text-gray-500' : ''}
                        `}>
                            {completado ? '✓' : numero}
                        </span>
                        {label}
                    </div>
                );
            })}
        </div>
    );
}