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
        <div className="flex items-center justify-center gap-2 mb-8">
            {PASOS.map(({ numero, label }, index) => {
                const activo = pasoActual === numero;
                const completado = pasoActual > numero;

                return (
                    <div key={numero} className="flex items-center">
                        {/* Círculo con número */}
                        <div className="flex flex-col items-center gap-1">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition
                                ${activo ? 'bg-teal-600 text-white shadow-md' : ''}
                                ${completado ? 'bg-teal-100 text-teal-700' : ''}
                                ${!activo && !completado ? 'bg-gray-100 text-gray-400' : ''}
                            `}>
                                {completado ? '✓' : numero}
                            </div>
                            <span className={`text-xs font-medium hidden sm:block
                                ${activo ? 'text-teal-600' : ''}
                                ${completado ? 'text-teal-500' : ''}
                                ${!activo && !completado ? 'text-gray-400' : ''}
                            `}>
                                {label}
                            </span>
                        </div>

                        {/* Línea conectora */}
                        {index < PASOS.length - 1 && (
                            <div className={`w-12 sm:w-20 h-0.5 mx-2 ${completado ? 'bg-teal-400' : 'bg-gray-200'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}