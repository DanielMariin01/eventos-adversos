/**
 * PasoEvento
 * Paso 3 del formulario — información del evento adverso.
 *
 * Props:
 * - data: objeto con los valores del formulario
 * - setData: función para actualizar los valores
 * - errors: errores de validación
 */

const BARRERAS_VULNERADAS = [
    'Administrativa',
    'Física',
    'Humana',
    'Natural',
    'No hay barrera vulnerable',
    'Tecnológicas',
];

const FACTORES_CONTRIBUTIVOS = [
    'Ambiente',
    'Contexto institucional',
    'Equipo',
    'Individuo',
    'Organización y gerencia',
    'Paciente',
    'Tarea y tecnología',
];

const ACCIONES_INSEGURAS = [
    'No hay acción insegura',
    'Por acción',
    'Por omisión',
];

const CLASIFICACIONES = [
    'Atención segura',
    'Complicación',
    'Evento adverso no prevenible',
    'Evento adverso prevenible',
    'Evento centinela',
    'Incidente',
];

const RELACIONADO_CON = [
    'Alergias',
    'Asalto sexual en la institución',
    'Agresiones físicas por condiciones de la patología del paciente a él mismo y los demás',
    'Administración equivocada de medicamentos',
    'Acciones relacionadas a trasfusiones',
    'Autolesion instrainstitucional',
    'Autoretiro de dispositivos',
    'Atención inoportuna de los pacientes de consulta externa',
    'Cirugía o procedimiento en parte equivocada o en paciente equivocado',
    'Cirugía o procedimiento cancelado por factores atribuibles a la institución',
    'Caídas intrainstitucionales',
    'Complicación quirúrgica',
    'Deficiencia en la comunicación',
    'Demoras en la atención',
    'Dispositivos y equipos biomédicos',
    'Divulgación no autorizada de la información relacionada con los resultados de pruebas de laboratorio',
    'Daño de la muestra por recolección en tubo incorrecto',
    'Entrega incorrecta de imágenes diagnosticas',
    'Entrega incorrecta de resultados de laboratorio',
    'Entrega incorrecta de historia clínica',
    'Errores en la verificación de identificación de paciente',
    'Egreso inseguro',
    'Fallas en agendamiento de citas',
    'Fallas en manejo medico',
    'Flebitis mecánica',
    'Fuga de pacientes',
    'Infecciones de sitio quirúrgico',
    'Infecciones del torrente sanguíneo o bacteriemias asociado a dispositivo medico',
    'Infecciones del tracto urinario asociada a sonda vesical',
    'Infecciones asociadas a la atención en salud (IAAS)',
    'Identificación errónea del paciente',
    'Ingreso no programado a UCI luego de procedimiento quirurgico',
    'Inadecuada toma y recepción de muestras de laboratorio de los pacientes',
    'Lesiones de piel',
    'Neumonías asociadas a la atención en salud',
    'No realizar el análisis de laboratorio requerido',
    'Perdida de pacientes menores de edad durante su atención',
    'Reacción adversa a medicamentos',
    'Reingreso a urgencias',
    'Reingreso a hospitalización por la misma causa',
    'Reingreso a UCI por la misma causa',
    'Rotulación incorrecta de tubos de muestras de laboratorio',
    'Situación de vulneración de la privacidad o dignidad del usuario',
    'Suicidio de paciente internado',
    'Traslado inseguro',
    'Toma de muestra al paciente equivocado',
    'Ulceras por presión',
    'Venopunción (neumotórax, hemotórax, extravasación)',
];

const CATEGORIZACIONES = [
    'Daño permanente al paciente',
    'Daño temporal al paciente',
    'Evento cercano a la muerte',
    'Muerte',
    'Requiere hospitalización',
    'Requiere tratamiento e intervención medica',
];

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

function CheckboxGrupo({ opciones, valores, onChange }) {
    const toggle = (opcion) => {
        if (valores.includes(opcion)) {
            onChange(valores.filter(v => v !== opcion));
        } else {
            onChange([...valores, opcion]);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {opciones.map(opcion => (
                <label key={opcion} className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={valores.includes(opcion)}
                        onChange={() => toggle(opcion)}
                        className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">{opcion}</span>
                </label>
            ))}
        </div>
    );
}

export default function PasoEvento({ data, setData, errors }) {
    return (
        <div className="space-y-6">

            <Campo label="Fecha del Evento *" error={errors.fecha_evento}>
                <input
                    type="datetime-local"
                    value={data.fecha_evento}
                    onChange={e => setData('fecha_evento', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
            </Campo>

            <Campo label="Descripción del evento *" error={errors.descripcion}>
                <textarea
                    value={data.descripcion}
                    onChange={e => setData('descripcion', e.target.value)}
                    placeholder="Describa detalladamente lo que ocurrió..."
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
                />
            </Campo>

            <Campo label="Barreras vulneradas" error={errors.barreras_vulneradas}>
                <CheckboxGrupo
                    opciones={BARRERAS_VULNERADAS}
                    valores={data.barreras_vulneradas ?? []}
                    onChange={val => setData('barreras_vulneradas', val)}
                />
            </Campo>

            <Campo label="Factores contributivos" error={errors.factores_contributivos}>
                <CheckboxGrupo
                    opciones={FACTORES_CONTRIBUTIVOS}
                    valores={data.factores_contributivos ?? []}
                    onChange={val => setData('factores_contributivos', val)}
                />
            </Campo>

            <Campo label="Acciones inseguras" error={errors.acciones_inseguras}>
                <CheckboxGrupo
                    opciones={ACCIONES_INSEGURAS}
                    valores={data.acciones_inseguras ?? []}
                    onChange={val => setData('acciones_inseguras', val)}
                />
            </Campo>

            <Campo label="Clasificación del evento" error={errors.clasificacion}>
                <select
                    value={data.clasificacion}
                    onChange={e => setData('clasificacion', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                    <option value="">Seleccione la clasificación...</option>
                    {CLASIFICACIONES.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </Campo>

            <Campo label="Relacionado con" error={errors.relacionado_con}>
                <select
                    value={data.relacionado_con}
                    onChange={e => setData('relacionado_con', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                    <option value="">Seleccione...</option>
                    {RELACIONADO_CON.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </Campo>

            <Campo label="Categorización" error={errors.categorizacion}>
                <select
                    value={data.categorizacion}
                    onChange={e => setData('categorizacion', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                    <option value="">Seleccione la categorización...</option>
                    {CATEGORIZACIONES.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </Campo>

        </div>
    );
}