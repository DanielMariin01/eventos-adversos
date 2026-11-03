/**
 * PasoTecnovigilancia
 * Paso 3 del formulario cuando la categoría es "Tecnovigilancia" —
 * reemplaza a PasoEvento con las preguntas propias de tecnovigilancia.
 *
 * Props:
 * - data: objeto con los valores del formulario
 * - setData: función para actualizar los valores
 * - errors: errores de validación
 */

function Campo({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

const inputClase = "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500";

const OPCIONES_DETECCION = ['Antes del uso del DM', 'Durante el uso del DM', 'Después del uso del DM'];
const OPCIONES_CLASIFICACION = [
    'Evento adverso no serio',
    'Evento adverso serio',
    'Incidente adverso no serio',
    'Incidente adverso serio',
];
const OPCIONES_DESENLACE = [
    'Muerte',
    'Enfermedad o daño que amenace la vida',
    'Daño de una función o estructura corporal',
    'Hospitalización inicial o prolongada',
    'Requiere intervención médica o quirúrgica, para prevenir un daño permanente de una estructura o función corporal',
    'No hubo daño',
    'Otro',
];

export default function PasoTecnovigilancia({ data, setData, errors }) {
    return (
        <div className="space-y-6">
            <div className="col-span-1 md:col-span-2 bg-teal-500 rounded-lg px-4 py-3">
                <h3 className="text-white font-semibold text-xs uppercase">Tecnovigilancia</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Campo label="Fecha del evento/incidente adverso *" error={errors.fecha_evento}>
                    <input
                        type="date"
                        value={data.fecha_evento}
                        onChange={e => setData('fecha_evento', e.target.value)}
                        className={inputClase}
                    />
                </Campo>

                <Campo label="Nombre del dispositivo médico *" error={errors.tec_nombre_dispositivo}>
                    <input
                        type="text"
                        value={data.tec_nombre_dispositivo}
                        onChange={e => setData('tec_nombre_dispositivo', e.target.value)}
                        placeholder="Ingrese el nombre del dispositivo"
                        className={inputClase}
                    />
                </Campo>

                <Campo label="Marca *" error={errors.tec_marca}>
                    <input
                        type="text"
                        value={data.tec_marca}
                        onChange={e => setData('tec_marca', e.target.value)}
                        placeholder="Ingrese la marca"
                        className={inputClase}
                    />
                </Campo>

                <Campo label="Modelo *" error={errors.tec_modelo}>
                    <input
                        type="text"
                        value={data.tec_modelo}
                        onChange={e => setData('tec_modelo', e.target.value)}
                        placeholder="Ingrese el modelo"
                        className={inputClase}
                    />
                </Campo>

                <Campo label="Serie *" error={errors.tec_serie}>
                    <input
                        type="text"
                        value={data.tec_serie}
                        onChange={e => setData('tec_serie', e.target.value)}
                        placeholder="Ingrese la serie"
                        className={inputClase}
                    />
                </Campo>

                <Campo label="Área de funcionamiento del dispositivo médico en el momento del evento/incidente *" error={errors.tec_area_funcionamiento_dm}>
                    <input
                        type="text"
                        value={data.tec_area_funcionamiento_dm}
                        onChange={e => setData('tec_area_funcionamiento_dm', e.target.value)}
                        placeholder="Ingrese el área"
                        className={inputClase}
                    />
                </Campo>

                <Campo label="¿El dispositivo médico ha sido utilizado más de una vez? *" error={errors.tec_uso_mas_de_una_vez}>
                    <select
                        value={data.tec_uso_mas_de_una_vez}
                        onChange={e => setData('tec_uso_mas_de_una_vez', e.target.value)}
                        className={inputClase}
                    >
                        <option value="">Seleccione...</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                    </select>
                </Campo>

                <Campo label="Detección del evento/incidente adverso *" error={errors.tec_deteccion_evento}>
                    <select
                        value={data.tec_deteccion_evento}
                        onChange={e => setData('tec_deteccion_evento', e.target.value)}
                        className={inputClase}
                    >
                        <option value="">Seleccione...</option>
                        {OPCIONES_DETECCION.map(op => (
                            <option key={op} value={op}>{op}</option>
                        ))}
                    </select>
                </Campo>

                <Campo label="Clasificación *" error={errors.tec_clasificacion}>
                    <select
                        value={data.tec_clasificacion}
                        onChange={e => setData('tec_clasificacion', e.target.value)}
                        className={inputClase}
                    >
                        <option value="">Seleccione...</option>
                        {OPCIONES_CLASIFICACION.map(op => (
                            <option key={op} value={op}>{op}</option>
                        ))}
                    </select>
                </Campo>

                <Campo label="Desenlace del evento o incidente adverso *" error={errors.tec_desenlace}>
                    <select
                        value={data.tec_desenlace}
                        onChange={e => setData('tec_desenlace', e.target.value)}
                        className={inputClase}
                    >
                        <option value="">Seleccione...</option>
                        {OPCIONES_DESENLACE.map(op => (
                            <option key={op} value={op}>{op}</option>
                        ))}
                    </select>
                </Campo>
            </div>

            <Campo label="Diagnóstico inicial del paciente *" error={errors.tec_diagnostico_inicial}>
                <textarea
                    value={data.tec_diagnostico_inicial}
                    onChange={e => setData('tec_diagnostico_inicial', e.target.value)}
                    placeholder="Describa el diagnóstico inicial..."
                    rows={3}
                    className={inputClase}
                />
            </Campo>

            <Campo label="Descripción del evento *" error={errors.descripcion}>
                <textarea
                    value={data.descripcion}
                    onChange={e => setData('descripcion', e.target.value)}
                    placeholder="Describa detalladamente lo que ocurrió..."
                    rows={3}
                    className={inputClase}
                />
            </Campo>
        </div>
    );
}
